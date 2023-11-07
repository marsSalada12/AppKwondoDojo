import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'

const Mensualidad = ({ navigation }) => {
    const info = useRoute().params
    return (
        <View>
            <Text className="text-2xl ml-4 mt-2">Tu mensualidad</Text>
            <Text className="text-xl ml-4 mt-4 mb-4">Grupo</Text>
            <View className=" flex-row justify-around rounded-md ml-5 mr-5 bg-white p-4 shadow-2xl items-start mt-2 mb-2">
                <View>
                    <Text className=" text-2xl font-bold w-full">
                        {"Grupo " + info.type_group}
                    </Text>
                    <Text className=" text-xl font-semibold w-full">
                        {"Horario: " + info.schedule}
                    </Text>
                    <Text className=" text-xl font-semibold w-full">
                        {"Instructor: " + info.name_teac}
                    </Text>
                </View>
                <View className="ml-10">
                    <Text className=" text-lg font-semibold w-full mt-2 ml-2">
                        {"Cupo: \n " + info.cont_alumnos + "/" + + info.cupo}
                    </Text>
                </View>
            </View>
            <Text className="text-2xl ml-4 mt-6">Saldo a pagar</Text>


            <View className="items-center">
                <TouchableOpacity className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6 mb-6 ml-5 mr-5">
                    <Text className="text-white text-center w-72">Generar referencia</Text>
                </TouchableOpacity>
                <TouchableOpacity className="rounded-md bg-red p-4 w-80 items-center mb-6 ml-5 mr-5">
                    <Text className="text-white text-center w-72">Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default Mensualidad