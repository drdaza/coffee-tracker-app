import LogoCoffeeChartCenter from '@/assets/svgs/logo_coffee_chart_centered_v2.svg'
import { CustomButton } from '@/components/ui/CustomButton'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { useThemeColor } from '@/hooks/theme/useThemeColor'
import { useTranslation } from '@/hooks/i18n/useTranslation'
import { router } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const HomeScreen = () => {
  const background = useThemeColor({}, 'background')
  const tint = useThemeColor({}, 'tint')
  const text = useThemeColor({}, 'text')
  const { t } = useTranslation()

  const handleLogout = () => {
    // TODO: Implement actual logout logic
    router.replace('/(core-app)/(home)')
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: background,
      padding: 20
    }}>
      {/* Language selector at top */}
      <View style={{ position: 'absolute', top: 60, right: 20 }}>
        <LanguageSelector />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
        <LogoCoffeeChartCenter
          width={256}
          height={256}
          color={tint}
        />
      </View>

      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: text,
        marginBottom: 20,
        textAlign: 'center'
      }}>
        {t('home.welcome')}
      </Text>

      <Text style={{
        fontSize: 16,
        color: text,
        marginBottom: 40,
        textAlign: 'center'
      }}>
        {t('home.loggedInMessage')}
      </Text>

      <CustomButton
        label={t('auth.logoutButton')}
        size="large"
        type="delete"
        onPress={handleLogout}
      />
    </View>
  )
}

export default HomeScreen