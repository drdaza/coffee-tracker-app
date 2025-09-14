import LogoCoffeeChartCenter from '@/assets/svgs/logo_coffee_chart_centered_v2.svg'
import { CustomButton } from '@/components/CustomButton'
import { CustomInput } from '@/components/CustomInput'
import { useThemeColor } from '@/hooks/useThemeColor'
import React from 'react'
import { View } from 'react-native'

const HomeScreen = () => {
  const background = useThemeColor({}, 'background')
  const tint = useThemeColor({}, 'tint');
  const text = useThemeColor({}, 'text')
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center',
       alignItems: 'center',
        backgroundColor: background
       }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <LogoCoffeeChartCenter
        width={256}
        height={256}
        color={tint}
      />
      </View>
      <CustomInput placeholder="Enter username..." style={{ marginBottom: 16 }} size="large" label="Username" showLabel />
      <CustomInput placeholder="Enter password..." style={{ marginBottom: 16 }} size="large" label="Password" showLabel />
      <CustomButton label="Click me" size="large" />
    </View>
  )
}

export default HomeScreen