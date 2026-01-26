/**
 * Formatting utility functions for display values
 */

/**
 * Format an enum value for display (e.g., MEDIUM_DARK -> Medium Dark)
 * @param value - The enum string value to format
 * @returns Formatted string with proper capitalization
 */
export function formatEnumValue(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}
