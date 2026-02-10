import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { TastingForm, TastingFormData } from "@/components/tasting/TastingForm";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useTastingStore } from "@/stores/tastingStore";
import { CreateTastingDto } from "@/api/tasting/types";
import { AppError } from "@/api/errors";

const emptyFormData: TastingFormData = {
  aroma: 0,
  flavor: 0,
  body: 0,
  acidity: 0,
  balance: 0,
  aftertaste: 0,
  notes: "",
};

export default function CreateTastingScreen() {
  const { coffeeId } = useLocalSearchParams<{ coffeeId: string }>();
  const { t } = useTranslation();
  const { createTasting, isLoading } = useTastingStore();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: TastingFormData) => {
    if (!coffeeId) return;

    try {
      const notesArray = formData.notes
        .split(/[,\n]/)
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

      const dto: CreateTastingDto = {
        aroma: formData.aroma,
        flavor: formData.flavor,
        body: formData.body,
        acidity: formData.acidity,
        balance: formData.balance,
        aftertaste: formData.aftertaste,
        notes: notesArray.length > 0 ? notesArray : undefined,
      };

      await createTasting(coffeeId, dto);
      router.back();
    } catch (err) {
      if (err instanceof AppError) {
        setError(err.getUserMessage());
      } else {
        setError(t("common.unexpectedError"));
      }
    }
  };

  return (
    <ScreenLayout>
      <TastingForm
        initialValues={emptyFormData}
        onSubmit={handleSubmit}
        submitLabel={t("tasting.createTasting")}
        loadingLabel={t("tasting.creating")}
        isLoading={isLoading}
        generalError={error}
        onClearError={() => setError(null)}
      />
    </ScreenLayout>
  );
}
