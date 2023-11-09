import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'

const Referencia = ({navigation}) => {
    const infoFull = useRoute().params
    console.log(infoFull)
  return (
    <View>
      
    </View>
  )
}

export default Referencia