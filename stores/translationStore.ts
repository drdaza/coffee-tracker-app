import { create } from 'zustand';
import i18n, { changeLocale, getCurrentLocale, getAvailableLocales } from '@/locales';

interface TranslationStore {
  locale: string;
  switchLocale: (newLocale: string) => void;
  t: (key: string, options?: any) => string;
  availableLocales: string[];
}

export const useTranslationStore = create<TranslationStore>((set, get) => ({
  locale: getCurrentLocale(),
  availableLocales: getAvailableLocales(),

  switchLocale: (newLocale: string) => {
    changeLocale(newLocale);
    set({ locale: newLocale });
  },

  t: (key: string, options?: any): string => {
    return i18n.t(key, options);
  },
}));