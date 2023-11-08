import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
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
import Formulario from '../../componentes/Formularios/Formulario';
import ModalLoading from '../../componentes/loading/loading';


const AddUser = ({ navigation }) => {
  const info = useRoute().params

  const [isLoading, setIsLoading] = useState(false)

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


  // Metodo para guardar a un usuario
  const autenticar = () => {
    setIsLoading(true)
    createUserWithEmailAndPassword(auth, datos.mail, "123456")
      .then((userCredential) => {
        const user = userCredential.user.uid;
        createUserWUID(datos, user)
          .then(() => {
            setIsLoading(true)
            navigation.goBack();
          })
          .catch((error) => {
            setIsLoading(true)
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
          })
      })
      .catch((error) => {
        setIsLoading(true)
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
    setIsLoading(true)
    const infoUser = doc(db, "Usuarios", datos.id);
    await updateDoc(infoUser, {
      type_user: datos.type_user,
      name_user: datos.name_user,
      pattern_name: datos.pattern_name,
      matern_name: datos.matern_name,
      phone: datos.phone
    });
    setIsLoading(true)
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

      <ModalLoading
        visible={isLoading} />

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

            edita={info ? false : true}
            max={100}
            name={"mail"}
            setValue={setDatos}
            value={datos}
            type={'email'} />

          <InputFileld
            title={"Nombre/s"}

            max={50}
            name={"name_user"}
            setValue={setDatos}
            value={datos}
            type={'letters'} />

          <InputFileld
            title={"Apellido paterno"}

            max={100}
            name={"pattern_name"}
            setValue={setDatos}
            value={datos}
            type={'letters'} />

          <InputFileld
            title={"Apellido materno"}

            max={100}
            name={"matern_name"}
            setValue={setDatos}
            value={datos}
            type={'letters'} />

          <InputFileld
            title={"Número de teléfono"}
            max={10}
            name={"phone"}
            setValue={setDatos}
            value={datos}
            type={'numeric'} />

        </View>

        <View className="ml-12 mr-12">
          <TouchableOpacity
            onPress={info ?
              () => actualizar()
              : () => autenticar()}
            className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6">
            <Text className="text-lg text-white font-bold">
              {
                info
                  ? "Actualizar usuario"
                  : "Guardar usuario"
              }

            </Text>
          </TouchableOpacity>
          {info
            ? <TouchableOpacity
              onPress={() => boton()}
              className={"rounded-lg p-4 color w-80 items-center mt-6 mb-10 " + (info.status ? 'bg-red' : 'bg-green')}>
              <Text className="text-lg text-white font-bold">
                {
                  info.status
                    ? "Desactivar"
                    : "Activar"
                }
              </Text>
            </TouchableOpacity>
            : null
          }
        </View>

        {/* Aqui vamos a cargar la informacion de los hijos */}
        {
          info && info.hijos_matricula.length > 0
            ?
            <View className='items-center mb-11'>
              {
                info.hijos_matricula.map((hijo_id, index) => {
                  console.log(hijo_id)
                  return (
                    <Formulario
                      key={index}
                      childID={hijo_id}
                    />
                  )
                })
              }
            </View>
            : null
        }

      </ScrollView>
      <StatusBar backgroundColor={'#6560AA'} />
    </View>
  )
}



export default AddUser