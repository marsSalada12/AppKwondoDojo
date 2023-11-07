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

  useEffect(() => {
    const fetchChildNames = async () => {
      if (userData && userData.hijos_matricula && userData.hijos_matricula.length > 0) {
        const childNamesArray = [];

        for (const childId of userData.hijos_matricula) {
          const childrenRef = doc(db, "Children", childId);
          try {
            const docSnapshot = await getDoc(childrenRef);

            if (docSnapshot.exists()) {
              const childInfo = {
                id: childId,
                name_user: docSnapshot.data().name_user,
                //aun no acabo
              };
              childNamesArray.push(childInfo);
            } else {
              childNamesArray.push({ id: childId, name: 'Nombre no encontrado' });
            }
          } catch (error) {
            console.error('Error al obtener el documento: ', error);
            childNamesArray.push('Error al obtener nombre');
          }
        }

        setChildNames(childNamesArray);
      }
    };

    fetchChildNames();
  }, [userData]);

  return (
    <View>
      <StatusBar hidden={true} />
      <Text className="mb-6 mt-4 ml-7 text-lg">Mensualidad</Text>
      {childNames.map((child, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {console.log(childNames[index])}}
          className="rounded-md bg-baseDark h-10 justify-center ml-7 mr-7 mb-4 items-center"
          >
          <Text className = "w-80 text-center"> Inscripcion de {child.name_user} (ID: {child.id})</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default PaymentsScreen