import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { getData } from '../../Storage/storage'
import { db } from '../../firebase/firebase'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import ModalLoading from '../../componentes/loading/loading'

const PaymentsScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [childNames, setChildNames] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
       setIsLoading(true) 
        getData()
            .then((data) => {
                setUserData(data)
                // Consulatamos la BD para traernos los datos del usuario
                onSnapshot(doc(db, "Usuarios", userData.userUID), (doc) => {
                    setUserData({ ...doc.data() })
                    fetchChildNames()
                    setIsLoading(false)
                })

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
        const childNamesArray = [];
        //Verifica si userData existe y si tiene una propiedad hijos_matricula que es un array no vacío
        if (userData && userData.hijos_matricula.length >= 0) {
            // Itera a través de los IDs de los hijos_matricula
            for (const childId of userData.hijos_matricula) {
                const childrenRef = doc(db, "Children", childId);
                try {
                    const docSnapshot = await getDoc(childrenRef);
                    // agrega sus datos al array childNamesArray
                    if (docSnapshot.exists()) {
                        childNamesArray.push({ ...docSnapshot.data(), id_user: childId });
                    }
                } catch (error) {
                    setIsLoading(false)
                    console.error('Error al obtener el documento: ', error);
                    console.log(childNamesArray)
                }
            }
        }
        // Agrega tota la informacion al array para que el papi tmb pueda
        childNamesArray.push({ ...userData });
        setChildNames(childNamesArray);
        setIsLoading(false)
    };




    return (
        <View>
            <ModalLoading 
            visible={isLoading}
            />
            <StatusBar hidden={true} />
            <Text className="mb-6 mt-4 ml-7 text-lg">Mensualidad</Text>

            {/* Renderizamos el boton para que se inscriba el usuario */}
            {/* <TouchableOpacity
                // onPress={() => navigation.navigate("Inscripcion", child)}
                className="rounded-md bg-baseDark h-10 justify-center ml-7 mr-7 mb-4 items-center" >
                <Text className="w-80 text-center">Inscripcion de {userData.name_user} {userData.pattern_name} {userData.matern_name}</Text>
    </TouchableOpacity> */}


            {/* Vamos a cargar los botones para la inscripcion de los hijos */}

            {
                childNames.map((child, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => navigation.navigate("Inscripcion", child)}
                            className="rounded-md bg-baseDark h-10 justify-center ml-7 mr-7 mb-4 items-center">
                            <Text className="w-80 text-center">
                                Inscripcion de {child.name_user} {child.pattern_name} {child.matern_name}
                            </Text>
                        </TouchableOpacity>
                    );

                })
            }
        </View>
    );


}

export default PaymentsScreen