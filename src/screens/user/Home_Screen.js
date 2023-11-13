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

const HomeScreen = ({ navigation }) => {
    const isFocused = useIsFocused()
    const [isLoading, setIsLoading] = useState(false)
    const [pagosPendientes, setPagosPendientes] = useState([])

    // Varibales para almnacenar la informacion del usuario 
    // y de los hijos
    const [userData, setUserData] = useState({ "confirm_pass": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", "hijos_matricula": ["a04W6sQMe854J0sp8vBA", "oPAXyCLxM3RfNZl4dJzc"], "mail": "maestro4@gmail.com", "matern_name": "Guzman", "matricula": "KAG59189752", "name_user": "Karla", "password": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", "pattern_name": "Arriaga", "payments_id": ["UFQEb7DjEnbfTHB62aoW"], "phone": "8446319545", "status": true, "type_user": "Usuario", "userUID": "vKl8niUS6df5Rp8JN69gzGU1t1D2" });
    const [childNames, setChildNames] = useState([{ "mail": "jaa@gmail.com ", "matern_name": "Alonso", "matricula": "JAA27811970", "name_user": "Juanito", "pattern_name": "Arriaga", "payments_id": ["AaIIOpwwS3rAqChlTIr1"], "status": true, "userUID": "a04W6sQMe854J0sp8vBA" }, { "mail": "ludo@gmail.com", "matern_name": "Peluche", "matricula": "LPP16988732", "name_user": "Ludovico", "pattern_name": "Peluche", "payments_id": ["KWQmkoprGGWHk2F2urAy", "Y395loi0aMx1LbyEIo6s", "rkunoYsTZOToq6bR6o3Q", "gOVGGFiueBUtVAhYzrS7"], "status": true, "userUID": "oPAXyCLxM3RfNZl4dJzc" }]);

    // Variables para almacenar los ids del usuario e hijos
    const [idusuario, setIdusuario] = useState([""])
    const [idHijos, setIdHijos] = useState([""])


    useEffect(() => {
        // getData()
        //   .then((uData) => {
        //     setIdusuario([uData.userUID])
        //     setIdHijos(uData.hijos_matricula)

        //     setUserData(uData)
        //     traerInformacionUsuario(uData.userUID)

        //     const q = query(collection(db, "Payments"), where("userUID", "in", idusuario.concat(idHijos)), where("status", "==", "Pendiente"));
        //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
        //       const pendientes = [];
        //       querySnapshot.forEach((doc) => {
        //         pendientes.push({ ...doc.data(), "payment_id": doc.id });
        //       });
        //       setPagosPendientes(pendientes)
        //     });

        //   })
        //   .catch((error) => {
        //     console.log(error)
        //   })
    }, [isFocused,])

    //Funcion para traernos la informacion de un usuario
    async function traerInformacionUsuario(id) {
        setIdusuario([id])
        const unsub = onSnapshot(doc(db, "Usuarios", id), (doc) => {
            setUserData({ ...doc.data(), "userUID": id });
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
            .finally(() => {
                // Llamamos setIsLoading(false) solo después de que ambas operaciones asíncronas se hayan completado
                setIsLoading(false);
                console.log(userData)
                console.log(childNames)
            });
    }

    return (
        <ScrollView>
            {
                isLoading
                    ? <ModalLoading />
                    : <View className=" flex flex-1 px-5 pt-5 bg-white">
                        <StatusBar hidden={true} />

                        <Text className="text-2xl font-bold mb-1 ">
                            Grupo y horario
                        </Text>

                        <View>
                            <Text className="text-xl   ">{userData.name_user} {userData.pattern_name} {userData.matern_name}</Text>
                            <Text className="text-lg  ">Hora 10:00 -12:00</Text>
                            <Text className="text-lg  ">Lunes - Viernes</Text>
                            <Text className="text-lg  ">Grupo: A1</Text>
                            {
                                childNames.map((childInfo, index) => {
                                    return (
                                        <View
                                            className='mt-4'>
                                            <Text className="text-lg  ">{childInfo.name_user} {childInfo.pattern_name} {childInfo.matern_name}</Text>
                                            <Text className="text-lg  ">Hora 10:00 -12:00</Text>
                                            <Text className="text-lg  ">Lunes - Viernes</Text>
                                            <Text className="text-lg  ">Grupo: A1</Text>
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
                                                        Limite de pago: {pago.due_date}
                                                    </Text>
                                                </>
                                            </TouchableOpacity>
                                        )
                                    })
                            }
                        </ScrollView>
                        <HeartIcon color='#6560AA' />
                        <TouchableOpacity className="bg-red"
                            onPress={() => {
                                console.log("hola")
                                //Nos traemos la sesion guardada en el celular
                                getData()
                                    .then((value) => {
                                        console.log(value);
                                    })
                                    .catch()
                            }}>
                            <Text>
                                Consular sesion
                            </Text>
                        </TouchableOpacity>

                    </View>
            }
        </ScrollView>
    )
}

export default HomeScreen