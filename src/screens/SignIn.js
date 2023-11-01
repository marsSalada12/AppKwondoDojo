import { View, Text, Image, StatusBar, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import InputFileld from '../componentes/Inputs/input'
import PasswordInput from '../componentes/Inputs/password'
import { auth } from '../firebase/firebase'
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAnOnlyUser } from '../firebase/cloudstorage/users'
import { clearAll, storeData } from '../Storage/storage'
import ModalError from '../componentes/Modals/MAddUserError'

const SignIn = ({ navigation }) => {
    const [showModal, setShowModal] = useState(false)
    const [msjModal, setMsjModal] = useState('')

    const [storeUser, setstoreData] = useState({})

    const [datos, setDatos] = useState(
        {
            mail: '',
            password: '',
        }
    );

    const autenticarSI = () => {
        signInWithEmailAndPassword(auth, datos.mail, datos.password)
            .then((userCredential) => {
                //Guardamos el ID del usuario
                const userUID = userCredential.user.uid;
                getAnOnlyUser(userUID)
                    .then(async (user) => {
                        // Revisamos el  estado del usuario
                        if (!user.status) {
                            setMsjModal('usuario desactivado')
                            setShowModal(true)
                        } else {
                            //Reviamos que el usuario no sea maestro
                            if (user.type_user === 'Maestro') {
                                console.log('Como maestro no puedes ingresar a la app')
                                setMsjModal('Como maestro no puedes ingresar a la app')
                                setShowModal(true)

                            } else {
                                await storeData(user)
                                // Revisamos el tipo de usuario
                                if (user.type_user === 'Administrador') {
                                    navigation.navigate('TabBarAdmin')
                                } else {
                                    navigation.navigate('TabBarUser')
                                }
                            }
                        }

                    }
                    ).catch(async (error) => {
                        await clearAll()
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        setMsjModal(errorCode, '\n', errorMessage)
                        setShowModal(true) 
                        console.log(errorMessage)
                    })

            })
            .catch(async (error) => {
                await clearAll()
                const errorCode = error.code;
                const errorMessage = error.message;
                setMsjModal(errorCode, '\n', errorMessage)
                setShowModal(true)
                console.log(errorMessage)
            });

    }

    return (
        <View className="flex flex-1 bg-white items-center justify-center ">
            <ModalError
                setVisible={setShowModal}
                visible={showModal}
                message={msjModal}
            />
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