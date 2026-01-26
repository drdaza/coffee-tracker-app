import { useMemo } from "react";
import { useTranslation } from "@/hooks/i18n/useTranslation";
import { RoastLevel, BrewingMethod } from "@/api/coffee/enums";

export function useRoastLevelLabels(): Record<RoastLevel, string> {
  const { t } = useTranslation();

  return useMemo(() => ({
    [RoastLevel.LIGHT]: t("coffees.roastLevels.light"),
    [RoastLevel.MEDIUM]: t("coffees.roastLevels.medium"),
    [RoastLevel.MEDIUM_DARK]: t("coffees.roastLevels.mediumDark"),
    [RoastLevel.DARK]: t("coffees.roastLevels.dark"),
  }), [t]);
}

export function useBrewingMethodLabels(): Record<BrewingMethod, string> {
  const { t } = useTranslation();

  return useMemo(() => ({
    [BrewingMethod.ESPRESSO]: t("coffees.brewingMethods.espresso"),
    [BrewingMethod.POUR_OVER]: t("coffees.brewingMethods.pourOver"),
    [BrewingMethod.FRENCH_PRESS]: t("coffees.brewingMethods.frenchPress"),
    [BrewingMethod.AEROPRESS]: t("coffees.brewingMethods.aeropress"),
    [BrewingMethod.COLD_BREW]: t("coffees.brewingMethods.coldBrew"),
    [BrewingMethod.DRIP]: t("coffees.brewingMethods.drip"),
  }), [t]);
}

// Combined hook for convenience
export function useCoffeeEnumLabels() {
  const roastLevelLabels = useRoastLevelLabels();
  const brewingMethodLabels = useBrewingMethodLabels();

  return { roastLevelLabels, brewingMethodLabels };
}
