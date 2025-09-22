import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './en';
import es from './es';

// Define translation type for TypeScript
export type TranslationKeys = typeof en;

// Create i18n instance
const i18n = new I18n({
  en,
  es,
});

// Set the locale once at the beginning of your app
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';

// Enable fallbacks to 'en' if translation is missing
i18n.enableFallback = true;
i18n.defaultLocale = 'en';


export default i18n;

// Type-safe translation function
export function t(key: string, options?: any): string {
  return i18n.t(key, options);
}

// Function to change locale
export function changeLocale(locale: string) {
  i18n.locale = locale;
}

// Function to get current locale
export function getCurrentLocale(): string {
  return i18n.locale;
}

// Function to get available locales
export function getAvailableLocales(): string[] {
  return ['en', 'es'];
}