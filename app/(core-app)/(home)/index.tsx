import { CustomButton } from '@/components/CustomButton'
import { CustomInput } from '@/components/CustomInput'
import { useThemeColor } from '@/hooks/useThemeColor'
import React from 'react'
import { Text, View } from 'react-native'

const HomeScreen = () => {
  const background = useThemeColor({}, 'background')
  const text = useThemeColor({}, 'text')
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center',
       alignItems: 'center',
        backgroundColor: background
       }}>
      <Text style={{color: text}}>aaaaaaaaaaaaaaaaaaaaaaaa</Text>
      <CustomInput placeholder="Enter username..." style={{ marginBottom: 16 }} size="large" label="Username" showLabel />
      <CustomInput placeholder="Enter password..." style={{ marginBottom: 16 }} size="large" label="Password" showLabel />
      <CustomButton label="Click me" size="large" />
    </View>
  )
}

export default HomeScreen