import { View, StatusBar, Text, TouchableOpacity, Image } from 'react-native';

export default function Main({ navigation }) {
  return (
    <View className="flex flex-1 bg-blue-600 items-center justify-center">
      <Image
        source={require('../../assets/logo.png')}
        className='w-56 h-56' />
      <View className="px-11 ">
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}
          className="rounded-md bg-blue-500 p-4 w-80 items-center mt-36 mb-10" >
          <Text className="text-2xl text-white font-bold">
            Iniciar sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Enroll")}
          className="rounded-md bg-blue-500 p-4 w-80 items-center " >
          <Text className="text-2xl text-white font-bold ">
            Registrarse
          </Text>
        </TouchableOpacity>

      </View>
      <StatusBar backgroundColor={'#3E3D4F'} />
    </View>
  )
}