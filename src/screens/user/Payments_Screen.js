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
      {childNames.map((child, index) => {
        if (child.id_user || child.userUID) { // Comprueba si hay un nombre de usuario
          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate("Inscripcion", child)}
              className="rounded-md bg-baseDark h-10 justify-center ml-7 mr-7 mb-4 items-center"
            >
              <Text className="w-80 text-center">Inscripcion de {child.name_user}</Text>
            </TouchableOpacity>
          );
        }else
          return null; // No tiene nombre de usuario, no se muestra el botón
      })}
    </View>
  );
  

}

export default PaymentsScreen