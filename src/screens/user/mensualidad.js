import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { createPayment } from '../../firebase/cloudstorage/CreatePayment'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { generateReference } from '../../componentes/generateRefe'

const Mensualidad = ({ navigation }) => {
    const infoFull = useRoute().params
    grupoIn = infoFull.info
    alumnoIn = infoFull.alumno

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


      const handlePayments = async () => {
        // Insertamos los datos en la coleccion
        const payments_id = await createPayment(datos);
        setDatos({ ...datos, payment_id: payments_id });
  
  
        // Verificar si alumnoIn es un padre o un hijo
        if (alumnoIn.type_user == "Usuario") {
  
          // Si es un padre, actualiza el documento del padre
          const userRef = doc(db, "Usuarios", alumnoIn.userUID);
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
  
  
        //Agregamos el userUID del hijo
        const groupRef = doc(db, "Groups", grupoIn.id);
        await updateDoc(groupRef, {
          matricula_alumno: arrayUnion(alumnoIn.userUID),
        })
        console.log("se realixo hije")

        navigation.navigate("Referencia", datos)
      }

    return (
        <View>
            <Text className="text-2xl ml-4 mt-2">Tu mensualidad</Text>
            <Text className="text-xl ml-4 mt-4 mb-4">Grupo</Text>
            <View className=" flex-row justify-around rounded-md ml-5 mr-5 bg-white p-4 shadow-2xl items-start mt-2 mb-2">
                <View>
                    <Text className=" text-2xl font-bold w-full">
                        {"Grupo " + grupoIn.type_group}
                    </Text>
                    <Text className=" text-xl font-semibold w-full">
                        {"Horario: " + grupoIn.schedule}
                    </Text>
                    <Text className=" text-xl font-semibold w-full">
                        {"Instructor: " + grupoIn.name_teac}
                    </Text>
                </View>
                <View className="ml-10">
                    <Text className=" text-lg font-semibold w-full mt-2 ml-2">
                        {"Cupo: \n " + grupoIn.cont_alumnos + "/" + + grupoIn.cupo}
                    </Text>
                </View>
            </View>
            <Text className="text-2xl ml-4 mt-6">Saldo a pagar</Text>
            <View className=" flex-row justify-around rounded-md ml-5 mr-5 bg-white p-4 shadow-2xl items-start mt-2 mb-2">
                <View>
                    <Text className=" text-2xl font-bold w-full">
                        {"Pago de mensualidad de " + alumnoIn.name_user}
                    </Text>
                    <Text className=" text-2xl font-bold w-full text-right">
                        {"$" + grupoIn.price}
                    </Text>
                </View>
            </View>

            <View className="items-center">
                <TouchableOpacity className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6 mb-6 ml-5 mr-5"
                    onPress={() => {
                        handlePayments()
                    }}>
                    <Text className="text-white text-center w-72">Generar referencia</Text>
                </TouchableOpacity>


                <TouchableOpacity className="rounded-md bg-red p-4 w-80 items-center mb-6 ml-5 mr-5">
                    <Text className="text-white text-center w-72">Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default Mensualidad