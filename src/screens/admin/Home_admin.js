import { View, TouchableOpacity, Text, StatusBar, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CheckCircleIcon, CheckIcon, CogIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { clearAll } from '../../Storage/storage'
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase/firebase'

const HomeAdmin = () => {
  const navigation = useNavigation()
  const [pagosPendientes, setPagosPendientes] = useState([])
  const [pagosPagados, setPagosPagados] = useState([])


  useEffect(() => {

    const q = query(collection(db, "Payments"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pendientes = [];
      const pagados = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data().status)
        if (doc.data().status === 'Pendiente') {
          pendientes.push(doc.data());
        } else {
          pagados.push(doc.data());
        }

      });
      setPagosPendientes(pendientes)
      setPagosPagados(pagados)

      console.log(pagados)
    });
  }, [])

  const handleCerrarSesion = () => {
    clearAll()
      .then((value) => {
        console.log('Limpiado: ', value);
        navigation.navigate('Main')
      })
      .catch((error) => {
        console.log('Ocurrio un error: ', error);
      })
  }
  return (
    <ScrollView>
      <View className=" flex flex-1 mx-5 mt-5 ">
        <StatusBar hidden={true} />
        <TouchableOpacity>
          <CogIcon size={45} color={"gray"}
            onPress={() => navigation.navigate("Config")} />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold mb-5 ">
          Pagos pendientes
        </Text>
        <ScrollView

          className=' max-h-96'>
          {
            pagosPendientes.length != 0
              ? <View
                className='rounded-md  bg-white  p-4 shadow-md items-start mb-4'>
                <Text>

                  <View className='rounded-full bg-blue-400'>
                    <CheckIcon
                    
                      size={35} color={'white'} />
                  </View>

                </Text>
              </View>
              : pagosPendientes.map((pago, index) => {
                return (
                  <TouchableOpacity
                    // onPress={() => navigation.navigate("AddGroup", )}
                    key={index}
                    className="rounded-md  bg-white p-4 shadow-md items-start mb-4">
                    <>
                      <Text
                        className='text-xl'>
                        Pago de inscripcion NOMBRE
                      </Text>
                      <Text
                        className='text-base'>
                        Grupo: GRUPO
                      </Text>
                      <Text
                        className='text-base'>
                        Hora: INICIO - FIN
                      </Text>
                    </>
                  </TouchableOpacity>
                )
              })
          }
        </ScrollView>
        <Text className="text-2xl font-semibold mb-5 ">
          Historial de pagos
        </Text>
        <ScrollView
          nestedScrollEnabled={true}
          className=''>
          {
            pagosPagados.map((pago, index) => {
              return (
                <TouchableOpacity
                  // onPress={() => navigation.navigate("AddGroup", )}
                  key={index}
                  className="rounded-md  bg-white p-4 shadow-md items-start mb-4">
                  <>
                    <Text
                      className='text-xl'>
                      Pago de inscripcion NOMBRE
                    </Text>
                    <Text
                      className='text-base'>
                      Grupo: GRUPO
                    </Text>
                    <Text
                      className='text-base'>
                      Hora: INICIO - FIN
                    </Text>
                  </>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
        <TouchableOpacity
          className="bg-red mt-10 p-5 mx-5 rounded-lg mb-32"
          onPress={() => handleCerrarSesion()}>
          <Text
            className='text-center text-white text-base'>
            Cerrar sesion
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default HomeAdmin