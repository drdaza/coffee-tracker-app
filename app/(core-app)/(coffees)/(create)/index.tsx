import React, { useState } from "react";
import { router } from "expo-router";

import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { CoffeeForm, CoffeeFormData } from "@/components/coffee/CoffeeForm";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { useCoffeeStore } from "@/stores/coffeeStore";
import { RoastLevel, BrewingMethod } from "@/api/coffee/enums";
import { CreateCoffeeDto } from "@/api/coffee/types";
import { AppError } from "@/api/errors";
import { dollarsToCents } from "@/utils/price";
import { buildDto, FieldConfig } from "@/utils/buildDto";

const emptyFormData: CoffeeFormData = {
  name: "",
  roaster: "",
  origin: "",
  roastLevel: null,
  brewingMethod: null,
  process: "",
  price: "",
  rating: 0,
  description: "",
};

const fieldConfigs: FieldConfig<CoffeeFormData, CreateCoffeeDto>[] = [
  { key: "name", transform: (v) => (v as string).trim() },
  { key: "roaster", transform: (v) => (v as string).trim() || "Unknown" },
  { key: "origin", transform: (v) => (v as string).trim() || "Unknown" },
  { key: "roastLevel", transform: (v) => v || RoastLevel.MEDIUM },
  { key: "brewingMethod", transform: (v) => v || BrewingMethod.DRIP },
  { key: "process", transform: (v) => (v as string).trim() || undefined },
  { key: "price", transform: (v) => dollarsToCents(v as string) ?? 0 },
  { key: "rating", dtoKey: "rate", transform: (v) => (v as number) > 0 ? v : undefined },
  { key: "description", transform: (v) => (v as string).trim() || undefined },
];

export default function CreateCoffeeScreen() {
  const { t } = useTranslation();
  const { createCoffee, isLoading } = useCoffeeStore();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: CoffeeFormData) => {
    try {
      const coffeeData = buildDto<CoffeeFormData, CreateCoffeeDto>(
        formData,
        null,
        fieldConfigs
      );

      if (coffeeData) {
        await createCoffee(coffeeData);
        router.back();
      }
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
      <CoffeeForm
        initialValues={emptyFormData}
        onSubmit={handleSubmit}
        submitLabel={t("coffees.createCoffee")}
        loadingLabel={t("coffees.creating")}
        isLoading={isLoading}
        generalError={error}
        onClearError={() => setError(null)}
      />
    </ScreenLayout>
  );
}
