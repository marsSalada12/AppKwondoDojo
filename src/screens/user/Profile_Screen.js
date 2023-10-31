import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import InputFileld from '../../componentes/Inputs/input'
import InputTel from '../../componentes/Inputs/inputTel'
import { updateEmail } from 'firebase/auth'
import PasswordInput from '../../componentes/Inputs/password'
import { useNavigation } from '@react-navigation/native'
import { clearAll } from '../../Storage/storage'

const ProfileScreen = () => {
  const navigation =  useNavigation()
  const [datos, setDatos] = useState(
    {
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
  )

  const Actualizar = async () => {
    const user = auth.currentUser;

    try {
      // Actualizar el correo electrónico
      await updateEmail(user, datos.mail);
      console.log("Correo electrónico actualizado");

      // Actualizar la información del usuario
      const infoUser = doc(db, "Usuarios", datos.id);
      await updateDoc(infoUser, {
        name_user: datos.name_user,
        pattern_name: datos.pattern_name,
        matern_name: datos.matern_name,
        phone: datos.phone,
        mail: datos.mail
      });

      console.log("Información de usuario actualizada");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar correo o información del usuario", error);
    }
  }

  const MinPas = ({ password }) => {
    if (password.length > 6) {
      return null; // Las contraseñas coinciden, no se muestra ningún mensaje
    } else {
      return (
        <Text style={{ color: 'red' }}>
          Debe ser minimo de 6 caracteres
        </Text>
      );
    }
  };

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
    <ScrollView className="p-9">
      <Text className="text-xl  text-bold">Actualizar datos de perfil</Text>
      <InputFileld
        title={"Nombre/s"}
        props={"Diego Antonio"}
        edita={true}
        max={100}
        name={"name_user"}
        setValue={setDatos}
        value={datos} />
      <InputFileld
        title={"Apellido paterno"}
        props={"Lopez"}
        edita={true}
        max={100}
        name={"pattern_name"}
        setValue={setDatos}
        value={datos} />
      <InputFileld
        title={"Apellido materno"}
        props={"Urbina"}
        edita={true}
        max={100}
        name={"matern_name"}
        setValue={setDatos}
        value={datos} />
      <InputFileld
        title={"Correo electrónico"}
        props={"ejemplo@gmail.com"}
        edita={true}
        max={100}
        name={"mail"}
        setValue={setDatos}
        value={datos} />
      <InputTel
        title={"Correo electrónico"}
        props={"8445688445"}
        edita={true}
        max={10}
        name={"phone"}
        setValue={setDatos}
        value={datos} />
      <TouchableOpacity
        onPress={() => Actualizar()}
        className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6 mb-6">
        <Text className="w-80 text-center text-white">
          Modificar información
        </Text>
      </TouchableOpacity>
      <Text className="text-xl text-bold">Modificar contraseña</Text>
      <PasswordInput
        title={"Contraseña"}
        props={"........."}
        name={"password"}
        setValue={setDatos}
        value={datos} />
      <MinPas password={datos.password} />
      <TouchableOpacity
        onPress={() => console.log("falta")}
        className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6 ">
        <Text className="w-80 text-center text-white">
          Modificar información
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleCerrarSesion()
          console.log("falta")

        }}
        className="rounded-md bg-red p-4 w-80 items-center mt-3 mb-40">
        <Text className="w-80 text-center text-white">
          Cerrar sesion
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
  
}

export default ProfileScreen