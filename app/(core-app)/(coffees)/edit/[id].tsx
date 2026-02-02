import React, { useEffect, useState, useMemo } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { CoffeeForm, CoffeeFormData } from "@/components/coffee/CoffeeForm";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeStore } from "@/stores/coffeeStore";
import { useAuthStore } from "@/stores/authStore";
import { UpdateCoffeeDto } from "@/api/coffee/types";
import { AppError } from "@/api/errors";
import { centsToDollars, dollarsToCents } from "@/utils/price";
import { buildDto, FieldConfig } from "@/utils/buildDto";

const fieldConfigs: FieldConfig<CoffeeFormData, UpdateCoffeeDto>[] = [
  { key: "name", transform: (v) => (v as string).trim() },
  { key: "roaster", transform: (v) => (v as string).trim() },
  { key: "origin", transform: (v) => (v as string).trim() },
  { key: "roastLevel", transform: (v) => v ?? undefined },
  { key: "brewingMethod", transform: (v) => v ?? undefined },
  { key: "process", transform: (v) => (v as string).trim() || undefined },
  { key: "price", transform: (v) => dollarsToCents(v as string) },
  { key: "rating", dtoKey: "rate", transform: (v) => (v as number) > 0 ? v : undefined },
  { key: "description", transform: (v) => (v as string).trim() || undefined },
];

export default function EditCoffeeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const { coffeeDetail, fetchCoffee, updateCoffee, isLoading } = useCoffeeStore();
  const { t } = useTranslation();

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCoffee = async () => {
      if (!id) {
        setLoadError(t("coffeeDetail.noIdProvided"));
        setInitialLoading(false);
        return;
      }

      try {
        await fetchCoffee(id);
      } catch (err) {
        const errorMessage =
          err instanceof AppError ? err.getUserMessage() : "Failed to load coffee";
        setLoadError(errorMessage);
      } finally {
        setInitialLoading(false);
      }
    };

    loadCoffee();
  }, [id, fetchCoffee, t]);

  useEffect(() => {
    if (coffeeDetail && coffeeDetail.id === id) {
      const canEdit = coffeeDetail.isCreator || user?.role === "ADMIN";

      if (!canEdit) {
        Alert.alert(
          t("common.unauthorized"),
          t("coffeeDetail.noEditPermission"),
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    }
  }, [coffeeDetail, id, user, t]);

  const initialValues: CoffeeFormData | null = useMemo(() => {
    if (!coffeeDetail || coffeeDetail.id !== id) return null;

    return {
      name: coffeeDetail.name || "",
      roaster: coffeeDetail.roaster || "",
      origin: coffeeDetail.origin || "",
      roastLevel: coffeeDetail.roastLevel || null,
      brewingMethod: coffeeDetail.brewingMethod || null,
      process: coffeeDetail.process || "",
      price: centsToDollars(coffeeDetail.price),
      rating: coffeeDetail.rate || 0,
      description: coffeeDetail.description || "",
    };
  }, [coffeeDetail, id]);

  const handleSubmit = async (formData: CoffeeFormData) => {
    if (!id || !initialValues) return;

    const updateDto = buildDto<CoffeeFormData, UpdateCoffeeDto>(
      formData,
      initialValues,
      fieldConfigs
    );

    if (!updateDto) {
      Alert.alert(t("coffeeDetail.noChanges"), t("coffeeDetail.noChangesMessage"));
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await updateCoffee(id, updateDto);
      Alert.alert(t("common.success"), t("coffeeDetail.updateSuccess"), [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof AppError ? err.getUserMessage() : t("coffeeDetail.updateError");
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
        error={loadError || t("coffeeDetail.notFound")}
        onRetry={() => {
          setLoadError(null);
          setInitialLoading(true);
          if (id) fetchCoffee(id);
        }}
      />
    );
  }

  return (
    <ScreenLayout>
      <CoffeeForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel={t("coffees.saveChanges")}
        loadingLabel={t("coffees.saving")}
        isLoading={isSubmitting || isLoading}
        generalError={submitError}
        onClearError={() => setSubmitError(null)}
      />
    </ScreenLayout>
  );
}
