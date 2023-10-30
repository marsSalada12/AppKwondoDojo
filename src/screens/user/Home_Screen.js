import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { HeartIcon } from 'react-native-heroicons/solid'
import { clearAll, getData } from '../../Storage/storage'

const HomeScreen = () => {

  getData()
  return (
    <View>
      <Text>Principal</Text>
      <HeartIcon color='#6560AA' />
      <TouchableOpacity className="bg-red"
        onPress={() => {
          getData()
            .then((value) => {
              console.log(value);
            })
            .catch()
        }}>
        <Text>
          Hola boton
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-green mt-10"
        onPress={() => {
          clearAll()
            .then((value) => {
              console.log(value);
            })
            .catch((value) => {
              console.log(value);
            })
        }}>
        <Text>
          Hola boton
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen