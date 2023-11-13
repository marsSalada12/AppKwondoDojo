import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import InputFileld from '../../componentes/Inputs/input';
import { doc, updateDoc, getDoc, query, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const Roles = ({ navigation }) => {
    const [datos, setDatos] = useState({
        tipo_usuario: '',
    });

    const [data, setData] = useState([]);
    const id = 'yUIGazmtjPuxXwZroekk';

    const actualizar = async () => {
        const docRef = doc(db, 'Default', id);
        const docSnapshot = await getDoc(docRef);
        const data = docSnapshot.data();
        console.log(data.tipo_usuarios)
        console.log(datos.tipo_usuario["tipo_usuario"])

        // Verifica si el campo tipo_usuarios es un array en el documento.
        if (Array.isArray(data.tipo_usuarios)) {
            // Agrega el nuevo valor al array.
            data.tipo_usuarios.push(datos.tipo_usuario["tipo_usuario"]);
            await updateDoc(docRef, {
                tipo_usuarios: data.tipo_usuarios
            });
            console.log("Campo actualizado con éxito.");

        } else {
            console.log("El campo tipo_usuarios no es un array en el documento.");
        }

    };
    useEffect(
        () => {
            const q = query(collection(db, "Default"));
            // const q = query(collection(db, "Groups"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const roles = [];
                querySnapshot.forEach((doc) => {
                    roles.push({ ...doc.data()["tipo_usuarios"], id: doc.id });
                });
                setData(roles)
            });

            return unsubscribe
        }, []
    )

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
                    max={100}
                    name={"tipo_usuario"}
                    setValue={(value) => setDatos({ ...datos, tipo_usuario: value })} // Actualiza el estado con el valor del input
                    value={datos.tipo_usuario}
                />

                <TouchableOpacity
                    onPress={() => actualizar()}
                    className={"rounded-md p-4 w-80 bg-blue-400 items-center mt-2 mb-2 "}>
                    <Text className="text-lg text-white font-bold">
                        Guardar
                    </Text>
                </TouchableOpacity>

                {
                    data.map((rol, index) => {
                        return (
                            <View className="w-80 mt-6 items-center" key={index}>
                                {Object.keys(rol).map((key) => {
                                    // Excluye la propiedad "id" del mapeo
                                    if (key !== "id") {
                                        return (
                                            <TouchableOpacity
                                                key={key}
                                                className="rounded-md w-full h-fit bg-white p-4 shadow-2xl items-start mt-2 mb-2">
                                                <Text className="text-2xl text-center font-bold w-full">
                                                    {rol[key]}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    }
                                    return null;
                                })}
                            </View>
                        );
                    })}
            </View>
        </View>
    );
}

export default Roles;
