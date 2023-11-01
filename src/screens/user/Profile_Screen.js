import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import InputFileld from '../../componentes/Inputs/input'
import InputTel from '../../componentes/Inputs/inputTel'
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } from 'firebase/auth'
import PasswordInput from '../../componentes/Inputs/password'
import { useNavigation } from '@react-navigation/native'
import { clearAll, getData } from '../../Storage/storage'
import { doc, updateDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../../firebase/firebase'
import ModalError from '../../componentes/Modals/MAddUserError'
import Formulario from '../../componentes/Formularios/Formulario'


const ProfileScreen = () => {
  const navigation = useNavigation()

  const [showModal, setShowModal] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [datos, setDatos] = useState(
    {
      name_user: '',
      pattern_name: '',
      matern_name: '',
      phone: '',
      password: '',
      confirm_pass: '',
      status: true,
      hijos_matricula: [],
    }
  )




  const Actualizar = () => {
    try {
      // Actualizar la información del usuario
      getData().then(async (value) => {
        const infoUser = doc(db, "Usuarios", value.userUID);
        console.log(value.userUID)
        await updateDoc(infoUser, {
          name_user: datos.name_user,
          pattern_name: datos.pattern_name,
          matern_name: datos.matern_name,
          phone: datos.phone
        });

        console.log("Información de usuario actualizada");
        navigation.goBack();
      }
      ).catch()
    } catch (error) {
      console.error("Error al actualizar correo o información del usuario", error);
    }
  }

  const MinPas = ({ password }) => {
    if (password.length >= 6) {
      return null; // Las contraseñas coinciden, no se muestra ningún mensaje
    } else {
      return (
        <Text style={{ color: 'red' }}>
          Debe ser minimo de 6 caracteres
        </Text>
      );
    }
  };

  const handleAgregarHijo = () => {
    // datos.hijos_matricula.push(initialChidrenInfo)
    console.log(datos)

    // try {
    //   // Obtenemos la sesion del usario
    //   getData().then(async (value) => {
    //     // Apuntamos al documento
    //     const infoUser = doc(db, "Usuarios", value.userUID);
    //     console.log(value.userUID)
    //     // Actualizamos el numero de hijos
    //     await updateDoc(infoUser, {
    //       hijos_matricula: datos.hijos_matricula.push(initialChidrenInfo)
    //     });

    //     console.log("Información de usuario actualizada");
    //     navigation.goBack();
    //   }
    //   ).catch()
    // } catch (error) {
    //   console.error("Error al actualizar correo o información del usuario", error);
    // }
  }

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

  // const ChangePass = async () => {
  //   try {
  //     const user = auth.currentUser;
  //     const newPassword = datos.password;
  //     // Obtener el correo electrónico y la contraseña del usuario desde getData()
  //     const value = await getData();
  //     console.log(value)
  //     const email = value.mail;
  //     const password = value.password;
  //     //es para que vuelva a autenticarse
  //     const credential = EmailAuthProvider.credential(email, password);
  //     await reauthenticateWithCredential(user, credential);
  //     // Cambiar la contraseña
  //     await updatePassword(user, newPassword);
  //     const userUID = value.userUID;

  //     const infoUserRef = doc(db, "Usuarios", userUID);

  //     await updateDoc(infoUserRef, {
  //       password: newPassword,
  //       confirm_pass: newPassword,
  //     });

  //     console.log("Contraseña actualizada exitosamente.");
  //     console.log(value)
  //   } catch (error) {
  //     const value = await getData();
  //     console.error("Error al actualizar la contraseña: ", error);
  //     console.log(value)
  //   }
  // };

  const ChangePass = async () => {
    const user = auth.currentUser;
    const newPassword = datos.password;
    //Actualizar contrasseña en el servicio de auth
    updatePassword(user, newPassword).then(() => {
      console.log('Se actualizo')

      //Actualizar la contraseña en la base da datos
      getData()
        .then(async (value) => {
          const infoUser = doc(db, "Usuarios", value.userUID);
          console.log(value.userUID)
          await updateDoc(infoUser, {
            confirm_pass: newPassword,
            password: newPassword
          });
          setMensaje('Contraseña actualizada')
          setShowModal(true)
          // navigation.goBack();
        })
        .catch((error) => {
          
          const errorCode = error.code;
          const errorMessage = error.message;
          setMensaje(errorCode, ' ', errorMessage)
          setShowModal(true)
          console.log('ChangePass - GetData: ', error)
          
        })

    }).catch((error) => {
      

      const errorCode = error.code;
      const errorMessage = error.message;
      setMensaje(errorCode, ' -- ', errorMessage)

      if(errorCode === 'auth/requires-recent-login'){
        setMensaje(mensaje + '\n \n Requiere volver a iniciar sesion')
      }

      setShowModal(true)

      console.log('ChangePass - UpdataPassword: ',errorCode, ' -- ', errorMessage )
      
    });
  };

  return (
    <ScrollView className="p-9">
      <ModalError
        setVisible={setShowModal}
        visible={showModal}
        message={mensaje}
      />
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
      <InputTel
        title={"Teléfono"}
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
        onPress={() => ChangePass()}
        className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6 ">
        <Text className="w-80 text-center text-white">
          Modificar contraseña
        </Text>
      </TouchableOpacity>
{/* 
      
      {
        datos.hijos_matricula.length > -1
          ?
          datos.hijos_matricula.map((dataHijo, index) => {
            return (
              <Formulario
                key={index}
                informacion={dataHijo} />
            )
          })
          : null
      }

      <TouchableOpacity
        onPress={() => {
          handleAgregarHijo()
        }}
        className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6 ">
        <Text className="w-80 text-center text-white">
          Agregar alumno
        </Text>
      </TouchableOpacity> */}


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