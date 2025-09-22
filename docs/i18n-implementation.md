# Internationalization (i18n) Implementation

## Overview

The Coffee Tracker app implements internationalization using a modern, efficient architecture that supports multiple languages with automatic device language detection and global state management.

## Architecture

### Core Components

```
/locales/
├── index.ts       # Main i18n configuration and setup
├── en.ts          # English translations
└── es.ts          # Spanish translations

/stores/
└── translationStore.ts  # Zustand store for global translation state

/hooks/
└── useTranslation.ts    # React hook for accessing translations

/components/
└── LanguageSelector.tsx # UI component for language switching
```

## How It Works

### 1. Translation Configuration (`/locales/index.ts`)

The main configuration file sets up the i18n instance with:
- **Automatic locale detection**: Uses `expo-localization` to detect device language
- **Fallback system**: Falls back to English if translation is missing
- **Type safety**: Exports TypeScript types for translation keys

```typescript
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

const i18n = new I18n({ en, es });
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
```

### 2. Global State Management (`/stores/translationStore.ts`)

Uses **Zustand** for efficient global state management:
- **Lightweight**: ~2KB bundle size
- **Reactive**: All components re-render when language changes
- **Simple API**: No providers or complex setup needed

```typescript
export const useTranslationStore = create<TranslationStore>((set) => ({
  locale: getCurrentLocale(),
  switchLocale: (newLocale: string) => {
    changeLocale(newLocale);
    set({ locale: newLocale });
  },
  t: (key: string, options?: any) => i18n.t(key, options)
}));
```

### 3. React Hook Integration (`/hooks/useTranslation.ts`)

Provides a clean interface for components:
```typescript
export function useTranslation() {
  return useTranslationStore();
}
```

### 4. UI Components (`/components/LanguageSelector.tsx`)

Interactive language selector that:
- Shows available languages with native names
- Highlights current selection
- Matches the app's coffee theme
- Instantly updates all app translations

## Data Flow

1. **App Initialization**:
   - `expo-localization` detects device language
   - i18n instance is configured with detected locale
   - Zustand store initializes with current locale

2. **Language Change**:
   - User taps language in `LanguageSelector`
   - `switchLocale()` called in Zustand store
   - Store updates locale state
   - All components using `useTranslation()` re-render
   - UI instantly shows new language

3. **Translation Lookup**:
   - Component calls `t('key')`
   - Zustand store calls i18n.t()
   - i18n-js returns translated string or fallback

## Performance Benefits

- **Bundle Size**: Total overhead ~5KB (i18n-js + zustand + expo-localization)
- **Runtime Performance**: Zustand provides optimal re-rendering
- **Memory Efficient**: Translations loaded once, shared globally
- **Type Safe**: Full TypeScript support with autocomplete