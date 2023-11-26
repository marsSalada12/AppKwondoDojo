import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import InputFileld from '../componentes/Inputs/input'
import UsersInfo from '../componentes/Modals/UsersInfo'
import PasswordInput from '../componentes/Inputs/password'
import { StatusBar } from 'expo-status-bar'
import { auth } from '../firebase/firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createUserWUID } from '../firebase/cloudstorage/CreateUsers'
import { getAnOnlyUser } from '../firebase/cloudstorage/users'
import ModalError from '../componentes/Modals/MAddUserError'
import { clearAll, getData, storeData } from '../Storage/storage'
import * as Crypto from 'expo-crypto';
import { generateMatri } from '../componentes/generateMatricula'
import InputTel from '../componentes/Inputs/inputTel'
import ModalLoading from '../componentes/loading/loading'
import { checkLenghtData } from '../componentes/checkForm'

const Enroll = ({ navigation }) => {
    const [showModal, setShowModal] = useState(false)
    const [msjModal, setMsjModal] = useState('')

    const [isloading, setIsLoading] = useState(false)

    const [visible, setVisible] = useState(false);


    const checkKeys = ["name_user","pattern_name","matern_name"];
    const [datos, setDatos] = useState(
        {
            type_user: 'Usuario',
            name_user: '',
            matricula: '',
            pattern_name: '',
            matern_name: '',
            mail: '',
            phone: '',
            password: '',
            lastGroupUID: '',
            confirm_pass: '',
            status: true,
            payments_id: [],
            hijos_matricula: [],

        }
    );


    //Funcion para verificar que el formulario se haya llenado completo
    // Vamos a devolver "true" si el formulario esta completo
    const VerificarFormulario = () => {
        return (datos.name_user
            && datos.pattern_name
            && datos.matern_name
            && datos.phone
            && datos.mail
            && datos.password
            && datos.confirm_pass)
    }

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
        if (password.length >= 6) {
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
        setIsLoading(true)
        
        if (!VerificarFormulario() || !checkLenghtData(datos, checkKeys)) {
            setMsjModal("Formulario incompleto")
            setShowModal(true)
        } else {
            createUserWithEmailAndPassword(auth, datos.mail, datos.password)
                .then(async (userCredential) => {
                    //Guardamos el ID del usuario
                    const userUID = userCredential.user.uid;
                    const hashP = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, datos.password)

                    //Asignamos el hash y la matricula al objeto del usuario
                    datos.password = hashP.toString()
                    datos.confirm_pass = hashP.toString()
                    datos.matricula = generateMatri(datos.name_user, datos.pattern_name, datos.matern_name)

                    // Creamos al usuario con un ID
                    const user = await createUserWUID(datos, userUID)
                    console.log(user, "createUID")

                    // Almacenamos la sesion del usuario
                    await storeData(user)

                    //Navegamos a el menu de usuario
                    navigation.navigate('TabBarUser')

                    // Cambiamos el estado del cargaando
                    setIsLoading(false)
                })
                .catch(async (error) => {

                    setIsLoading(false)
                    await clearAll()
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setMsjModal(errorCode, '\n', errorMessage)
                    setShowModal(true)
                    console.log(errorCode, errorMessage)
                })
        }
    }

    return (
        <ScrollView>
            <ModalLoading visible={false} />
            <ModalError
                setVisible={setShowModal}
                visible={showModal}
                message={msjModal}
            />
            <View className="flex flex-1 bg-white items-center justify-center py-28 px-10">
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
                        title={"Nombre/s"}
                        props={" "}
                        edita={true}
                        max={100}
                        name={"name_user"}
                        setValue={setDatos}
                        value={datos} />
                    <InputFileld
                        title={"Apellido paterno"}
                        props={" "}
                        edita={true}
                        max={100}
                        name={"pattern_name"}
                        setValue={setDatos}
                        value={datos} />
                    <InputFileld
                        title={"Apellido materno"}
                        props={" "}
                        edita={true}
                        max={100}
                        name={"matern_name"}
                        setValue={setDatos}
                        value={datos} />
                    <InputTel
                        title={"Teléfono"}
                        props={" "}
                        edita={true}
                        max={10}
                        min={10}
                        name={"phone"}
                        setValue={setDatos}
                        value={datos} />
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
                        onPress={() => {
                            autenticar()
                        }}
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
                <StatusBar style='dark' />
            </View >
        </ScrollView>
    )
}

export default Enroll