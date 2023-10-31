import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { HeartIcon } from 'react-native-heroicons/solid'
import { clearAll, getData } from '../../Storage/storage'
import { auth } from '../../firebase/firebase'

const HomeScreen = () => {

  return (
    <View>
      <Text>Principal</Text>
      <HeartIcon color='#6560AA' />
      <TouchableOpacity className="bg-red"
        onPress={() => {
          console.log("hola")
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

      
    </View>
  )
}

export default HomeScreen