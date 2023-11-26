import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import InputFileld from '../componentes/Inputs/input'
import { StatusBar } from 'expo-status-bar'
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase/firebase'
import ModalError from '../componentes/Modals/MAddUserError';

const RecoveryPass = ({ navigation }) => {
    const [showModal, setShowModal] = useState(false)
    const [msjModal, setMsjModal] = useState('')

    const [datos, setDatos] = useState(
        {
            mail: '',
        }
    );

    const reset = () => {
        sendPasswordResetEmail(auth, datos.mail)
            .then(() => {
                setMsjModal('Correo enviado')
                setShowModal(true)
                navigation.navigate("SignIn")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode)
                setMsjModal('Email invailido o\n No se pudo enviar el correo')
                setShowModal(true)
            });
    }

    return (
        <View className=" flex-1 bg-white items-center justify-center ">
            <ModalError
                setVisible={setShowModal}
                visible={showModal}
                message={msjModal}
            />
            <Image
                source={require('../../assets/logo.png')}
                className='w-56 h-56' />

            <Text className={"text-3xl font-thin text-center"}>
                Recuperar {"\n"} contraseña
            </Text>

            <View className="mt-12 w-80">
                <InputFileld
                    title={"Correo Electrónico"}
                    props={"correo@ejemplo.com"}
                    max={100}
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

            <View className=" flex flex-row justify-center ">

                <Text>
                    Ya tienes cuenta?
                </Text>
                <Text onPress={() => navigation.navigate("SignIn")}
                    className=" underline ">
                    {"\t"}Inicia sesión
                </Text>

            </View>
            <StatusBar backgroundColor={'#ffff'} />
        </View>
    )
}

export default RecoveryPass