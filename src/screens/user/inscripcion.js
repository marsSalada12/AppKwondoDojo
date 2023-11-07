import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { QuestionMarkCircleIcon } from 'react-native-heroicons/solid'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import GroupInfo from '../../componentes/Modals/GroupInfo'


const Inscripcion = ({ navigation }) => {
    const [showModal, setShowModal] = useState(false)
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(
        () => {
            setLoading(true)
            const q = query(collection(db, "Groups"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const grupos = [];
                querySnapshot.forEach((doc) => {
                    grupos.push({ ...doc.data(), 'id': doc.id });
                });
                setDatos(grupos)
            });
            setLoading(false)
            return unsubscribe
        }, []
    )
    return (
        <View className="flex flex-1 w-full">
            <GroupInfo
                setVisible={setShowModal}
                visible={showModal}
            />

            <View className="justify-between mt-4  pl-7 pr-9 flex flex-row">
                <Text className="text-xl mt-2 w-80">
                    Grupos disponibles
                </Text>
                <QuestionMarkCircleIcon size={35} fill={"black"}
                    onPress={(() => setShowModal(true))} />
            </View>
            {
                loading
                    ? <ActivityIndicator size="large" />
                    : <View className="items-center justify-center mt-4 w-full px-4">
                        {
                            datos.map((grupillos, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Mensualidad", grupillos)}
                                        key={index}
                                        className="rounded-md w-full h-fit bg-white p-4 shadow-2xl items-start mt-2 mb-2">
                                        <View className="flex-row justify-around">

                                            <View className="">
                                                <Text className=" text-2xl font-bold w-full">
                                                    {"Grupo " + grupillos.type_group}
                                                </Text>
                                                <Text className=" text-xl font-semibold w-full">
                                                    {"Horario: " + grupillos.schedule}
                                                </Text>
                                                <Text className=" text-xl font-semibold w-full">
                                                    {"Instructor: " + grupillos.name_teac}
                                                </Text>
                                            </View>
                                            <View className="ml-10">
                                                <Text className=" text-lg font-semibold w-full mt-2 ml-2">
                                                    {"Cupo: \n " + grupillos.cont_alumnos + "/" + + grupillos.cupo}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
            }
        </View>

    )
}

export default Inscripcion