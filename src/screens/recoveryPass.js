import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import InputFileld from '../componentes/Inputs/input'
import { StatusBar } from 'expo-status-bar'
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase/firebase'

const RecoveryPass = ({ navigation }) => {
    const [datos, setDatos] = useState(
        {
            mail: '',
        }
    );

    const reset = () => {
        sendPasswordResetEmail(auth, datos.mail)
        .then(() => {
          console.log("se envio correo")
          navigation.navigate("SignIn")
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    }

    return (
        <View className=" flex-1 bg-white items-center justify-center ">

            <Image
                source={require('../../assets/logo.png')}
                className='w-56 h-56' />

            <Text className={"text-3xl font-thin text-center"}>
                Recuperar {"\n"} contraseña
            </Text>

            <View className="mt-12">
                <InputFileld
                    title={"Correo Electrónico"}
                    props={"correo@ejemplo.com"}
                    max = {100}
                    name={"mail"}
                    setValue={setDatos}
                    value={datos} />

            </View>

            <TouchableOpacity className="rounded-md bg-blue-400 p-4 w-80 items-center mt-12 mb-10"
            onPress={() => reset()} >
                <Text className="text-lg text-white font-bold">
                    Enviar correo
                </Text>
            </TouchableOpacity>

            <View className=" flex flex-row justify-center w-80">

                <Text>
                    Ya tienes cuenta?
                </Text>

                <Text onPress={() => navigation.navigate("SignIn")}
                    className=" underline w-20">
                    {"\t"}Inicia sesión
                </Text>

            </View>
            <StatusBar backgroundColor={'#ffff'} />
        </View>
    )
}

export default RecoveryPass