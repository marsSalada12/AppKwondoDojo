import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { getData } from '../../Storage/storage'
import { db } from '../../firebase/firebase'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import ModalLoading from '../../componentes/loading/loading'
import { getDataChild } from '../../firebase/cloudstorage/Children'

const PaymentsScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [childNames, setChildNames] = useState([])

    useEffect(() => {
        setIsLoading(true)
        getData()
            .then((data) => {
                // Consulatamos la BD para traernos los datos del usuario
                onSnapshot(doc(db, "Usuarios", data.userUID), (doc) => {
                    setUserData({ ...doc.data() })
                })
                fetchChildNames()
            })
            .catch((error) => {
                setIsLoading(false)
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('useLayoutEffect - onSnapshot ', errorCode, ' ', errorMessage)
            })
    }, [])



    //Obtener los nombre de los hijes
    const fetchChildNames = async () => {
        setIsLoading(true)
        const childrenInfo = []
        userData.hijos_matricula.forEach(childID => {
            getDataChild(childID)
                .then((childInfo) => {
                    childrenInfo.push(childInfo)
                    console.log(childInfo)
                })
                .catch((error) => {
                    setIsLoading(false)
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log('useLayoutEffect - onSnapshot ', errorCode, ' ', errorMessage)
                })
        });
        setChildNames(childrenInfo)
        setIsLoading(false)
    };




    return (
        <View>
            <StatusBar hidden={true} />
            <Text className="mb-6 mt-4 ml-7 text-lg">Mensualidad</Text>

            {
                isLoading
                    ? <ModalLoading visible={isLoading} />
                    : <>
                        <TouchableOpacity
                            onPress={() => { }}
                            className="rounded-md bg-baseDark h-10 justify-center ml-7 mr-7 mb-4 items-center">
                            <Text className="w-80 text-center">
                                Inscripcion de {userData.name_user} {userData.pattern_name} {userData.matern_name}
                            </Text>
                        </TouchableOpacity>
                        {
                            console.log(childNames.length)
                        }

                        {
                            childNames.length > 0
                                ?
                                <View>
                                    {
                                        childNames.map((info, indice) => {
                                            console.log(info)
                                            return (
                                                <TouchableOpacity
                                                    key={indice}
                                                    onPress={() => { }}
                                                    className="rounded-md bg-baseDark h-10 justify-center ml-7 mr-7 mb-4 items-center">
                                                    <Text className="w-80 text-center">
                                                        Inscripcion de {info.name_user} {info.pattern_name} {info.matern_name}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>

                                :
                                <Text>no Hijo</Text>
                        }

                    </>
            }


        </View>
    );


}

export default PaymentsScreen