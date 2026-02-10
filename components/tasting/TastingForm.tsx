import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { CustomButton } from "@/components/ui/CustomButton";
import { CustomInput } from "@/components/ui/CustomInput";
import { ThemedText } from "@/components/ui/ThemedText";
import { ScoreInput } from "@/components/common/ScoreInput";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export interface TastingFormData {
  aroma: number;
  flavor: number;
  body: number;
  acidity: number;
  balance: number;
  aftertaste: number;
  notes: string;
}

export interface TastingFormProps {
  initialValues: TastingFormData;
  onSubmit: (data: TastingFormData) => Promise<void>;
  submitLabel: string;
  loadingLabel: string;
  isLoading: boolean;
  generalError?: string | null;
  onClearError?: () => void;
}

const SCORE_FIELDS = [
  "aroma",
  "flavor",
  "body",
  "acidity",
  "balance",
  "aftertaste",
] as const;

type ScoreField = (typeof SCORE_FIELDS)[number];

export const TastingForm = ({
  initialValues,
  onSubmit,
  submitLabel,
  loadingLabel,
  isLoading,
  generalError,
  onClearError,
}: TastingFormProps) => {
  const errorColor = useThemeColor({}, "error");
  const errorBackground = useThemeColor({}, "errorBackground");
  const tint = useThemeColor({}, "tint");

  const { t } = useTranslation();
  const [formData, setFormData] = useState<TastingFormData>(initialValues);
  const [scoreError, setScoreError] = useState<string | null>(null);

  const updateScore = useCallback(
    (field: ScoreField, value: number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setScoreError(null);
      onClearError?.();
    },
    [onClearError],
  );

  const updateNotes = useCallback(
    (text: string) => {
      setFormData((prev) => ({ ...prev, notes: text }));
      onClearError?.();
    },
    [onClearError],
  );

  const hasAnyScore = SCORE_FIELDS.some((f) => formData[f] > 0);

  const handleSubmit = async () => {
    if (!hasAnyScore) {
      setScoreError(t("validation.atLeastOneScore"));
      return;
    }
    onClearError?.();
    setScoreError(null);
    await onSubmit(formData);
  };

  const overallScore =
    SCORE_FIELDS.reduce((sum, f) => sum + formData[f], 0) / SCORE_FIELDS.length;

  return (
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
        {(generalError || scoreError) && (
          <View
            style={[styles.errorContainer, { backgroundColor: errorBackground }]}
          >
            <Ionicons name="alert-circle" size={20} color={errorColor} />
            <ThemedText style={[styles.errorText, { color: errorColor }]}>
              {generalError || scoreError}
            </ThemedText>
          </View>
        )}

        {/* Overall Score Preview */}
        {hasAnyScore && (
          <View style={[styles.overallScoreCard, { borderColor: tint }]}>
            <ThemedText style={styles.overallScoreLabel}>
              {t("tasting.overallScore")}
            </ThemedText>
            <ThemedText
              type="defaultSemiBold"
              style={[styles.overallScoreValue, { color: tint }]}
            >
              {overallScore.toFixed(1)}/10
            </ThemedText>
          </View>
        )}

        {/* Score Inputs */}
        {SCORE_FIELDS.map((field) => (
          <ScoreInput
            key={field}
            label={t(`tasting.${field}`)}
            value={formData[field]}
            onValueChange={(value) => updateScore(field, value)}
          />
        ))}

        {/* Notes Field */}
        <View style={styles.fieldContainer}>
          <CustomInput
            size="full"
            label={t("tasting.notes")}
            showLabel
            placeholder={t("tasting.notesPlaceholder")}
            value={formData.notes}
            onChangeText={updateNotes}
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
            disabled={isLoading}
            style={[
              styles.submitButton,
              isLoading ? styles.submitButtonDisabled : undefined,
            ]}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  overallScoreCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 24,
  },
  overallScoreLabel: {
    fontSize: 16,
  },
  overallScoreValue: {
    fontSize: 24,
  },
  fieldContainer: {
    marginBottom: 20,
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
