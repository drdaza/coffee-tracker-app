import { CustomButton } from '@/components/CustomButton'
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
      <CustomButton label="Click me" />
    </View>
  )
}

export default HomeScreen