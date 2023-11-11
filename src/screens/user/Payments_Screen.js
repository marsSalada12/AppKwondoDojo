import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getData } from '../../Storage/storage';
import { db } from '../../firebase/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import ModalLoading from '../../componentes/loading/loading';
import { getDataChildren } from '../../firebase/cloudstorage/Children';
import { useIsFocused } from '@react-navigation/native';


const PaymentsScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [childNames, setChildNames] = useState([]);
    const isFocused = useIsFocused();


    useEffect(() => {
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
            return ()=>{
                console.log('limpiando')
            }
    }, [isFocused]);

    async function traerInformacionUsuario(id) {
        const unsub = onSnapshot(doc(db, "Usuarios", id), (doc) => {
            setUserData(doc.data());
            traerInformacionChildren(doc.data().hijos_matricula)
        });
    }

    function traerInformacionChildren(ids) {
        getDataChildren(ids)
            .then((info) => {
                setChildNames(info);
                // Puedes descomentar la siguiente línea si necesitas realizar alguna operación adicional después de obtener la información de los hijos
                // setIsLoading(false);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('traerInformacionChildren - getDataChildren: ', error);
            })
            .finally(() => {
                // Llamamos setIsLoading(false) solo después de que ambas operaciones asíncronas se hayan completado
                setIsLoading(false);
            });
    }


    return (
        <View>
            {isLoading
                ? (
                    <ModalLoading />
                )
                : (
                    <>
                        <StatusBar hidden={true} />
                        <Text className="mb-6 mt-4 ml-7 text-lg">Mensualidad</Text>
                        {/* Renderizamos el boton de inscripcion de usuario */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Inscripcion', userData)}
                            className="rounded-md bg-baseDark h-10 justify-center ml-7 mr-7 mb-4 items-center">
                            <Text className="w-80 text-center">
                                Inscripcion de {userData.name_user} {userData.pattern_name} {userData.matern_name}
                            </Text>
                        </TouchableOpacity>

                        {childNames.map((childInfo, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => navigation.navigate('Inscripcion', childInfo)}
                                    className="rounded-md bg-baseDark h-10 justify-center ml-7 mr-7 mb-4 items-center">
                                    <Text className="w-80 text-center">
                                        {console.log(childInfo)}
                                        Inscripcion de {childInfo.name_user} {childInfo.pattern_name} {childInfo.matern_name}
                                    </Text>
                                </TouchableOpacity>)
                        })}
                    </>
                )}
        </View>
    );
};

export default PaymentsScreen;
