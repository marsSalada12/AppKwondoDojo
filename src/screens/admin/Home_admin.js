import { View, TouchableOpacity, Text, StatusBar } from 'react-native'
import React from 'react'
import { CogIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { clearAll } from '../../Storage/storage'

const HomeAdmin = () => {
  const navigation = useNavigation()

  const handleCerrarSesion = () => {
    clearAll()
      .then((value) => {
        console.log('Limpiado: ', value);
        navigation.navigate('Main')
      })
      .catch((error) => {
        console.log('Ocurrio un error: ', error);
      })
  }
  return (
    <View className=" mr-5 mt-5">
      <StatusBar hidden={true} />
      <TouchableOpacity>
        <CogIcon size={45} color={"gray"}
          onPress={() => navigation.navigate("Config")} />
      </TouchableOpacity>

      <TouchableOpacity className="bg-red mt-10 p-5 mx-5 rounded-lg"
        onPress={() => handleCerrarSesion()}>
        <Text
          className='text-center text-white text-base'>
          Cerrar sesion
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeAdmin