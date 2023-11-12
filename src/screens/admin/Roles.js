import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputFileld from '../../componentes/Inputs/input'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { getAllTypeUsers } from '../../firebase/cloudstorage/Default'

const Roles = ({ navigation }) => {
    const [datos, setDatos] = useState({
        id: 'yUIGazmtjPuxXwZroekk',
        tipo_usuario: [],
    });

    const [users, setUsers] = useState([]);

    const addValueToTipoUsuario = (newValue) => {
        setDatos((prevDatos) => ({
            ...prevDatos,
            tipo_usuario: [...prevDatos.tipo_usuario, newValue],
        }));
    };

    const actualizar = async () => {
        const precioRef = doc(db, "Default", datos.id);
        await updateDoc(precioRef, {
            tipo_usuario: datos.tipo_usuario, // Update the array in the database
            // Other properties
        });
        navigation.goBack();
    };

    useEffect(() => {
        // Load the initial data from the database
        getAllTypeUsers().then((user) => {
            setUsers(user);
        });
    }, []);

    return (
        <View className="flex flex-1 p-8">
            <View>
                <Text className="text-lg">Mensualidad</Text>
            </View>
            <View className="w-full justify-center items-center">
                <InputFileld
                    title={"Descripción"}
                    props={""}
                    edita={true}
                    max={5}
                    name={"tipo_usuario"}
                    setValue={setDatos}
                    value={datos.tipo_usuario} // Pass the array directly
                />

                <TouchableOpacity
                    onPress={() => actualizar()}
                    className={"rounded-md p-4 w-80 bg-blue-400 items-center mt-2 mb-2 "}>
                    <Text className="text-lg text-white font-bold">
                        Guardar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Roles;
