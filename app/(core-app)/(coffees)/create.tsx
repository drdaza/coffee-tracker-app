import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { CustomButton } from "@/components/ui/CustomButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { ThemedText } from "@/components/ui/ThemedText";
import { InteractiveStarRating } from "@/components/common/InteractiveStarRating";
import { EnumPickerModal } from "@/components/common/EnumPickerModal";
import { PickerField } from "@/components/common/PickerField";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeEnumLabels } from "@/hooks/coffee/useCoffeeEnumLabels";
import { useCoffeeFormValidation } from "@/hooks/form/useCoffeeFormValidation";
import { useCoffeeStore } from "@/stores/coffeeStore";
import { RoastLevel, BrewingMethod } from "@/api/coffee/enums";
import { CreateCoffeeDto } from "@/api/coffee/types";
import { AppError } from "@/api/errors";
import { dollarsToCents, sanitizePriceInput } from "@/utils/price";

export default function CreateCoffeeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const errorColor = useThemeColor({}, "error");
  const errorBackground = useThemeColor({}, "errorBackground");

  const { t } = useTranslation();
  const { roastLevelLabels, brewingMethodLabels } = useCoffeeEnumLabels();
  const { errors, validate, clearFieldError, setGeneralError, isFormValid } =
    useCoffeeFormValidation();
  const { createCoffee, isLoading } = useCoffeeStore();

  // Form state
  const [name, setName] = useState("");
  const [roaster, setRoaster] = useState("");
  const [origin, setOrigin] = useState("");
  const [roastLevel, setRoastLevel] = useState<RoastLevel | null>(null);
  const [brewingMethod, setBrewingMethod] = useState<BrewingMethod | null>(
    null,
  );
  const [process, setProcess] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");

  // Picker modal states
  const [showRoastLevelPicker, setShowRoastLevelPicker] = useState(false);
  const [showBrewingMethodPicker, setShowBrewingMethodPicker] = useState(false);

  const handleSubmit = async () => {
    const { isValid } = validate({ name, price });
    if (!isValid) {
      return;
    }

    try {
      setGeneralError(null);

      // Convert price from dollars to cents
      const priceInCents = dollarsToCents(price) ?? 0;

      const coffeeData: CreateCoffeeDto = {
        name: name.trim(),
        roaster: roaster.trim() || "Unknown",
        origin: origin.trim() || "Unknown",
        roastLevel: roastLevel || RoastLevel.MEDIUM,
        brewingMethod: brewingMethod || BrewingMethod.DRIP,
        price: priceInCents,
      };

      // Add optional fields if provided
      if (process.trim()) {
        coffeeData.process = process.trim();
      }
      if (description.trim()) {
        coffeeData.description = description.trim();
      }
      if (rating > 0) {
        coffeeData.rate = rating;
      }

      await createCoffee(coffeeData);

      // Navigate back on success
      // router.back();
    } catch (err) {
      if (err instanceof AppError) {
        setGeneralError(err.getUserMessage());
      } else {
        setGeneralError(t("common.unexpectedError"));
      }
    }
  };

  const handlePriceChange = (text: string) => {
    const sanitized = sanitizePriceInput(text);
    if (sanitized !== null) {
      setPrice(sanitized);
      clearFieldError("price");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("coffees.addCoffee"),
          headerStyle: { backgroundColor },
          headerTintColor: textColor,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Ionicons name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Error Message */}
          {errors.general && (
            <View
              style={[
                styles.errorContainer,
                { backgroundColor: errorBackground },
              ]}
            >
              <Ionicons name="alert-circle" size={20} color={errorColor} />
              <ThemedText style={[styles.errorText, { color: errorColor }]}>
                {errors.general}
              </ThemedText>
            </View>
          )}

          {/* Name Field (Required) */}
          <View style={styles.fieldContainer}>
            <CustomInput
              size="full"
              label={`${t("coffees.name")} *`}
              showLabel
              placeholder={t("coffees.enterCoffeeName")}
              value={name}
              onChangeText={(text) => {
                setName(text);
                clearFieldError("name");
              }}
              autoCapitalize="words"
            />
            {errors.name && (
              <ThemedText style={[styles.fieldError, { color: errorColor }]}>
                {errors.name}
              </ThemedText>
            )}
          </View>

          {/* Roaster Field */}
          <View style={styles.fieldContainer}>
            <CustomInput
              size="full"
              label={t("coffees.roaster")}
              showLabel
              placeholder={t("coffees.enterRoasterName")}
              value={roaster}
              onChangeText={setRoaster}
              autoCapitalize="words"
            />
          </View>

          {/* Origin Field */}
          <View style={styles.fieldContainer}>
            <CustomInput
              size="full"
              label={t("coffees.origin")}
              showLabel
              placeholder={t("coffees.originPlaceholder")}
              value={origin}
              onChangeText={setOrigin}
              autoCapitalize="words"
            />
          </View>

          {/* Roast Level Picker */}
          <PickerField
            label={t("coffees.roastLevel")}
            value={roastLevel ? roastLevelLabels[roastLevel] : null}
            placeholder={t("coffees.selectRoastLevel")}
            onPress={() => setShowRoastLevelPicker(true)}
          />

          {/* Brewing Method Picker */}
          <PickerField
            label={t("coffees.brewingMethod")}
            value={brewingMethod ? brewingMethodLabels[brewingMethod] : null}
            placeholder={t("coffees.selectBrewingMethod")}
            onPress={() => setShowBrewingMethodPicker(true)}
          />

          {/* Process Field */}
          <View style={styles.fieldContainer}>
            <CustomInput
              size="full"
              label={t("coffees.process")}
              showLabel
              placeholder={t("coffees.processPlaceholder")}
              value={process}
              onChangeText={setProcess}
              autoCapitalize="words"
            />
          </View>

          {/* Price Field */}
          <View style={styles.fieldContainer}>
            <ThemedText style={styles.fieldLabel}>
              {t("coffees.priceUsd")}
            </ThemedText>
            <View style={styles.priceInputContainer}>
              <ThemedText style={styles.currencySymbol}>$</ThemedText>
              <CustomInput
                size="full"
                placeholder="0.00"
                value={price}
                onChangeText={handlePriceChange}
                keyboardType="decimal-pad"
                style={styles.priceInput}
                showLabel={false}
              />
            </View>
            {errors.price && (
              <ThemedText style={[styles.fieldError, { color: errorColor }]}>
                {errors.price}
              </ThemedText>
            )}
          </View>

          {/* Rating Field */}
          <View style={styles.fieldContainer}>
            <ThemedText style={styles.fieldLabel}>
              {t("coffees.rating")}
            </ThemedText>
            <View style={styles.ratingContainer}>
              <InteractiveStarRating
                rating={rating}
                onRatingChange={setRating}
                size={36}
              />
              <ThemedText style={styles.ratingText}>
                {rating > 0 ? `${rating}/5` : t("coffees.tapToRate")}
              </ThemedText>
            </View>
            {rating > 0 && (
              <TouchableOpacity
                onPress={() => setRating(0)}
                style={styles.clearRating}
              >
                <ThemedText style={{ color: iconColor, fontSize: 14 }}>
                  {t("coffees.clearRating")}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {/* Description Field */}
          <View style={styles.fieldContainer}>
            <CustomInput
              size="full"
              label={t("coffees.description")}
              showLabel
              placeholder={t("coffees.descriptionPlaceholder")}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={styles.notesInput}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <CustomButton
              type="action"
              size="full"
              label={
                isLoading ? t("coffees.creating") : t("coffees.createCoffee")
              }
              onPress={handleSubmit}
              disabled={isLoading || !isFormValid(name)}
              style={[
                styles.submitButton,
                isLoading || !isFormValid(name)
                  ? styles.submitButtonDisabled
                  : undefined,
              ]}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Roast Level Picker Modal */}
      <EnumPickerModal
        visible={showRoastLevelPicker}
        onClose={() => setShowRoastLevelPicker(false)}
        onSelect={setRoastLevel}
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
        onSelect={setBrewingMethod}
        options={Object.values(BrewingMethod)}
        labels={brewingMethodLabels}
        selectedValue={brewingMethod}
        title={t("coffees.selectBrewingMethod")}
        noneLabel={t("coffees.none")}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerButton: {
    padding: 8,
    marginLeft: -8,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  fieldError: {
    fontSize: 12,
    marginTop: 4,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  ratingText: {
    fontSize: 16,
  },
  clearRating: {
    marginTop: 8,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  submitContainer: {
    marginTop: 20,
  },
  submitButton: {
    paddingVertical: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
});
