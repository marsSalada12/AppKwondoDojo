import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import InputFileld from '../Inputs/input'

export const Formulario = () => {
    const [datos, setDatos] = useState(
        {
            name_user: '',
            pattern_name: '',
            matern_name: '',
            mail: '',
            status: true
        }
    )
    return (
        <View>
            <Text>Información alumno(s)</Text>
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
            <TouchableOpacity
                className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6 ">
                <Text className="w-80 text-center text-white">
                    Actualizar informacion
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6 ">
                <Text className="w-80 text-center text-white">
                    Desactivar
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Formulario