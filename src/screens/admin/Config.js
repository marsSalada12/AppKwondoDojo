import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import InputFileld from '../../componentes/Inputs/input'
import { db } from '../../firebase/firebase'
import { doc, updateDoc } from 'firebase/firestore'

const Config = ({ navigation }) => {

    const [datos, setDatos] = useState({
        id: 'yUIGazmtjPuxXwZroekk',
        base_price: '',
        schedule: [],
        tipo_usuario: [],
        type_groups: [],
    })

    const [showMessage, setShowMessage] = useState(false);  // Nuevo estado para mostrar el mensaje

    const actualizar = async () => {
        if (datos.base_price === '') {
            setShowMessage(true);  // Mostrar el mensaje si base_price está vacío
        } else {
            const precioRef = doc(db, "Default", datos.id);
            await updateDoc(precioRef, {
                base_price: datos.base_price
            });
            navigation.goBack();
        }
    }

    const Mensaje = () => {
        if (showMessage) {
            return (
                <Text style={{ color: 'red' }}>
                    Ingrese mensualidad
                </Text>
            );
        }
        return null;  // No muestra el mensaje si showMessage es false
    };

    return (
        <View className="flex flex-1 p-8">
            <View>
                <Text className="text-lg">Mensualidad</Text>
            </View>
            <View className="w-full justify-center items-center">
                <InputFileld
                    title={" "}
                    props={"1000"}
                    edita={true}
                    max={5}
                    name={"base_price"}
                    setValue={setDatos}
                    value={datos} />

                <TouchableOpacity
                    onPress={() => actualizar()}
                    className={"rounded-md p-4 w-80 bg-blue-400 items-center mt-2 mb-2 "}>
                    <Text className="text-lg text-white font-bold">
                        Modificar mensualidad base
                    </Text>
                </TouchableOpacity>
                <View className="w-80 ">
                    <Text className="text-center">
                        {Mensaje()}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => console.log("first")}
                    className={"rounded-md p-4 w-80 bg-baseDark items-center mt-2 mb-10 "}>
                    <Text className="text-lg text-blue-400 font-bold">
                        Roles
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Config