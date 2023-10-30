import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputFileld from '../../componentes/Inputs/input';
import DropdownUsuarios from '../../componentes/Inputs/DropDown/DropDownUsurios';
import DropdownBase from '../../componentes/Inputs/DropDown/DropDownBase';

import { auth, db } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, updateEmail, updateProfile } from 'firebase/auth';
import { createUserWUID } from '../../firebase/cloudstorage/CreateUsers'
import { useRoute } from '@react-navigation/native';
import { collection, doc, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { actualizarUID } from '../../firebase/cloudstorage/ActualizarUser';
import { StatusBar } from 'expo-status-bar';

const AddUser = ({ navigation }) => {

  const info = useRoute().params
  

  const [tyUser, setTyUser] = useState()


  const initialDatos = {
    type_user: '',
    name_user: '',
    pattern_name: '',
    matern_name: '',
    mail: '',
    phone: '',
    password: '',
    confirm_pass: '',
    status: '',
    payments_id: [],
    hijos_matricula: [],
  }

  const [datos, setDatos] = useState(
    info
      ? { ...info }
      : initialDatos
  );

  const autenticar = () => {
    createUserWithEmailAndPassword(auth, datos.mail, "123456")
      .then((userCredential) => {
        const user = userCredential.user.uid;
        createUserWUID(datos, user)
          .then(() => {
            navigation.goBack();
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
          })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
      });
  }

  useEffect(() => {
    const q = query(collection(db, "Default"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const typeUser = [];
      querySnapshot.forEach((doc) => {
        typeUser.push({ ...doc.data().tipo_usuario });
      });
      setTyUser(typeUser)

    });
    return unsubscribe
  }, [])

  const desactivar = async () => {
    const infoUser = doc(db, "Usuarios", datos.id);
    await updateDoc(infoUser, {
      status: !info.status
    });
  }

   //Actualizar desde cloudStorage
   const actualizar = async () => {
    const infoUser = doc(db, "Usuarios", datos.id);
    await updateDoc(infoUser, {
      type_user: datos.type_user,
      name_user:datos.name_user,
      pattern_name: datos.pattern_name,
      matern_name: datos.matern_name,
      phone: datos.phone
    });
    navigation.goBack()
   }

  const boton = () => {
    desactivar();
    navigation.goBack();
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      className="flex flex-1">
      <View className="mt-6 ml-6">
        <Text className="text-2xl">Datos de usuario</Text>

      </View>

      <View className="mt-5 -mb-2 ml-11">
        <DropdownBase
          list={tyUser}
          title={"Tipo usuario"}
          name={"type_user"}
          setValue={setDatos}
          value={datos} />
      </View>
      <View className=" items-center">
        <InputFileld
          title={"Correo Electrónico"}
          props={"correo@ejemplo.com"}
          edita = {info ? false : true}
          max={100}
          name={"mail"}
          setValue={setDatos}
          value={datos} />

        <InputFileld
          title={"Nombre/s"}
          props={"Logan Antonio"}
          edita = {info ? true : true}
          max={100}
          name={"name_user"}
          setValue={setDatos}
          value={datos} />

        <InputFileld
          title={"Apellido paterno"}
          props={"Peña"}
          edita = {info ? true : true}
          max={100}
          name={"pattern_name"}
          setValue={setDatos}
          value={datos} />

        <InputFileld
          title={"Apellido materno"}
          props={"Gonzalez"}
          edita = {info ? true : true}
          max={100}
          name={"matern_name"}
          setValue={setDatos}
          value={datos} />

        <InputFileld
          title={"Número de teléfono"}
          props={"8442793235"}
          edita = {info ? true : true}
          max={10}
          name={"phone"}
          setValue={setDatos}
          value={datos} />
      </View>

      <View className="ml-12 mr-12">



        <TouchableOpacity
          onPress={info ?
            () => actualizar()
            : () => autenticar()}
          className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6 mb-6">
          <Text className="text-lg text-white font-bold">
            {info
              ? "Actualizar usuario"
              : "Guardar usuario"}
          </Text>
        </TouchableOpacity>
        {info
          ? <TouchableOpacity
            onPress={() => boton()}
            className={"rounded-m p-4 color w-80 items-center mt-2 mb-2 " + (info.status ? 'bg-red' : 'bg-green')}>
            <Text className="text-lg text-white font-bold">
              {info.status ? "Desactivar" : "Activar"}
            </Text>
          </TouchableOpacity>
          : null}

      </View>
      <StatusBar backgroundColor={'#6560AA'} />
    </ScrollView>
  )
}



export default AddUser