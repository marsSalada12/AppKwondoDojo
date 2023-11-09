import { View, Text, Touchable, TouchableOpacity, StatusBar } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { HeartIcon } from 'react-native-heroicons/solid'
import { clearAll, getData } from '../../Storage/storage'
import { auth } from '../../firebase/firebase'

const HomeScreen = ({navigation}) => {

  return (
    <View>
      <StatusBar hidden={true} />
      <Text>Principal</Text>
      <HeartIcon color='#6560AA' />
      <TouchableOpacity className="bg-red"
        onPress={() => { 
          console.log("hola")
          //Nos traemos la sesion guardada en el celular
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