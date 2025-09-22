import LogoCoffeeChartCenter from '@/assets/svgs/logo_coffee_chart_centered_v2.svg'
import { CustomButton } from '@/components/CustomButton'
import { CustomInput } from '@/components/CustomInput'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useTranslation } from '@/hooks/useTranslation'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

const LoginScreen = () => {
  const background = useThemeColor({}, 'background')
  const tint = useThemeColor({}, 'tint')
  const { t } = useTranslation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // TODO: Implement actual login logic
    console.log('Login with:', username, password)
    // For now, just navigate to home
    router.replace('/(core-app)/(home)')
  }

  const handleNavigateToRegister = () => {
    router.push('/auth/register')
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: background,
    }}>
      {/* Language selector at top */}
      {/* <View style={{ position: 'absolute', top: 60, right: 20 }}>
        <LanguageSelector />
      </View> */}

      <View style={{ 
        flex: 1,
        justifyContent: 'center',

      }}>
        <LogoCoffeeChartCenter
          width={200}
          height={200}
          color={tint}
        />
      </View>

      <View style={{ 
        flex: 1,
        gap: 10,
        alignItems: 'center',
        }}>
        <CustomInput
          placeholder={t('home.enterUsername')}
          size="large"
          label={t('common.username')}
          showLabel
          value={username}
          onChangeText={setUsername}
        />
        <CustomInput
          placeholder={t('home.enterPassword')}
          size="large"
          label={t('common.password')}
          showLabel
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <CustomButton
          label={t('auth.login')}
          size="large"
          onPress={handleLogin}
        />

        <Pressable onPress={handleNavigateToRegister}>
          <Text style={{
            color: tint,
            textAlign: 'center',
            fontSize: 16
          }}>
            {t('auth.dontHaveAccount')}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default LoginScreen