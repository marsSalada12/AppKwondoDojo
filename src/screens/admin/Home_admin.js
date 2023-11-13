import { View, TouchableOpacity, Text, StatusBar, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CheckCircleIcon, CheckIcon, ClipboardDocumentCheckIcon, CogIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { clearAll } from '../../Storage/storage'
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase/firebase'
import ModalLoading from '../../componentes/loading/loading'

const HomeAdmin = () => {
  const navigation = useNavigation()
  const [pagosPendientes, setPagosPendientes] = useState([])
  const [pagosPagados, setPagosPagados] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    const q = query(collection(db, "Payments"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pendientes = [];
      const pagados = []
      querySnapshot.forEach((doc) => {
        if (doc.data().status === 'Pendiente') {
          pendientes.push({ ...doc.data(), "payment_id": doc.id });
        } else {
          pagados.push({ ...doc.data(), "payment_id": doc.id });
        }

      });
      setPagosPendientes(pendientes)
      setPagosPagados(pagados)
      setLoading(false)
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
      {
        loading
          ? <ModalLoading />
          : <View className=" flex flex-10 px-5 pt-5 scroll-pb-10 bg-baseDark">
            <StatusBar hidden={true} />
            <View className="flex-row justify-between mb-1">
              <Text className="text-2xl font-bold  ">
                
              </Text>
              <TouchableOpacity>
                <CogIcon size={45} color={"gray"}
                  onPress={() => navigation.navigate("Config")} />
              </TouchableOpacity>
            </View>
            <Text className="text-2xl font-bold mb-2 ">
              Pagos pendientes
            </Text>
            <ScrollView

              className=' max-h-96'>
              {
                pagosPendientes.length == 0
                  ? <View
                    className='rounded-md  bg-white  p-4 shadow-md  mb-4 flex-row items-center'>
                    <CheckIcon
                      size={35} color={'black'} />
                    {/* <View className='rounded-full bg-blue-400'></View> */}
                    <Text
                      className='text-lg w-80 px-2'>
                      Sin pagos pendientes por aceptar
                    </Text>


                  </View>
                  : pagosPendientes.map((pago, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("Referencia", { ...pago, "admin": true })
                        }}
                        key={index}
                        className="rounded-md  bg-white p-4 shadow-md items-start mb-4">
                        <>
                          <Text
                            className='text-xl'>
                            Pago de mensualidad {pago.name_user} {pago.ap_paterno} {pago.ap_materno}
                          </Text>
                          <Text
                            className='text-base'>
                            Grupo: {pago.grupo}
                          </Text>
                          <Text
                            className='text-base w-28'>
                            Hora: {pago.hora}
                          </Text>
                        </>
                      </TouchableOpacity>
                    )
                  })
              }
            </ScrollView>
            <Text className="text-2xl font-bold mb-5 ">
              Historial de pagos
            </Text>
            <ScrollView
              nestedScrollEnabled={true}
              className=''>
              {

                pagosPagados.length == 0
                  ? <View
                    className='rounded-md  bg-white  p-4 shadow-md  mb-4 flex-row items-center'>

                    <ClipboardDocumentCheckIcon
                      size={35} color={'black'} />

                    <Text
                      className='text-lg px-4'>
                      Historial limpio
                    </Text>


                  </View>
                  : pagosPagados.map((pago, index) => {
                    return (
                      <TouchableOpacity

                        onPress={() => {
                          navigation.navigate("Referencia", { ...pago, "admin": true })
                        }}
                        key={index}
                        className="rounded-md  bg-white p-4 shadow-md items-start mb-4">
                        <View className=''>
                          <Text
                            className='text-xl'>
                            Pago de mensualidad {pago.name_user} {pago.ap_paterno} {'\n'} {pago.ap_materno}
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
            <TouchableOpacity
              className="bg-red mt-10 p-5 mx-5 rounded-lg"
              onPress={() => handleCerrarSesion()}>
              <Text
                className='text-center text-white text-base'>
                Cerrar sesion
              </Text>
            </TouchableOpacity>
          </View>
      }

    </ScrollView>
  )
}

export default HomeAdmin