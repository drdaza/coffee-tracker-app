import { Ionicons } from "@expo/vector-icons";
import { BrewingMethod } from "@/api/coffee/enums";

/**
 * Icon mapping for brewing methods to Ionicons glyph names
 */
export const brewingMethodIcons: Record<
  BrewingMethod,
  keyof typeof Ionicons.glyphMap
> = {
  [BrewingMethod.ESPRESSO]: "cafe",
  [BrewingMethod.POUR_OVER]: "water",
  [BrewingMethod.FRENCH_PRESS]: "flask",
  [BrewingMethod.AEROPRESS]: "arrow-down-circle",
  [BrewingMethod.COLD_BREW]: "snow",
  [BrewingMethod.DRIP]: "funnel",
};
