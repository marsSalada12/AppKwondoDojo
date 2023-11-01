import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputFileld from '../../componentes/Inputs/input';

import { auth, db } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, getAuth, updateEmail, updateProfile } from 'firebase/auth';
import { createUserWUID } from '../../firebase/cloudstorage/CreateUsers'
import { useRoute } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import Dropdown from '../../componentes/Inputs/DropDown/DropDown';
import { getAllTypeUsers } from '../../firebase/cloudstorage/Default';
import useUser from '../../hooks/useUser';
import ModalError from '../../componentes/Modals/MAddUserError';


const AddUser = ({ navigation }) => {
  const info = useRoute().params

  const [tyUser, setTyUser] = useState([
    { label: "Administrador", value: "Administrador" },
    { label: "Usuario", value: "Usuario" },
    { label: "Maestro", value: "Maestro" }
  ])

  const [modalErrorVisible, setModalErrorVisible] = useState(false)
  const [MsjModalError, setMsjModalError] = useState('')


  const initialDatos = {
    type_user: '',
    name_user: '',
    pattern_name: '',
    matern_name: '',
    mail: '',
    phone: '',
    password: '123456',
    confirm_pass: '123456',
    status: true,
    payments_id: [],
    hijos_matricula: [],
  }

  const [datos, setDatos] = useState(
    info
      ? { ...info }
      : initialDatos
  );

  const { setUser } = useUser()


  // Metodo para guardar a un usuario
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
        setMsjModalError(errorCode, '\n', errorMessage)
        setModalErrorVisible(true)
        console.log('Error AddUser - Create  \n', errorCode, errorMessage)
      });
  }


  //Metodo para desactivar o activar a el usuario
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
      name_user: datos.name_user,
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
    <View
      className="flex flex-1 items-center">

      <ModalError
        setVisible={setModalErrorVisible}
        visible={modalErrorVisible}
        message={MsjModalError} />

      <View className="mt-6 ml-6">
        <Text className="text-2xl">
          Datos de usuario
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={true}>

        <View className=" items-center">
          <Dropdown
            list={tyUser}
            title={"Tipo usuario"}
            name={"type_user"}
            setValue={setDatos}
            value={datos} />




          <InputFileld
            title={"Correo Electrónico"}
            props={"correo@ejemplo.com"}
            edita={info ? false : true}
            max={100}
            name={"mail"}
            setValue={setDatos}
            value={datos}
            type={'email'} />

          <InputFileld
            title={"Nombre/s"}
            props={"Logan Antonio"}
            max={50}
            name={"name_user"}
            setValue={setDatos}
            value={datos}
            type={'letters'} />

          <InputFileld
            title={"Apellido paterno"}
            props={"Peña"}
            max={100}
            name={"pattern_name"}
            setValue={setDatos}
            value={datos}
            type={'letters'} />

          <InputFileld
            title={"Apellido materno"}
            props={"Gonzalez"}
            max={100}
            name={"matern_name"}
            setValue={setDatos}
            value={datos}
            type={'letters'} />

          <InputFileld
            title={"Número de teléfono"}
            props={"8442793235"}
            max={10}
            name={"phone"}
            setValue={setDatos}
            value={datos}
            type={'numeric'} />

        </View>


        {/* Aqui vamos a cargar la informacion de los hijos */}
        {
          info && info.hijos_matricula.length > 0
            ? <Text>Aqui se va a cargar el formulario con la informacion de los hijos</Text>
            : null
        }

        <View className="ml-12 mr-12">
          <TouchableOpacity
            onPress={info ?
              () => actualizar()
              : () => autenticar()}
            className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6">
            <Text className="text-lg text-white font-bold">
              {info
                ? "Actualizar usuario"
                : "Guardar usuario"}
            </Text>
          </TouchableOpacity>
          {info
            ? <TouchableOpacity
              onPress={() => boton()}
              className={"rounded-lg p-4 color w-80 items-center mt-6 mb-10 " + (info.status ? 'bg-red' : 'bg-green')}>
              <Text className="text-lg text-white font-bold">
                {info.status ? "Desactivar" : "Activar"}
              </Text>
            </TouchableOpacity>
            : null}
        </View>
      </ScrollView>
      <StatusBar backgroundColor={'#6560AA'} />
    </View>
  )
}



export default AddUser