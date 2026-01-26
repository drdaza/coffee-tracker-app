import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeEnumLabels } from "@/hooks/coffee/useCoffeeEnumLabels";
import { useCoffeeStore } from "@/stores/coffeeStore";
import { useAuthStore } from "@/stores/authStore";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomButton } from "@/components/ui/CustomButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { EnumPickerModal } from "@/components/common/EnumPickerModal";
import { PickerField } from "@/components/common/PickerField";
import { RoastLevel, BrewingMethod } from "@/api/coffee/enums";
import type { UpdateCoffeeDto, Coffee } from "@/api/coffee/types";
import { AppError } from "@/api/errors";
import { centsToDollars, dollarsToCents, sanitizePriceInput } from "@/utils/price";

export default function EditCoffeeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const {
    coffeeDetail,
    fetchCoffee,
    updateCoffee,
    deleteCoffee,
    isLoading: storeLoading,
  } = useCoffeeStore();

  // Theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "cardBackground");

  const { t } = useTranslation();
  const { roastLevelLabels, brewingMethodLabels } = useCoffeeEnumLabels();

  // Local state
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoastLevelPicker, setShowRoastLevelPicker] = useState(false);
  const [showBrewingMethodPicker, setShowBrewingMethodPicker] = useState(false);

  // Form state - will be pre-filled with existing values
  const [name, setName] = useState("");
  const [roaster, setRoaster] = useState("");
  const [origin, setOrigin] = useState("");
  const [roastLevel, setRoastLevel] = useState<RoastLevel | null>(null);
  const [brewingMethod, setBrewingMethod] = useState<BrewingMethod | null>(
    null
  );
  const [process, setProcess] = useState("");
  const [priceDisplay, setPriceDisplay] = useState(""); // Price in dollars for display
  const [description, setDescription] = useState("");

  // Original values for dirty tracking
  const [originalValues, setOriginalValues] = useState<Partial<Coffee> | null>(
    null
  );

  // Fetch coffee data on mount
  useEffect(() => {
    const loadCoffee = async () => {
      if (!id) {
        setError(t("coffeeDetail.noIdProvided"));
        setInitialLoading(false);
        return;
      }

      try {
        await fetchCoffee(id);
      } catch (err) {
        const errorMessage =
          err instanceof AppError ? err.getUserMessage() : "Failed to load coffee";
        setError(errorMessage);
      } finally {
        setInitialLoading(false);
      }
    };

    loadCoffee();
  }, [id, fetchCoffee]);

  // Pre-fill form when coffee data is loaded
  useEffect(() => {
    if (coffeeDetail && coffeeDetail.id === id) {
      // Check permissions: user must be creator or admin
      const canEdit =
        coffeeDetail.isCreator || user?.role === "ADMIN";

      if (!canEdit) {
        Alert.alert(
          t("common.unauthorized"),
          t("coffeeDetail.noEditPermission"),
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
        return;
      }

      // Pre-fill form fields
      setName(coffeeDetail.name || "");
      setRoaster(coffeeDetail.roaster || "");
      setOrigin(coffeeDetail.origin || "");
      setRoastLevel(coffeeDetail.roastLevel || null);
      setBrewingMethod(coffeeDetail.brewingMethod || null);
      setProcess(coffeeDetail.process || "");
      // Convert cents to dollars for display
      setPriceDisplay(centsToDollars(coffeeDetail.price));
      setDescription(coffeeDetail.description || "");

      // Store original values for dirty tracking
      setOriginalValues({
        name: coffeeDetail.name,
        roaster: coffeeDetail.roaster,
        origin: coffeeDetail.origin,
        roastLevel: coffeeDetail.roastLevel,
        brewingMethod: coffeeDetail.brewingMethod,
        process: coffeeDetail.process,
        price: coffeeDetail.price,
        description: coffeeDetail.description,
      });
    }
  }, [coffeeDetail, id, user]);

  // Build update DTO with only changed fields
  const buildUpdateDto = useCallback((): UpdateCoffeeDto | null => {
    if (!originalValues) return null;

    const updateDto: UpdateCoffeeDto = {};
    let hasChanges = false;

    if (name !== originalValues.name) {
      updateDto.name = name;
      hasChanges = true;
    }

    if (roaster !== originalValues.roaster) {
      updateDto.roaster = roaster;
      hasChanges = true;
    }

    if (origin !== originalValues.origin) {
      updateDto.origin = origin;
      hasChanges = true;
    }

    if (roastLevel !== originalValues.roastLevel) {
      updateDto.roastLevel = roastLevel ?? undefined;
      hasChanges = true;
    }

    if (brewingMethod !== originalValues.brewingMethod) {
      updateDto.brewingMethod = brewingMethod ?? undefined;
      hasChanges = true;
    }

    if (process !== (originalValues.process || "")) {
      updateDto.process = process || undefined;
      hasChanges = true;
    }

    // Convert price from dollars to cents
    const priceInCents = dollarsToCents(priceDisplay);
    if (priceInCents !== originalValues.price) {
      updateDto.price = priceInCents;
      hasChanges = true;
    }

    if (description !== (originalValues.description || "")) {
      updateDto.description = description || undefined;
      hasChanges = true;
    }

    return hasChanges ? updateDto : null;
  }, [
    name,
    roaster,
    origin,
    roastLevel,
    brewingMethod,
    process,
    priceDisplay,
    description,
    originalValues,
  ]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!id) return;

    // Validate required fields
    if (!name.trim()) {
      Alert.alert(t("common.error"), t("validation.nameRequired"));
      return;
    }

    const updateDto = buildUpdateDto();

    if (!updateDto) {
      Alert.alert(t("coffeeDetail.noChanges"), t("coffeeDetail.noChangesMessage"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updateCoffee(id, updateDto);
      Alert.alert(t("common.success"), t("coffeeDetail.updateSuccess"), [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof AppError
          ? err.getUserMessage()
          : t("coffeeDetail.updateError");
      setError(errorMessage);
      Alert.alert(t("common.error"), errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!id) return;

    setShowDeleteModal(false);
    setIsSubmitting(true);

    try {
      await deleteCoffee(id);
      Alert.alert(t("coffeeDetail.deleted"), t("coffeeDetail.deleteSuccess"), [
        {
          text: "OK",
          onPress: () => router.replace("/(coffees)"),
        },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof AppError
          ? err.getUserMessage()
          : t("coffeeDetail.deleteError");
      setError(errorMessage);
      Alert.alert(t("common.error"), errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle price input - only allow valid decimal numbers
  const handlePriceChange = (text: string) => {
    const sanitized = sanitizePriceInput(text);
    if (sanitized !== null) {
      setPriceDisplay(sanitized);
    }
  };

  // Loading state
  if (initialLoading) {
    return <ScreenLayout loading={true} />;
  }

  // Error state
  if (error && !coffeeDetail) {
    return (
      <ScreenLayout
        error={error}
        onRetry={() => {
          setError(null);
          setInitialLoading(true);
          if (id) fetchCoffee(id);
        }}
      />
    );
  }

  return (
    <ScreenLayout>
      <ScrollView
        style={[styles.container, { backgroundColor }]}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText type="title" style={styles.title}>
          {t("coffees.editCoffee")}
        </ThemedText>

        {/* Name Input */}
        <CustomInput
          size="full"
          label={`${t("coffees.name")} *`}
          showLabel
          placeholder={t("coffees.enterCoffeeName")}
          value={name}
          onChangeText={setName}
        />

        {/* Roaster Input */}
        <View style={styles.inputSpacing}>
          <CustomInput
            size="full"
            label={t("coffees.roaster")}
            showLabel
            placeholder={t("coffees.enterRoasterName")}
            value={roaster}
            onChangeText={setRoaster}
          />
        </View>

        {/* Origin Input */}
        <View style={styles.inputSpacing}>
          <CustomInput
            size="full"
            label={t("coffees.origin")}
            showLabel
            placeholder={t("coffees.originPlaceholder")}
            value={origin}
            onChangeText={setOrigin}
          />
        </View>

        {/* Roast Level Picker */}
        <View style={styles.inputSpacing}>
          <PickerField
            label={t("coffees.roastLevel")}
            value={roastLevel ? roastLevelLabels[roastLevel] : null}
            placeholder={t("coffees.selectRoastLevel")}
            onPress={() => setShowRoastLevelPicker(true)}
          />
        </View>

        {/* Brewing Method Picker */}
        <View style={styles.inputSpacing}>
          <PickerField
            label={t("coffees.brewingMethod")}
            value={brewingMethod ? brewingMethodLabels[brewingMethod] : null}
            placeholder={t("coffees.selectBrewingMethod")}
            onPress={() => setShowBrewingMethodPicker(true)}
          />
        </View>

        {/* Process Input */}
        <View style={styles.inputSpacing}>
          <CustomInput
            size="full"
            label={t("coffees.process")}
            showLabel
            placeholder={t("coffees.processPlaceholder")}
            value={process}
            onChangeText={setProcess}
          />
        </View>

        {/* Price Input */}
        <View style={styles.inputSpacing}>
          <CustomInput
            size="full"
            label={t("coffees.priceUsd")}
            showLabel
            placeholder="0.00"
            value={priceDisplay}
            onChangeText={handlePriceChange}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputSpacing}>
          <CustomInput
            size="full"
            label={t("coffees.description")}
            showLabel
            placeholder={t("coffees.descriptionPlaceholder")}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            type="action"
            size="full"
            label={isSubmitting ? t("coffees.saving") : t("coffees.saveChanges")}
            onPress={handleSubmit}
            disabled={isSubmitting || storeLoading}
          />
        </View>

        {/* Delete Button */}
        <View style={styles.deleteButtonContainer}>
          <CustomButton
            type="delete"
            size="full"
            label={t("coffees.deleteCoffee")}
            onPress={() => setShowDeleteModal(true)}
            disabled={isSubmitting || storeLoading}
          />
        </View>

        {/* Cancel Button */}
        <View style={styles.cancelButtonContainer}>
          <CustomButton
            type="base"
            size="full"
            label={t("common.cancel")}
            onPress={() => router.back()}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: cardBackground }]}
          >
            <ThemedText type="subtitle" style={styles.modalTitle}>
              {t("coffees.confirmDelete")}
            </ThemedText>
            <ThemedText style={styles.modalMessage}>
              {t("coffees.deleteConfirmFull")}
            </ThemedText>
            <View style={styles.modalButtons}>
              <CustomButton
                type="base"
                size="medium"
                label={t("common.cancel")}
                onPress={() => setShowDeleteModal(false)}
                style={styles.modalButton}
              />
              <CustomButton
                type="delete"
                size="medium"
                label={t("common.delete")}
                onPress={handleDelete}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Roast Level Picker Modal */}
      <EnumPickerModal
        visible={showRoastLevelPicker}
        onClose={() => setShowRoastLevelPicker(false)}
        onSelect={(value) => {
          setRoastLevel(value);
          setShowRoastLevelPicker(false);
        }}
        options={Object.values(RoastLevel)}
        labels={roastLevelLabels}
        selectedValue={roastLevel}
        title={t("coffees.selectRoastLevel")}
        noneLabel={t("coffees.none")}
      />

      {/* Brewing Method Picker Modal */}
      <EnumPickerModal
        visible={showBrewingMethodPicker}
        onClose={() => setShowBrewingMethodPicker(false)}
        onSelect={(value) => {
          setBrewingMethod(value);
          setShowBrewingMethodPicker(false);
        }}
        options={Object.values(BrewingMethod)}
        labels={brewingMethodLabels}
        selectedValue={brewingMethod}
        title={t("coffees.selectBrewingMethod")}
        noneLabel={t("coffees.none")}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  inputSpacing: {
    marginTop: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 32,
  },
  deleteButtonContainer: {
    marginTop: 16,
  },
  cancelButtonContainer: {
    marginTop: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 12,
  },
  modalMessage: {
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});
