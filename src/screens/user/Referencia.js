import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import Dropdown from '../../componentes/Inputs/DropDown/DropDown';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const Referencia = () => {
  const navigation = useNavigation()
  const inf = useRoute().params
  const [datos, setDatos] = useState(inf)


  const estados = [
    { label: "Cancelado", value: "Cancelado" },
    { label: "Pendiente", value: "Pendiente" },
    { label: "Pagado", value: "Pagado" },
  ]

  const handleStatus = async () => {
    const payRef = doc(db, "Payments", datos.payment_id);
    // Actualizamos el estatuto del pago
    await updateDoc(payRef, {
      status: datos.status
    });
   
  }

  return (
    <View className="pl-8 pr-8 flex-1 bg-white">
      <Text className="text-3xl mt-4">Mensualidad</Text>
      <Text className="mt-2 text-xl">Deposito en banco</Text>
      <View className="flex-row mr-6 ml-4 justify-between">
        <Text className="mt-2 w-36 text-lg">Nombre del servicio</Text>
        <Text className="mt-2 text-lg text-blue-400 font-bold">Escuela KwondoDojo</Text>
      </View>
      <View className="flex-row mr-6 ml-4 justify-between">
        <Text className="mt-2 w-36 text-lg">Clave del servicio</Text>
        <Text className="mt-2 text-lg text-blue-400 font-bold">1826</Text>
      </View>
      <View className="flex-row mr-6 ml-4 justify-between">
        <Text className="mt-2 w-36 text-lg">Referencia</Text>
        <Text className="mt-2 text-lg text-blue-400 font-bold">{datos.reference}</Text>
      </View>
      <View className="flex-row mr-6 ml-4 justify-between">
        <Text className="mt-2 text-lg">Monto a pagar</Text>
        <Text className="mt-2 text-lg text-blue-400 font-bold">$ {datos.price}</Text>
      </View>
      <View className="flex-row mr-6 ml-4 justify-between">
        <Text className="mt-2 text-lg">Fecha vencimiento</Text>
        <Text className="mt-2 text-lg text-blue-400 font-bold">{datos.due_date}</Text>
      </View>

      {
        datos.admin
          ? (
            <>
              <Dropdown
                list={estados}
                name={"status"}
                title={''}
                setValue={setDatos}
                value={datos}
              />

              <TouchableOpacity
                onPress={() => {
                  handleStatus()
                  navigation.navigate("HomeA")
                }}
                className={"rounded-md p-4 bg-blue-400 items-center"}>
                <Text className="text-lg text-white font-bold">
                  Actualizar estado
                </Text>
              </TouchableOpacity>
            </>
          )
          : (
            <View className="flex-row mr-6 ml-4 justify-between">
              <Text className="mt-2 text-lg">Estatus</Text>
              <Text className="mt-2 text-lg text-blue-400 font-bold">{datos.status}</Text>
            </View>
          )
      }

      <TouchableOpacity
        onPress={() => {
          if(datos.admin){
            navigation.navigate("HomeA")
          }else{
            navigation.navigate("HomeU")
          }
          
        }}
        className={"rounded-md p-4 bg-red items-center mt-6 mb-6 "}>
        <Text className="text-lg text-white font-bold">
          Volver al inicio
        </Text>
      </TouchableOpacity>



    </View>
  );
}

export default Referencia;
