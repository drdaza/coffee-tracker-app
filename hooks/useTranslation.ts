import { useTranslationStore } from '@/stores/translationStore';

export function useTranslation() {
  return useTranslationStore();
}