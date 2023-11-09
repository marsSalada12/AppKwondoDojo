import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { getData } from '../../Storage/storage'
import { db } from '../../firebase/firebase'
import { doc, getDoc } from 'firebase/firestore'

const PaymentsScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [childNames, setChildNames] = useState([]);

  useLayoutEffect(() => {
    getData()
      .then((data) => {
        setUserData(data)

      })
      .catch((error) => {
        console.log('Error AppNavigation : ', error)
      })
  }, [])

  //Obtener los nombre de los hijes
  const fetchChildNames = async () => {
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
          console.error('Error al obtener el documento: ', error);
          console.log(childNamesArray)
        }
      }
    }
    // Agrega tota la informacion al array para que el papi tmb pueda
    childNamesArray.push({ ...userData });
    console.log(childNamesArray, "-----");
    setChildNames(childNamesArray);
  };


  useEffect(() => {
    fetchChildNames();

  }, [userData]);

  return (
    <View>
      <StatusBar hidden={true} />
      <Text className="mb-6 mt-4 ml-7 text-lg">Mensualidad</Text>
      {childNames.map((child, index) => {
        if (child.id_user || child.userUID) { // Comprueba si hay un nombre de usuario
          {console.log(child, "child")}
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