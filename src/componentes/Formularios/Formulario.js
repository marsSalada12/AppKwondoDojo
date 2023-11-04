import { View, Text, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import InputFileld from '../Inputs/input'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'

export const Formulario = ({ childID }) => {
    const [datos, setDatos] = useState(
        {
            name_user: '',
            pattern_name: '',
            matern_name: '',
            mail: '',
            status: true
        }
    )
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
            const childInfo = doc(db, "Children", childID);
            console.log(childID)
            await updateDoc(childInfo, {
                name_user: datos.name_user,
                pattern_name: datos.pattern_name,
                matern_name: datos.matern_name,
                mail: datos.mail
            });
            console.log("Información actualizada");
            // navigation.goBack();
        } catch (error) {
            console.error("Error al actualizar información", error);
        }
    }

    useLayoutEffect(() => {
        console.log(childID)
        onSnapshot(doc(db, "Children", childID), (doc) => {
            setDatos({ ...doc.data() })

        });
    }, [])

    return (
        <View>
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

        </View>
    )
}

export default Formulario