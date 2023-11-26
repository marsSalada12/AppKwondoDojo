import { View, Text, Touchable, TouchableOpacity, StatusBar, ScrollView } from 'react-native'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { HeartIcon } from 'react-native-heroicons/solid'
import { useIsFocused } from '@react-navigation/native'
import { CalendarDaysIcon, CheckIcon } from 'react-native-heroicons/outline'
import ModalLoading from '../../componentes/loading/loading'
import { getData } from '../../Storage/storage'
import { db } from '../../firebase/firebase';
import { getDataChildren } from '../../firebase/cloudstorage/Children';
import { getDataGroup } from '../../firebase/cloudstorage/Groups';
import { getDataPayment } from '../../firebase/cloudstorage/CreatePayment';
import { diasRestantes } from '../../componentes/fechas';

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

        setIsLoading(true)
        getData()
            .then((uData) => {

                console.log(uData)
                // Guardamos los IDS del usuario y de los hijos
                setIdusuario([uData.userUID])
                setIdHijos(uData.hijos_matricula)

                //Guardamos la informacion del ussuario
                setUserData(uData)
                traerInformacionUsuario(uData.userUID)

                // Consultamos la coleccion de "Payments" para traernos los pagos que ha echo el usuario y sus hijos
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

                console.log('useEffect - getData() ', error)
            })
    }, [isFocused])




    //Funcion para traernos la informacion de un usuario
    async function traerInformacionUsuario(id) {
        try {
            setIdusuario([id])
            
            const unsub = onSnapshot(doc(db, "Usuarios", id), async (doc) => {
                setUserData({ ...doc.data(), "userUID": id });
                // Si el usuario esta incrito a un grupo, nos traemos la informacion del grupo
                let infroGroup = {}
                if (doc.data()?.lastGroupUID !== "") {
                    infroGroup = await getDataGroup(doc.data().lastGroupUID)
                }

                // Si el usuario tiene algun pago, nos vamos a traer la informacino de su ultimo pago
                
                let paymentID = ''
                let lastPaymentInfo = {}
                let restantes = ''
                if (doc.data().payments_id.length > 0) {
                    paymentID = doc.data().payments_id[doc.data().payments_id.length - 1]
                    lastPaymentInfo = await getDataPayment(paymentID)
                    restantes = diasRestantes(lastPaymentInfo.end_mensulidad_date)
                }
                // Calculamos los dias restantes de la mensualidad

                // Guardamos la TODA la informacion que buscamos, (informacion del usuario, su grupo, y ultimo pago)
                setUserData({ ...doc.data(), ...infroGroup, ...lastPaymentInfo, "lastPaymentID": paymentID, "end_mensulidad_days": restantes })

                // Agregamos la informacion del pago, porque ademas del pago se guarda la informacion del grupo
                traerInformacionChildren(doc.data().hijos_matricula)
            });
        } catch (error) {
            console.log('traerInformacionUsuario - getData() ', error)
        }

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
                setIsLoading(false);
            });

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
                                (!isLoading && userData) && (
                                    <>
                                        {console.log(userData)}
                                        <Text className="text-xl ">{userData.name_user} {userData.pattern_name} {userData.matern_name} </Text>
                                        {
                                            (userData.lastGroupUID && userData.end_mensulidad_days > 0)
                                                ? <>
                                                    <Text className="text-lg  ">Hora {userData.hora}</Text>
                                                    <Text className="text-lg  ">Lunes - Viernes</Text>
                                                    <Text className="text-lg  ">Grupo: {userData.grupo}</Text>
                                                    <Text className="text-lg  ">Vencimiento: {userData.end_mensulidad_days} dias</Text>
                                                    {
                                                        userData.end_mensulidad_days <= 7 && (
                                                            <TouchableOpacity
                                                                className='items-center py-2 rounded-md bg-blue-400'>
                                                                <Text
                                                                    className='text-white text-lg'>
                                                                    Renovar mensualidad
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )
                                                    }
                                                </>
                                                : <View
                                                    className='p-4  mb-1 flex-row items-center'>
                                                    <CalendarDaysIcon size={30} color={'black'} />
                                                    <Text
                                                        className=' text-lg px-4'>
                                                        Inscribete a un grupo para mostrarte {"\n"}tu horario
                                                    </Text>
                                                </View>
                                        }


                                    </>
                                )
                            }
                            {

                                childNames.map((childInfo, index) => {
                                    return (

                                        <View
                                            key={index}
                                            className='mt-4'>
                                            {
                                                childInfo.status
                                                    ? <Text className="text-xl  ">
                                                        {childInfo.name_user} {childInfo.pattern_name} {childInfo.matern_name}
                                                    </Text>
                                                    : null
                                            }
                                            {
                                                childInfo.status
                                                    ? (childInfo.lastGroupUID && childInfo.end_mensulidad_days >= 0)
                                                        ? (<>

                                                            <Text className="text-lg  ">Hora {childInfo.schedule}</Text>
                                                            <Text className="text-lg  ">Lunes - Viernes</Text>
                                                            <Text className="text-lg  ">Grupo: {childInfo.type_group}</Text>
                                                            <Text className="text-lg  ">Vencimiento: {childInfo.end_mensulidad_days} dias</Text>
                                                            {
                                                                childInfo.end_mensulidad_days <= 7 && (
                                                                    <TouchableOpacity
                                                                        className='items-center py-2 rounded-md bg-blue-400'>
                                                                        <Text
                                                                            className='text-white text-lg'>
                                                                            Renovar mensualidad
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                )
                                                            }

                                                        </>)
                                                        : (<>
                                                            <View
                                                                className='p-4  mb-1 flex-row items-center'>
                                                                <CalendarDaysIcon size={30} color={'black'} />
                                                                <Text
                                                                    className=' text-lg px-4'>
                                                                    Inscribete a un grupo para mostrarte {"\n"}tu horario
                                                                </Text>
                                                            </View>
                                                        </>)
                                                    : null

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