import { View, Text, Touchable, TouchableOpacity, StatusBar, ScrollView } from 'react-native'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { HeartIcon } from 'react-native-heroicons/solid'
import { useIsFocused } from '@react-navigation/native'
import { CheckIcon } from 'react-native-heroicons/outline'
import ModalLoading from '../../componentes/loading/loading'
import { getData } from '../../Storage/storage'
import { db } from '../../firebase/firebase';
import { getDataChildren } from '../../firebase/cloudstorage/Children';
import { getDataGroup } from '../../firebase/cloudstorage/Groups';

const HomeScreen = ({ navigation }) => {
    const isFocused = useIsFocused()
    const [isLoading, setIsLoading] = useState(false)
    const [pagosPendientes, setPagosPendientes] = useState([])

    // Varibales para almnacenar la informacion del usuario 
    // y de los hijos
    const [userData, setUserData] = useState(null);
    const [childNames, setChildNames] = useState([]);

    // Variables para almacenar los ids del usuario e hijos
    const [idusuario, setIdusuario] = useState([""])
    const [idHijos, setIdHijos] = useState([""])


    useEffect(() => {
        getData()
            .then((uData) => {
                setIdusuario([uData.userUID])
                setIdHijos(uData.hijos_matricula)

                setUserData(uData)
                traerInformacionUsuario(uData.userUID)

                const q = query(collection(db, "Payments"), where("userUID", "in", idusuario.concat(idHijos)), where("status", "==", "Pendiente"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const pendientes = [];
                    querySnapshot.forEach((doc) => {
                        pendientes.push({ ...doc.data(), "payment_id": doc.id });
                    });
                    setPagosPendientes(pendientes)
                });

            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                // Llamamos setIsLoading(false) solo después de que ambas operaciones asíncronas se hayan completado
                setIsLoading(false);
            });
    }, [isFocused,])

    //Funcion para traernos la informacion de un usuario
    async function traerInformacionUsuario(id) {
        setIdusuario([id])
        const unsub = onSnapshot(doc(db, "Usuarios", id), async (doc) => {
            setUserData({ ...doc.data(), "userUID": id });

            // Mandamos a llamar una funcion para agregar la informacion del grupo
            let infroGroup = {}
            if (doc.data().lastGroupUID !== "") {
                infroGroup = await getDataGroup(doc.data().lastGroupUID)
            }
            setUserData({ ...doc.data(), ...infroGroup, "userUID": id });

            // Agregamos la informacion del pago, porque ademas del pago se guarda la informacion del grupo
            traerInformacionChildren(doc.data().hijos_matricula)
        });
    }

    // Funcion para traernos la informacion de los hijos
    function traerInformacionChildren(ids) {
        setIdHijos(ids)
        getDataChildren(ids)
            .then((info) => {
                setChildNames(info);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('traerInformacionChildren - getDataChildren: ', error);
            })

    }

    return (
        <ScrollView>
            {
                isLoading
                    ? <ModalLoading />
                    : <View className=" flex flex-1 px-5 pt-5 ">
                        <StatusBar hidden={true} />

                        <Text className="text-2xl font-bold mb-1 ">
                            Grupo y horario
                        </Text>

                        <View>
                            {
                                userData && (
                                    <>

                                        <Text className="text-xl   ">{userData.name_user} {userData.pattern_name} {userData.matern_name}</Text>
                                        <Text className="text-lg  ">Hora {userData.schedule}</Text>
                                        <Text className="text-lg  ">Lunes - Viernes</Text>
                                        <Text className="text-lg  ">Grupo: {userData.type_group}</Text>
                                    </>
                                )
                            }
                            {

                                childNames.map((childInfo, index) => {
                                    return (

                                        <View
                                            key={index}
                                            className='mt-4'>
                                            <Text className="text-xl  ">{childInfo.name_user} {childInfo.pattern_name} {childInfo.matern_name}</Text>
                                            {
                                                childInfo.lastGroupUID
                                                    ? (<>

                                                        <Text className="text-lg  ">Hora {childInfo.schedule}</Text>
                                                        <Text className="text-lg  ">Lunes - Viernes</Text>
                                                        <Text className="text-lg  ">Grupo: {childInfo.type_group}</Text>

                                                    </>)
                                                    : (<>
                                                        <Text className="text-lg  ">Sin horario :c</Text>
                                                    </>)
                                            }
                                        </View>
                                    )
                                })
                            }
                        </View>




                        <Text className="text-2xl font-bold mb-5 ">
                            Pagos pendientes
                        </Text>
                        <ScrollView

                            className=' max-h-96'>
                            {
                                pagosPendientes.length == 0
                                    ? <View
                                        className='rounded-md  bg-white  p-4 shadow-md  mb-4 flex-row items-center'>
                                        <CheckIcon
                                            size={30} color={'black'} />
                                        {/* <View className='rounded-full bg-blue-400'></View> */}
                                        <Text
                                            className='text-lg px-4'>
                                            Sin pagos pendientes por pagar
                                        </Text>


                                    </View>
                                    : pagosPendientes.map((pago, index) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate("Referencia", pago)
                                                }}
                                                key={index}
                                                className="rounded-md  bg-white p-4 shadow-md items-start mb-4">
                                                <>
                                                
                                                    <Text
                                                        className='text-xl'>
                                                        Pago de inscripcion {pago.name_user} {pago.ap_paterno} {pago.ap_materno}
                                                    </Text>
                                                    <Text
                                                        className='text-base'>
                                                        Limite de pago: {pago.due_date} "" 
                                                    </Text>
                                                </>
                                            </TouchableOpacity>
                                        )
                                    })
                            }
                        </ScrollView>
                    </View>
            }
        </ScrollView>
    )
}

export default HomeScreen