import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import InputFileld from '../componentes/Inputs/input'
import UsersInfo from '../componentes/Modals/UsersInfo'
import PasswordInput from '../componentes/Inputs/password'
import { StatusBar } from 'expo-status-bar'
import { auth } from '../firebase/firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createUserWUID } from '../firebase/cloudstorage/CreateUsers'
import { getAnOnlyUser } from '../firebase/cloudstorage/users'

const Enroll = ({ navigation }) => {

    const [visible, setVisible] = useState(false);

    const [datos, setDatos] = useState(
        {
            type_user: 'Usuario',
            name_user: '',
            pattern_name: '',
            matern_name: '',
            mail: '',
            phone: '',
            password: '',
            confirm_pass: '',
            status: '',
            payments_id: [],
            hijos_matricula: [],

        }
    );


    const PasswordsMatch = ({ password, confirmPass }) => {
        if (confirmPass && password !== confirmPass) {
            return (
                <Text style={{ color: 'red' }}>
                    Las contraseñas no coinciden. Por favor, inténtelo de nuevo.
                </Text>
            );
        }
        return null;
    };

    const MinPas = ({ password }) => {
        if (password.length > 6) {
            return null; // Las contraseñas coinciden, no se muestra ningún mensaje
        } else {
            return (
                <Text style={{ color: 'red' }}>
                    Debe ser minimo de 6 caracteres
                </Text>
            );
        }
    };

    const autenticar = () => {
        console.log(datos)
        createUserWithEmailAndPassword(auth, datos.mail, datos.password)
            .then((userCredential) => {
                const user = userCredential.user.uid;
                console.log("si se guardó")
                createUserWUID(datos, user)
                    .then(async (user) => {
                        await storeData(user)
                        console.log(user)

                        navigation.navigate('TabBarUser')


                    }
                    ).catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorMessage)
                    })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }

    return (
        <View className="flex flex-1 bg-white items-center justify-center ">
            <Image
                source={require('../../assets/logo.png')}
                className='w-56 h-56' />

            <Text className={"text-3xl font-thin text-center w-80"}>
                Registrate aquí
            </Text>
            <UsersInfo
                visible={visible}
                setVisible={setVisible}
            />

            <View>

                <InputFileld
                    title={"Correo Electrónico"}
                    props={"correo@ejemplo.com"}
                    edita={true}
                    max={100}
                    name={"mail"}
                    setValue={setDatos}
                    value={datos} />

                <PasswordInput
                    title={"Contraseña"}
                    props={"........."}
                    name={"password"}
                    setValue={setDatos}
                    value={datos} />
                <MinPas password={datos.password} />
                <PasswordInput
                    title={"Confirmar contraseña"}
                    props={"........."}
                    name={"confirm_pass"}
                    setValue={setDatos}
                    value={datos} />

                <PasswordsMatch password={datos.password} confirmPass={datos.confirm_pass} />

                <TouchableOpacity
                    onPress={() => autenticar()}
                    className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6 mb-6">
                    <Text className="text-lg text-white font-bold">
                        Registrate
                    </Text>
                </TouchableOpacity>

            </View>
            <View className=" flex flex-row justify-center w-96 ">
                <Text>
                    Ya tienes cuenta?{" "}
                </Text>
                <Text onPress={() => navigation.navigate("SignIn")}
                    className=" underline w-20">
                    Inicia sesión
                </Text>
            </View>
            <StatusBar backgroundColor={'#ffff'} />
        </View >
    )
}

export default Enroll