import React, { useEffect, useState, useMemo } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { TastingForm, TastingFormData } from "@/components/tasting/TastingForm";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useTastingStore } from "@/stores/tastingStore";
import { UpdateTastingDto } from "@/api/tasting/types";
import { AppError } from "@/api/errors";

export default function EditTastingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { tastingDetail, fetchTasting, updateTasting, isLoading } =
    useTastingStore();

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadTasting = async () => {
      if (!id) {
        setLoadError(t("tasting.fetchError"));
        setInitialLoading(false);
        return;
      }

      try {
        await fetchTasting(id);
      } catch (err) {
        const errorMessage =
          err instanceof AppError
            ? err.getUserMessage()
            : t("tasting.fetchError");
        setLoadError(errorMessage);
      } finally {
        setInitialLoading(false);
      }
    };

    loadTasting();
  }, [id, fetchTasting, t]);

  const initialValues: TastingFormData | null = useMemo(() => {
    if (!tastingDetail || tastingDetail.id !== id) return null;

    return {
      aroma: tastingDetail.aroma,
      flavor: tastingDetail.flavor,
      body: tastingDetail.body,
      acidity: tastingDetail.acidity,
      balance: tastingDetail.balance,
      aftertaste: tastingDetail.aftertaste,
      notes: tastingDetail.notes.join(", "),
    };
  }, [tastingDetail, id]);

  const handleSubmit = async (formData: TastingFormData) => {
    if (!id || !initialValues) return;

    // Check if anything changed
    const hasChanges =
      formData.aroma !== initialValues.aroma ||
      formData.flavor !== initialValues.flavor ||
      formData.body !== initialValues.body ||
      formData.acidity !== initialValues.acidity ||
      formData.balance !== initialValues.balance ||
      formData.aftertaste !== initialValues.aftertaste ||
      formData.notes !== initialValues.notes;

    if (!hasChanges) {
      Alert.alert(t("tasting.noChanges"), t("tasting.noChangesMessage"));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const notesArray = formData.notes
        .split(/[,\n]/)
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      const dto: UpdateTastingDto = {
        aroma: formData.aroma,
        flavor: formData.flavor,
        body: formData.body,
        acidity: formData.acidity,
        balance: formData.balance,
        aftertaste: formData.aftertaste,
        notes: notesArray,
      };

      await updateTasting(id, dto);
      Alert.alert(t("common.success"), t("tasting.updateSuccess"), [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof AppError
          ? err.getUserMessage()
          : t("tasting.updateError");
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return <ScreenLayout loading />;
  }

  if (loadError || !initialValues) {
    return (
      <ScreenLayout
        error={loadError || t("tasting.fetchError")}
        onRetry={() => {
          setLoadError(null);
          setInitialLoading(true);
          if (id) fetchTasting(id);
        }}
      />
    );
  }

  return (
    <ScreenLayout>
      <TastingForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel={t("tasting.saveChanges")}
        loadingLabel={t("tasting.saving")}
        isLoading={isSubmitting || isLoading}
        generalError={submitError}
        onClearError={() => setSubmitError(null)}
      />
    </ScreenLayout>
  );
}
