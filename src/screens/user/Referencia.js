import { View, Text, TouchableOpacity } from 'react-native'
import React, { useId, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { generateReference } from '../../componentes/generateRefe';
import { createPayWUID } from '../../firebase/cloudstorage/CreatePayment';
import { storeData } from '../../Storage/storage';

const Referencia = () => {
  const navigation = useNavigation();
  const route = useRoute().params;
  const alumnoIn = route.alumno;
  const grupoIn = route.grupo;

  // Función para sumar 7 días a un timestamp
  const addDays = (timestamp, days) => {
    const date = new Date(timestamp);
    date.setDate(date.getDate() + days);
    return date.getTime();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const uid = useId()
  const [datos, setDatos] = useState({
    due_date: formatDate(addDays(new Date().getTime(), 7)),
    emission_date: formatDate(addDays(new Date().getTime(), 0)),
    price: grupoIn.price,
    reference: generateReference(alumnoIn.matricula),
    status: "Pendiente",
    payment_id: uid
  });

  createPayWUID(datos, uid)
    .then(async (info) => {
      console.log(info, "createpaymentId")
      await storeData(info)

    }
    ).catch(async (error) => {

      await clearAll()
      const errorCode = error.code;
      const errorMessage = error.message;
      setMsjModal(errorCode, '\n', errorMessage)
      setShowModal(true)
      console.log(errorMessage)
    })

  return (
    <View className="ml-8 mr-8">
      <Text className="text-3xl mt-4">Mensualidad</Text>
      <Text className="mt-2 text-xl">Deposito en banco</Text>

      <View className="flex-row mr-6 ml-4 justify-between">
        <Text className="mt-2 text-lg">Banco</Text>
        <Text className="mt-2 text-lg">Santander</Text>
      </View>

      <View className="flex-row mr-6 ml-4 justify-between">
        <Text className="mt-2 w-36 text-lg">Nombre del servicio</Text>
        <Text className="mt-2 text-lg">Escuela KwondoDojo</Text>
      </View>

      <View className="flex-row mr-6 ml-4 justify-between">
        <Text className="mt-2 w-36 text-lg">Clave del servicio</Text>
        <Text className="mt-2 text-lg">{datos.reference}</Text>
      </View>

      <View className="flex-row mr-6 ml-4 justify-between">
        <Text className="mt-2 text-lg">Monto a pagar</Text>
        <Text className="mt-2 text-lg">$ {datos.price}</Text>
      </View>

      <View className="flex-row mr-6 ml-4 justify-between">
        <Text className="mt-2 text-lg">Fecha vencimiento</Text>
        <Text className="mt-2 text-lg">{datos.due_date}</Text>
      </View>

      <View>
        <TouchableOpacity><Text>Volver al inicio</Text></TouchableOpacity>
      </View>
    </View>
  );
}

export default Referencia;
