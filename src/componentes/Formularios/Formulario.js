import { View, Text, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import InputFileld from '../Inputs/input'
import { doc, onSnapshot } from 'firebase/firestore'
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
                props={"Logan Antonio"}
                max={100}
                name={"name_user"}
                setValue={setDatos}
                value={datos} />
            <InputFileld
                title={"Apellido paterno"}
                props={"Peña"}
                max={100}
                name={"pattern_name"}
                setValue={setDatos}
                value={datos} />
       
            <InputFileld
                title={"Apellido materno"}
                props={"Gonzalez"}
                max={100}
                name={"matern_name"}
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

            <View className='flex flex-row justify-around'>

                <TouchableOpacity
                    className="rounded-md bg-blue-400 p-4  items-center mt-6 ">
                    <Text className=" text-center text-white">
                        Actualizar
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="rounded-md bg-red p-4  items-center mt-6 ">
                    <Text className=" text-center text-white">
                        Desactivar
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

export default Formulario