import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputFileld from '../../componentes/Inputs/input'
import InputTel from '../../componentes/Inputs/inputTel'
import { updatePassword } from 'firebase/auth'
import PasswordInput from '../../componentes/Inputs/password'
import { clearAll, getData } from '../../Storage/storage'
import { doc, updateDoc, onSnapshot, arrayUnion } from 'firebase/firestore'
import { auth, db } from '../../firebase/firebase'
import ModalError from '../../componentes/Modals/MAddUserError'
import Formulario from '../../componentes/Formularios/Formulario'
import { createChild } from '../../firebase/cloudstorage/Children'
import * as Crypto from 'expo-crypto';
import { generateMatri } from '../../componentes/generateMatricula'
import ModalLoading from '../../componentes/loading/loading'
import { useIsFocused } from '@react-navigation/native';
import { checkLenghtData } from '../../componentes/checkForm'

const ProfileScreen = ({ navigation }) => {
    const [showModal, setShowModal] = useState(false)
    const [mensaje, setMensaje] = useState('')

    const [loading, setLoading] = useState(true)
    const isFocused = useIsFocused();

    const [datos, setDatos] = useState(initialUserInfo)
    const [newPass, setNewPass] = useState('')

    const initialChidrenInfo = {
        name_user: '',
        pattern_name: '',
        matern_name: '',
        matricula: '',
        mail: '',
        status: true,
        payments_id: []
    }


    const checkKeys = [
        "name_user",
        "pattern_name",
        "matern_name",
    ]
    const initialUserInfo = {
        name_user: '',
        matricula: '',
        pattern_name: '',
        matern_name: '',
        phone: '',
        password: '',
        confirm_pass: '',
        status: true,
        hijos_matricula: [],
    }



    useEffect(() => {
        console.log(isFocused ? 'Activo' : 'Inactivo')

        if (isFocused) {
            setLoading(true)
            setDatos(initialUserInfo)
            //Consultamos la sesion almacenada en el telefono
            getData()
                .then(async (data) => {
                    setDatos(data)
                    await traerInformacionUsuario(data.userUID)

                })
                .catch((error) => {
                    setLoading(false)
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log('useEffect - onSnapshot ', errorCode, ' ', errorMessage)
                })
        } else {
            setDatos(initialUserInfo)
            setLoading(false)
        }

    }, [isFocused])

    async function traerInformacionUsuario(id) {
        const unsub = onSnapshot(doc(db, "Usuarios", id), (doc) => {
            setDatos(doc.data());
            console.log('first')
        });

        setLoading(false)
    }


    //Funcion para verificar que el formulario se haya llenado completo
    // Vamos a devolver "true" si el formulario esta completo
    const VerificarFormulario = () => {
        return (datos.name_user
            && datos.pattern_name
            && datos.matern_name
            && datos.phone
            && datos.phone.length == 10
            && datos.mail
        )
    }

    const Actualizar = () => {
        try {

            if (!checkLenghtData(datos, checkKeys) || !VerificarFormulario()) {
                setLoading(false)
                setMensaje("Revisa los campos del perfil")
                setShowModal(true)
                console.log('Actualizar - condicionales: ')

            } else {
                console.log('actualizar')

                // Actualizar la información del usuario
                setLoading(true)
                getData()
                    .then(async (value) => {
                        const infoUser = doc(db, "Usuarios", value.userUID);
                        console.log(value.userUID)
                        datos.matricula = generateMatri(datos.name_user, datos.pattern_name, datos.matern_name)
                        console.log(datos.matricula)
                        await updateDoc(infoUser, {
                            name_user: datos.name_user,
                            pattern_name: datos.pattern_name,
                            matern_name: datos.matern_name,
                            phone: datos.phone,
                            matricula: datos.matricula
                        });

                        console.log("Información de usuario actualizada");
                        setLoading(false)
                        navigation.navigate("HomeU");
                    })
                    .catch((error) => {
                        setLoading(false)
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log('useLayoutEffect - onSnapshot ', errorCode, ' ', errorMessage)
                    })
            }
        } catch (error) {


            console.error("Error al actualizar correo o información del usuario", error);
        }
    }

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

    const handleAgregarHijo = async () => {
        // Creamos al hijo en la base de datos y guardamos el ID
        setLoading(true)
        const child_id = await createChild(initialChidrenInfo)
        getData()
            .then(async (value) => {
                // Apuntamos al documento
                const userRef = doc(db, "Usuarios", value.userUID);
                // Agregamos el id del hijo al arreglo de "hijos_matricula"
                await updateDoc(userRef, {
                    hijos_matricula: arrayUnion(child_id)
                });
                setLoading(false)

            })
            .catch((error) => {
                setLoading(false)
                const errorCode = error.code;
                const errorMessage = error.message;
                setMensaje(errorCode, ' ', errorMessage)
                setShowModal(true)
                console.log('HandleAgregar - GetData: ', error)

            })
    }

    const handleCerrarSesion = () => {
        setLoading(true)
        clearAll()
            .then((value) => {
                setLoading(false)
                console.log('Limpiado: ', value);
                navigation.navigate('HomeU')
                navigation.navigate('Main')

            })
            .catch((error) => {
                setLoading(false)
                console.log('Ocurrio un error: ', error);
            })
    }

    const MinTelephone = ({ phone }) => {
        if (phone.length == 10) {
            return null; // 
        } else {
            return (
                <Text style={{ color: 'red' }}>
                    Debe ser minimo de 10 dígitos
                </Text>
            );
        }
    }

    const ChangePass = async () => {
        //Actualizar contrasseña en el servicio de auth

        if (!newPass.password || newPass.password.length < 6) {

            setLoading(false)
            setMensaje("Nueva contraseña invalida")
            setShowModal(true)
        } else {
            setLoading(true)
            Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                newPass.password
            )
                .then((hashP) => {
                    const user = auth.currentUser;

                    updatePassword(user, newPass.password)
                        .then(() => {
                            console.log('Se actualizo')

                            //Actualizar la contraseña en la base de datos
                            getData()
                                .then(async (value) => {
                                    const infoUser = doc(db, "Usuarios", value.userUID);
                                    console.log(value.userUID)
                                    await updateDoc(infoUser, {
                                        confirm_pass: hashP,
                                        password: hashP
                                    });
                                    setLoading(false)
                                    setMensaje('Contraseña actualizada')
                                    setShowModal(true)
                                    // navigation.goBack();
                                    setNewPass('')
                                })
                                .catch((error) => {
                                    setLoading(false)
                                    const errorCode = error.code;
                                    const errorMessage = error.message;
                                    setMensaje(errorCode, ' ', errorMessage)
                                    setShowModal(true)
                                    console.log('ChangePass - GetData: ', error)

                                })

                        }).catch((error) => {
                            setLoading(false)
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            setMensaje(errorCode, ' -- ', errorMessage)
                            if (errorCode === 'auth/requires-recent-login') {
                                setMensaje(mensaje + '\n \n Requiere volver a iniciar sesion')
                            }
                            setShowModal(true)
                            console.log('ChangePass - UpdataPassword: ', errorCode, ' -- ', errorMessage)

                        });

                })
                .catch((error) => {
                    setLoading(false)
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setMensaje(errorCode, ' ', errorMessage)
                    setShowModal(true)
                    console.log('ChangePass - Updatepass: ', error)
                })
        }

    };

    return (
        <ScrollView>
            <ModalError
                setVisible={setShowModal}
                visible={showModal}
                message={mensaje} />

            {
                loading
                    ?
                    (
                        <ModalLoading />
                    )
                    : (
                        <View
                            className=' px-10 pt-4'>
                            <Text className="text-xl text-bold">Actualizar datos de perfil</Text>
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
                            <MinTelephone phone={datos.phone} />
                            <TouchableOpacity
                                onPress={() => Actualizar()}
                                className="rounded-md bg-blue-400 p-4  items-center mt-6 mb-6">
                                <Text className="w-80 text-center text-white">
                                    Modificar información
                                </Text>
                            </TouchableOpacity>

                            <Text className="text-xl text-bold">Modificar contraseña</Text>
                            <PasswordInput
                                title={"Contraseña"}
                                props={""}
                                name={"password"}
                                setValue={setNewPass}
                                value={newPass} />
                            <MinPas password={newPass} />
                            <TouchableOpacity
                                onPress={() => ChangePass()}
                                className="rounded-md bg-blue-400 p-4 items-center mt-6 ">
                                <Text className="w-80 text-center text-white">
                                    Modificar contraseña
                                </Text>
                            </TouchableOpacity>



                            {
                                datos.hijos_matricula.map((hijo_id, index) => {
                                    return (
                                        <Formulario
                                            childID={hijo_id}
                                            key={index} />
                                    )
                                })
                            }
                            <TouchableOpacity
                                onPress={() => {
                                    handleAgregarHijo()
                                }}
                                className="rounded-md bg-blue-400 p-4 items-center mt-6 ">
                                <Text className=" text-center text-white">
                                    Agregar alumno
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    handleCerrarSesion()
                                    console.log("falta")
                                }}
                                className="rounded-md bg-red p-4 items-center mt-3 mb-40">
                                <Text className="w-80 text-center text-white">
                                    Cerrar sesion
                                </Text>
                            </TouchableOpacity>

                        </View>
                    )
            }

        </ScrollView>
    )

}

export default ProfileScreen