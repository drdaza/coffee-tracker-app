/**
 * Price utility functions for converting between cents (API) and dollars (display)
 */

/**
 * Convert cents to dollars for display
 * @param cents - Price in cents (e.g., 2500)
 * @returns Formatted dollar string (e.g., "25.00") or empty string if no value
 */
export function centsToDollars(cents: number | undefined | null): string {
  if (!cents) return "";
  return (cents / 100).toFixed(2);
}

/**
 * Convert dollars string to cents for API
 * @param dollars - Price in dollars as string (e.g., "25.00")
 * @returns Price in cents (e.g., 2500) or undefined if empty
 */
export function dollarsToCents(dollars: string): number | undefined {
  const trimmed = dollars.trim();
  if (!trimmed) return undefined;

  const parsed = parseFloat(trimmed);
  if (isNaN(parsed)) return undefined;

  return Math.round(parsed * 100);
}

/**
 * Format price in cents to display string with $ symbol
 * @param cents - Price in cents
 * @returns Formatted string with $ symbol (e.g., "$25.00")
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Sanitize price input to only allow valid decimal values
 * @param text - Raw input text
 * @returns Sanitized value or null if invalid
 */
export function sanitizePriceInput(text: string): string | null {
  // Allow empty string
  if (text === "") return "";

  // Allow only digits and one decimal point with up to 2 decimal places
  const regex = /^(\d+)?(\.\d{0,2})?$/;
  if (regex.test(text)) {
    return text;
  }

  return null; // Invalid input
}
