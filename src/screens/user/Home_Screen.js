import { View, Text, Touchable, TouchableOpacity, StatusBar, ScrollView } from 'react-native'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { HeartIcon } from 'react-native-heroicons/solid'
import { useIsFocused } from '@react-navigation/native'
import { CheckIcon } from 'react-native-heroicons/outline'
import ModalLoading from '../../componentes/loading/loading'
import { getData } from '../../Storage/storage'
import { db } from '../../firebase/firebase';

const HomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused()
  const [isLoading, setIsLoading] = useState(false)


  const [pagosPendientes, setPagosPendientes] = useState([])

  // Variables para almacenar los ids del usuario e hijos
  const [idusuario, setIdusuario] = useState([""])
  const [idHijos, setIdHijos] = useState([""])


  useEffect(() => {
    getData()
      .then((userData) => {
        setIdusuario([userData.userUID])
        setIdHijos(userData.hijos_matricula)
        const q = query(collection(db, "Payments"), where("userUID", "in", idusuario.concat(idHijos)), where("status", "==", "Pendiente"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const pendientes = [];
          querySnapshot.forEach((doc) => {
            pendientes.push({...doc.data(), "payment_id": doc.id});
          });
          setPagosPendientes(pendientes)
        });

      })
      .catch((error) => {
        console.log(error)
      })
  }, [isFocused,])

  return (
    <ScrollView>
      {
        isLoading
          ? <ModalLoading />
          : <View className=" flex flex-1 mx-5 mt-5 ">
            <StatusBar hidden={true} />

            <Text className="text-2xl font-semibold mb-5 ">
              Grupo y horario
            </Text>
            <Text>
              Aqui ira el horario del usuario y de las criaturas
            </Text>

            <Text className="text-2xl font-semibold mb-5 ">
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
                            Limite de pago: {pago.due_date}
                          </Text>
                        </>
                      </TouchableOpacity>
                    )
                  })
              }
            </ScrollView>
            <HeartIcon color='#6560AA' />
            <TouchableOpacity className="bg-red"
              onPress={() => {
                console.log("hola")
                //Nos traemos la sesion guardada en el celular
                getData()
                  .then((value) => {
                    console.log(value);
                  })
                  .catch()
              }}>
              <Text>
                Consular sesion
              </Text>
            </TouchableOpacity>

          </View>
      }
    </ScrollView>
  )
}

export default HomeScreen