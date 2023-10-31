import { View, Text, Image, StatusBar, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import InputFileld from '../componentes/Inputs/input'
import PasswordInput from '../componentes/Inputs/password'
import { auth } from '../firebase/firebase'
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAnOnlyUser } from '../firebase/cloudstorage/users'
import { storeData } from '../Storage/storage'

const SignIn = ({ navigation }) => {


    const [datos, setDatos] = useState(
        {
            mail: '',
            password: '',
        }
    );

    const autenticarSI = () => {
        signInWithEmailAndPassword(auth, datos.mail, datos.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                getAnOnlyUser(user.uid)
                    .then(async (user) => {
                        console.log(user)
                        await storeData(user)
                        if(user.type_user === 'Maestro'){
                            console.log('Como maestro no puedes ingresar a la app')
                        }else{
                            if(user.type_user === 'Administrador'){
                                navigation.navigate('TabBarAdmin')
                            }else{
                                navigation.navigate('TabBarUser')
                            }
                        }
                       
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
                console.log(errorMessage)
            });

    }

    return (
        <View className="flex flex-1 bg-white items-center justify-center ">
            <Image
                source={require('../../assets/logo.png')}
                className='w-56 h-56' />
            <Text className={"text-3xl font-thin text-center w-80"}>
                Inicia sesión aquí
            </Text>
            <View className="mt-12">
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
                    props={"password1234"}
                    name={"password"}
                    setValue={setDatos}
                    value={datos} />
            </View>

            <View className=" w-80 mt-2">
                <Text onPress={() => navigation.navigate("RecoveryPass")}
                    className="text-right underline">
                    Olvidé mi contraseña
                </Text>
            </View>

            <TouchableOpacity className="rounded-md bg-blue-400 p-4 w-80 items-center mt-12 mb-10"
                onPress={() => { autenticarSI() }
                }>
                <Text className="text-lg text-white font-bold">
                    Iniciar sesión
                </Text>
            </TouchableOpacity>

            <View className=" flex flex-row">
                <Text>
                    No tienes cuenta?{"\t"}
                </Text>
                <Text
                    onPress={() => navigation.navigate("Enroll")}
                    className=" underline">
                    Registrarse aquí
                </Text>
            </View>

            <StatusBar backgroundColor={"#ffff"} />
        </View>
    )
}
export default SignIn