import { useState, useCallback } from "react";
import { useTranslation } from "@/hooks/i18n/useTranslation";

export interface CoffeeFormErrors {
  name?: string;
  price?: string;
  general?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: CoffeeFormErrors;
}

export function useCoffeeFormValidation() {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<CoffeeFormErrors>({});

  const validateName = useCallback((name: string): string | undefined => {
    const trimmed = name.trim();
    if (!trimmed) {
      return t("validation.nameRequired");
    }
    if (trimmed.length < 2) {
      return t("validation.nameTooShort");
    }
    return undefined;
  }, [t]);

  const validatePrice = useCallback((price: string): string | undefined => {
    if (!price.trim()) return undefined; // Optional field

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      return t("validation.priceMustBePositive");
    }
    return undefined;
  }, [t]);

  const validate = useCallback((data: {
    name: string;
    price: string;
  }): ValidationResult => {
    const newErrors: CoffeeFormErrors = {};

    const nameError = validateName(data.name);
    if (nameError) newErrors.name = nameError;

    const priceError = validatePrice(data.price);
    if (priceError) newErrors.price = priceError;

    setErrors(newErrors);

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  }, [validateName, validatePrice]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: keyof CoffeeFormErrors) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const setGeneralError = useCallback((error: string | null) => {
    setErrors(prev => ({ ...prev, general: error ?? undefined }));
  }, []);

  const isFormValid = useCallback((name: string): boolean => {
    return name.trim().length >= 2;
  }, []);

  return {
    errors,
    validate,
    clearErrors,
    clearFieldError,
    setGeneralError,
    isFormValid,
    validateName,
    validatePrice,
  };
}
