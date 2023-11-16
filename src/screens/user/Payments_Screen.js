import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getData } from '../../Storage/storage';
import { db } from '../../firebase/firebase';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import ModalLoading from '../../componentes/loading/loading';
import { getDataChildren } from '../../firebase/cloudstorage/Children';
import { useIsFocused } from '@react-navigation/native';
import { ClipboardDocumentCheckIcon } from 'react-native-heroicons/outline';


const PaymentsScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [childNames, setChildNames] = useState([]);

    const [historial, setHistorial] = useState([])

    // Variables para almacenar los ids del usuario e hijos
    const [idusuario, setIdusuario] = useState([""])
    const [idHijos, setIdHijos] = useState([""])


    const isFocused = useIsFocused();


    useEffect(() => {
        if (isFocused) {
            setIsLoading(true);
            setChildNames([])
            getData()
                .then(async (data) => {
                    setUserData(data)
                    traerInformacionUsuario(data.userUID)
                    // await traerInformacionUsuario(await data.userUID);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log('UseEffect - getData:', error);
                })
        } else {
            setUserData({
                name_user: '',
                pattern_name: '',
                matern_name: '',
                matricula: '',
                mail: '',
                status: true,
                phone: '',
                password: '',
                confirm_pass: '',
                hijos_matricula: [],
            })
            setChildNames([])
        }
        const q = query(collection(db, "Payments"), where("userUID", "in", idusuario.concat(idHijos)), where("status", "!=", "Pendiente"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const pendientes = [];
            querySnapshot.forEach((doc) => {
                pendientes.push({...doc.data(), "payment_id": doc.id});
            });
            setHistorial(pendientes)
        });
    }, [isFocused]);



    async function traerInformacionUsuario(id) {
        setIdusuario([id])
        const unsub = onSnapshot(doc(db, "Usuarios", id), (doc) => {
            setUserData({ ...doc.data(), "userUID": id });
            traerInformacionChildren(doc.data().hijos_matricula)

        });
    }

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
                console.log(idusuario)
                console.log(idHijos)
            });
    }


    return (
        <ScrollView>
            {isLoading
                ? (
                    <ModalLoading />
                )
                : (
                    <View className=" flex flex-1 px-5 pt-5  ">
                        <StatusBar hidden={true} />
                        <Text className="text-2xl font-semibold mb-5 ">Mensualidad</Text>
                        {/* Renderizamos el boton de inscripcion de usuario */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Inscripcion', { alumno: userData })}
                            className="rounded-md bg-white justify-center px-10 py-4 mb-4 items-center">
                            <Text className="w-80 text-center text-lg">
                                Mensualidad de {userData.name_user} {userData.pattern_name} {userData.matern_name}
                            </Text>
                        </TouchableOpacity>

                        {childNames.map((childInfo, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => navigation.navigate('Inscripcion', { alumno: childInfo })}
                                    className="rounded-md bg-white justify-center px-10 py-4 mb-4 items-center">
                                    <Text className="w-80 text-center text-lg">
                                    Mensualidad de {childInfo.name_user} {childInfo.pattern_name} {childInfo.matern_name}
                                    </Text>
                                </TouchableOpacity>)
                        })}

                        <Text className="text-2xl font-semibold mb-5 ">
                            Historial de pagos
                        </Text>
                        <ScrollView
                            nestedScrollEnabled={true}
                            className=''>
                            {

                                historial.length == 0
                                    ? <View
                                        className='rounded-md  bg-white  p-4 shadow-md  mb-4 flex-row items-center'>

                                        <ClipboardDocumentCheckIcon
                                            size={35} color={'black'} />

                                        <Text
                                            className='text-lg px-4'>
                                            Historial limpio
                                        </Text>

                                    </View>
                                    : historial.map((pago, index) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate("Referencia", pago)
                                                }}
                                                key={index}
                                                className="rounded-md  bg-white p-4 shadow-md items-start mb-4">
                                                <View className=''>
                                                    <Text
                                                        className='text-xl'>
                                                        Pago de inscripcion {pago.name_user} {pago.ap_paterno} {'\n'} {pago.ap_materno}
                                                    </Text>
                                                    <View
                                                        className='flex-row  justify-between w-full'>
                                                        <Text
                                                            className='text-base '>
                                                            {pago.status} {pago.due_date}
                                                        </Text>
                                                        <Text
                                                            className='text-xl font-bold text-blue-400 '>
                                                            ${pago.price}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                            }
                        </ScrollView>

                    </View>
                )}
        </ScrollView>
    );
};

export default PaymentsScreen;
