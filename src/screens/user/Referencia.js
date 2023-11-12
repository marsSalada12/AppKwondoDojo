import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { generateReference } from '../../componentes/generateRefe';

import { getData } from '../../Storage/storage';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { createPayment } from '../../firebase/cloudstorage/CreatePayment';

const Referencia = () => {
  const navigation = useNavigation()
  const route = useRoute().params;
  const alumnoIn = route.alumno;
  const grupoIn = route.grupo;
  const [data, setData] = useState()

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

  // Creacion de una variable que tiene los datos que se van a insertar en la coleccion
  const [datos, setDatos] = useState({
    due_date: formatDate(addDays(new Date().getTime(), 7)),
    emission_date: formatDate(addDays(new Date().getTime(), 0)),
    price: grupoIn.price,
    reference: generateReference(alumnoIn.matricula),
    status: "Pendiente",
    grupo: grupoIn.type_group,
    hora: grupoIn.schedule,
    matricula: alumnoIn.matricula,
    name_user: alumnoIn.name_user,
    ap_paterno: alumnoIn.pattern_name,
    ap_materno: alumnoIn.matern_name,
    userUID: alumnoIn.userUID
  });



  useEffect(() => {
    const handlePayments = async () => {
      // Insertamos los datos en la coleccion
      const payments_id = await createPayment(datos);
      setDatos({ ...datos, payment_id: payments_id });


      // Verificar si alumnoIn es un padre o un hijo
      if (alumnoIn.type_user == "Usuario") {

        // Si es un padre, actualiza el documento del padre
        const userRef = doc(db, "Usuarios", data.userUID);
        await updateDoc(userRef, {
          payments_id: arrayUnion(payments_id),
        });
        console.log("se realixo papiu")
      } else {

        // Si es un hijo, actualiza su propio document
        const alumnoRef = doc(db, "Children", alumnoIn.userUID);
        await updateDoc(alumnoRef, {
          payments_id: arrayUnion(payments_id),
        })
        console.log("se realixo hije")

      }
    }
    handlePayments()
  }, [])



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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("HomeU")
          }}
          className="rounded-md bg-red p-4 w-80 items-center mt-6 mb-6">
          <Text className="text-lg text-white font-bold">
            Volver al inicio
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Referencia;
