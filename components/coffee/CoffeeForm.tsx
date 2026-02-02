import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { CustomButton } from "@/components/ui/CustomButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { ThemedText } from "@/components/ui/ThemedText";
import { StarRating } from "@/components/common/StarRating";
import { EnumPickerModal } from "@/components/common/EnumPickerModal";
import { PickerField } from "@/components/common/PickerField";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeEnumLabels } from "@/hooks/coffee/useCoffeeEnumLabels";
import { useCoffeeFormValidation } from "@/hooks/form/useCoffeeFormValidation";
import { RoastLevel, BrewingMethod } from "@/api/coffee/enums";
import { sanitizePriceInput } from "@/utils/price";

export interface CoffeeFormData {
  name: string;
  roaster: string;
  origin: string;
  roastLevel: RoastLevel | null;
  brewingMethod: BrewingMethod | null;
  process: string;
  price: string;
  rating: number;
  description: string;
}

export interface CoffeeFormProps {
  initialValues: CoffeeFormData;
  onSubmit: (data: CoffeeFormData) => Promise<void>;
  submitLabel: string;
  loadingLabel: string;
  isLoading: boolean;
  generalError?: string | null;
  onClearError?: () => void;
}

export const CoffeeForm = ({
  initialValues,
  onSubmit,
  submitLabel,
  loadingLabel,
  isLoading,
  generalError,
  onClearError,
}: CoffeeFormProps) => {
  const iconColor = useThemeColor({}, "icon");
  const errorColor = useThemeColor({}, "error");
  const errorBackground = useThemeColor({}, "errorBackground");

  const { t } = useTranslation();
  const { roastLevelLabels, brewingMethodLabels } = useCoffeeEnumLabels();
  const { errors, validate, clearFieldError, isFormValid } =
    useCoffeeFormValidation();

  const [formData, setFormData] = useState<CoffeeFormData>(initialValues);
  const [showRoastLevelPicker, setShowRoastLevelPicker] = useState(false);
  const [showBrewingMethodPicker, setShowBrewingMethodPicker] = useState(false);

  const updateField = useCallback(
    <K extends keyof CoffeeFormData>(field: K, value: CoffeeFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (field === "name" || field === "price") {
        clearFieldError(field);
      }
    },
    [clearFieldError]
  );

  const handlePriceChange = useCallback(
    (text: string) => {
      const sanitized = sanitizePriceInput(text);
      if (sanitized !== null) {
        updateField("price", sanitized);
      }
    },
    [updateField]
  );

  const handleSubmit = async () => {
    const { isValid } = validate({ name: formData.name, price: formData.price });
    if (!isValid) return;

    onClearError?.();
    await onSubmit(formData);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
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
          {(generalError || errors.general) && (
            <View
              style={[styles.errorContainer, { backgroundColor: errorBackground }]}
            >
              <Ionicons name="alert-circle" size={20} color={errorColor} />
              <ThemedText style={[styles.errorText, { color: errorColor }]}>
                {generalError || errors.general}
              </ThemedText>
            </View>
          )}

          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <CustomInput
              size="full"
              label={`${t("coffees.name")} *`}
              showLabel
              placeholder={t("coffees.enterCoffeeName")}
              value={formData.name}
              onChangeText={(text) => updateField("name", text)}
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
              value={formData.roaster}
              onChangeText={(text) => updateField("roaster", text)}
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
              value={formData.origin}
              onChangeText={(text) => updateField("origin", text)}
              autoCapitalize="words"
            />
          </View>

          {/* Roast Level Picker */}
          <PickerField
            label={t("coffees.roastLevel")}
            value={formData.roastLevel ? roastLevelLabels[formData.roastLevel] : null}
            placeholder={t("coffees.selectRoastLevel")}
            onPress={() => setShowRoastLevelPicker(true)}
          />

          {/* Brewing Method Picker */}
          <PickerField
            label={t("coffees.brewingMethod")}
            value={formData.brewingMethod ? brewingMethodLabels[formData.brewingMethod] : null}
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
              value={formData.process}
              onChangeText={(text) => updateField("process", text)}
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
                value={formData.price}
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
              <StarRating
                rating={formData.rating}
                onRatingChange={(value) => updateField("rating", value)}
                size={36}
              />
              <ThemedText style={styles.ratingText}>
                {formData.rating > 0 ? `${formData.rating}/5` : t("coffees.tapToRate")}
              </ThemedText>
            </View>
            {formData.rating > 0 && (
              <TouchableOpacity
                onPress={() => updateField("rating", 0)}
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
              value={formData.description}
              onChangeText={(text) => updateField("description", text)}
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
              label={isLoading ? loadingLabel : submitLabel}
              onPress={handleSubmit}
              disabled={isLoading || !isFormValid(formData.name)}
              style={[
                styles.submitButton,
                isLoading || !isFormValid(formData.name)
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
        onSelect={(value) => updateField("roastLevel", value)}
        options={Object.values(RoastLevel)}
        labels={roastLevelLabels}
        selectedValue={formData.roastLevel}
        title={t("coffees.selectRoastLevel")}
        noneLabel={t("coffees.none")}
      />

      {/* Brewing Method Picker Modal */}
      <EnumPickerModal
        visible={showBrewingMethodPicker}
        onClose={() => setShowBrewingMethodPicker(false)}
        onSelect={(value) => updateField("brewingMethod", value)}
        options={Object.values(BrewingMethod)}
        labels={brewingMethodLabels}
        selectedValue={formData.brewingMethod}
        title={t("coffees.selectBrewingMethod")}
        noneLabel={t("coffees.none")}
      />
    </>
  );
};

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
