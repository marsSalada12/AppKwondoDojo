import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import InputFileld from '../Inputs/input'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { generateMatri } from '../generateMatricula'
import ModalError from '../Modals/MAddUserError'

export const Formulario = ({ childID, admin = false }) => {
    const [modalErrorVisible, setModalErrorVisible] = useState(false)
    const [MsjModalError, setMsjModalError] = useState('')

    const [datos, setDatos] = useState(
        {
            name_user: '',
            matricula: '',
            pattern_name: '',
            matern_name: '',
            mail: '',
            status: true
        }
    )

    const VerificarFormulario = () => {
        return (datos.name_user
            && datos.pattern_name
            && datos.matern_name
            && datos.mail)
    }
    //desactivar hijo(cambiar status)
    const desactivar = async () => {
        const childInfo = doc(db, "Children", childID);
        await updateDoc(childInfo, {
            status: !datos.status
        });
    }

    //Actualizar hijo en la bd
    const Actualizar = async () => {
        try {
            if (VerificarFormulario()) {
                const childInfo = doc(db, "Children", childID);
                datos.matricula = generateMatri(datos.name_user, datos.pattern_name, datos.matern_name)
                await updateDoc(childInfo, {
                    name_user: datos.name_user,
                    pattern_name: datos.pattern_name,
                    matern_name: datos.matern_name,
                    mail: datos.mail,
                    matricula: datos.matricula
                });
                console.log("Información actualizada");
            } else {
                console.log("No se pudo actualizar. Verifica el formulario.");
                setMsjModalError("Llenar formulario")
                setModalErrorVisible(true)
            }
            // navigation.goBack();
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            setMsjModalError(errorCode, '\n', errorMessage)
            setModalErrorVisible(true)
        }
    }

    useEffect(() => {
        onSnapshot(doc(db, "Children", childID), (doc) => {
            datos.matricula = generateMatri(datos.name_user, datos.pattern_name, datos.matern_name)
            setDatos({ ...doc.data() })
        });
    }, [])



    return (
        <View>
            <ModalError
                setVisible={setModalErrorVisible}
                visible={modalErrorVisible}
                message={MsjModalError} />
            <Text
                className='text-xl my-5'>
                Información alumno(s)
            </Text>
            <InputFileld
                title={"Nombre/s"}
                props={" "}
                max={100}
                name={"name_user"}
                setValue={setDatos}
                value={datos} />
            <InputFileld
                title={"Apellido paterno"}
                props={" "}
                max={100}
                name={"pattern_name"}
                setValue={setDatos}
                value={datos} />

            <InputFileld
                title={"Apellido materno"}
                props={" "}
                max={100}
                name={"matern_name"}
                setValue={setDatos}
                value={datos} />
            <InputFileld
                title={"Correo Electrónico"}
                props={" "}
                edita={true}
                max={100}
                name={"mail"}
                setValue={setDatos}
                value={datos} />


            {
                !admin && (

                    <View className='flex flex-row justify-around'>

                        <TouchableOpacity
                            onPress={() => Actualizar()}
                            className="rounded-md bg-blue-400 p-4  items-center mt-6 ">
                            <Text className=" text-center text-white">
                                Actualizar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => desactivar()}
                            className={"rounded-md p-4  items-center mt-6 " + (datos.status ? 'bg-red' : 'bg-green')}>
                            <Text className=" text-center text-white">
                                {datos.status ? "Desactivar" : "Activar"}
                            </Text>
                        </TouchableOpacity>

                    </View>
                )
            }


        </View>
    )
}

export default Formulario