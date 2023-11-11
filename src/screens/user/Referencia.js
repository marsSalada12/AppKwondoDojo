import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { generateReference } from '../../componentes/generateRefe';


const Referencia = () => {
  const navigation = useNavigation();
  const route = useRoute().params;
  alumnoIn = route.alumno
  grupoIn = route.grupo

  // Función para sumar 7 días a un timestamp
  const addDays = (timestamp, days) => {
    const date = new Date(timestamp);
    date.setDate(date.getDate() + days);
    return date.getTime();
  };


  const [datos, setDatos] = {
    due_date: addDays(new Date().getTime(), 7), // Sumar 7 días a la fecha actual
    emission_date: addDays(new Date().getTime(),0),
    price: grupoIn.price,
    reference: generateReference(alumnoIn.matricula)
  }
  return (
    <View className="ml-6">
      <Text className="text-3xl mt-4">Mensualidad</Text>
      <Text className="mt-2">Deposito en banco</Text>
      <View>
        <Text className="mt-2">Banco</Text>
        <Text className="mt-2">Santander</Text>
      </View>
      <View>
        <Text className="mt-2">Nombre del servicio</Text>
        <Text className="mt-2">Escuela KwondoDojo</Text>
      </View>
      <View>
        <Text className="mt-2">Clave del servicio</Text>
        <Text className="mt-2">referencia</Text>
      </View>
      <View>
        <Text className="mt-2">Monto a pagar</Text>
        <Text className="mt-2">{grupoIn.price}</Text>
      </View>
    </View>
  )
}

export default Referencia