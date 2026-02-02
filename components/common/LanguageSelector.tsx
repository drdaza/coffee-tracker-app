import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/theme/useThemeColor';
import { useTranslation } from '@/hooks/i18n/useTranslation';
import { ThemedText } from '@/components/ui/ThemedText';

interface LanguageSelectorProps {
  style?: any;
}

export function LanguageSelector({ style }: LanguageSelectorProps) {
  const { locale, switchLocale, availableLocales } = useTranslation();
  const textColor = useThemeColor({}, 'text');
  const tint = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');

  const getLanguageName = (code: string) => {
    const names: { [key: string]: string } = {
      en: 'English',
      es: 'Español',
    };
    return names[code] || code;
  };

  return (
    <View style={[styles.container, style]}>
      {availableLocales.map((lang) => (
        <TouchableOpacity
          key={lang}
          style={[
            styles.languageButton,
            {
              borderColor: locale === lang ? tint : textColor,
              backgroundColor: locale === lang ? tint : 'transparent',
            },
          ]}
          onPress={() => switchLocale(lang)}
        >
          <ThemedText
            style={[
              styles.languageText,
              {
                color: locale === lang ? backgroundColor : textColor,
                fontWeight: locale === lang ? 'bold' : 'normal',
              },
            ]}
          >
            {getLanguageName(lang)}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  languageText: {
    fontSize: 14,
  },
});