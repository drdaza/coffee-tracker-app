import { useState, useCallback } from "react";
import { RoastLevel, BrewingMethod } from "@/api/coffee/enums";
import { useCoffeeFormValidation } from "@/hooks/form/useCoffeeFormValidation";
import { sanitizePriceInput, dollarsToCents, centsToDollars } from "@/utils/price";

export interface CoffeeFormData {
  name: string;
  roaster: string;
  origin: string;
  roastLevel: RoastLevel | null;
  brewingMethod: BrewingMethod | null;
  process: string;
  price: string; // Display value in dollars
  rating: number;
  description: string;
}

export interface CoffeeFormInitialValues {
  name?: string;
  roaster?: string;
  origin?: string;
  roastLevel?: RoastLevel | null;
  brewingMethod?: BrewingMethod | null;
  process?: string | null;
  price?: number; // In cents from API
  rating?: number | null;
  description?: string | null;
}

export function useCoffeeForm(initialValues?: CoffeeFormInitialValues) {
  // Form state
  const [name, setName] = useState(initialValues?.name ?? "");
  const [roaster, setRoaster] = useState(initialValues?.roaster ?? "");
  const [origin, setOrigin] = useState(initialValues?.origin ?? "");
  const [roastLevel, setRoastLevel] = useState<RoastLevel | null>(
    initialValues?.roastLevel ?? null
  );
  const [brewingMethod, setBrewingMethod] = useState<BrewingMethod | null>(
    initialValues?.brewingMethod ?? null
  );
  const [process, setProcess] = useState(initialValues?.process ?? "");
  const [price, setPrice] = useState(
    centsToDollars(initialValues?.price)
  );
  const [rating, setRating] = useState(initialValues?.rating ?? 0);
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );

  // Picker modal states
  const [showRoastLevelPicker, setShowRoastLevelPicker] = useState(false);
  const [showBrewingMethodPicker, setShowBrewingMethodPicker] = useState(false);

  // Validation
  const {
    errors,
    validate,
    clearFieldError,
    isFormValid,
    setGeneralError,
  } = useCoffeeFormValidation();

  // Handlers
  const handlePriceChange = useCallback((text: string) => {
    const sanitized = sanitizePriceInput(text);
    if (sanitized !== null) {
      setPrice(sanitized);
      clearFieldError("price");
    }
  }, [clearFieldError]);

  const handleNameChange = useCallback((text: string) => {
    setName(text);
    clearFieldError("name");
  }, [clearFieldError]);

  // Get form data ready for API submission
  const getSubmitData = useCallback(() => {
    return {
      name: name.trim(),
      roaster: roaster.trim() || "Unknown",
      origin: origin.trim() || "Unknown",
      roastLevel: roastLevel ?? RoastLevel.MEDIUM,
      brewingMethod: brewingMethod ?? BrewingMethod.DRIP,
      price: dollarsToCents(price) ?? 0,
      process: process.trim() || undefined,
      description: description.trim() || undefined,
      rate: rating > 0 ? rating : undefined,
    };
  }, [name, roaster, origin, roastLevel, brewingMethod, price, process, description, rating]);

  // Validate and return result
  const validateForm = useCallback(() => {
    return validate({ name, price });
  }, [validate, name, price]);

  return {
    // Form values
    name,
    roaster,
    origin,
    roastLevel,
    brewingMethod,
    process,
    price,
    rating,
    description,

    // Setters
    setName: handleNameChange,
    setRoaster,
    setOrigin,
    setRoastLevel,
    setBrewingMethod,
    setProcess,
    setPrice: handlePriceChange,
    setRating,
    setDescription,

    // Picker states
    showRoastLevelPicker,
    showBrewingMethodPicker,
    setShowRoastLevelPicker,
    setShowBrewingMethodPicker,

    // Validation
    errors,
    validateForm,
    isFormValid: () => isFormValid(name),
    setGeneralError,

    // Submission
    getSubmitData,
  };
}
