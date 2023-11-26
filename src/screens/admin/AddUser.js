import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import InputFileld from '../../componentes/Inputs/input';
import { auth, db } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, getAuth, updateEmail, updateProfile } from 'firebase/auth';
import { createUserWUID } from '../../firebase/cloudstorage/CreateUsers'
import { useRoute } from '@react-navigation/native';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import Dropdown from '../../componentes/Inputs/DropDown/DropDown';
import { getAllTypeUsers } from '../../firebase/cloudstorage/Default';
import useUser from '../../hooks/useUser';
import ModalError from '../../componentes/Modals/MAddUserError';
import InputTel from '../../componentes/Inputs/inputTel';
import { generateMatri } from '../../componentes/generateMatricula';
import Formulario from '../../componentes/Formularios/Formulario';
import ModalLoading from '../../componentes/loading/loading';
import { checkLenghtData } from '../../componentes/checkForm';


const AddUser = ({ navigation }) => {
  const info = useRoute().params

  const [isLoading, setIsLoading] = useState(true)

  const [tyUser, setTyUser] = useState([])

  const [modalErrorVisible, setModalErrorVisible] = useState(false)
  const [MsjModalError, setMsjModalError] = useState('')



  const initialDatos = {
    type_user: '',
    name_user: '',
    pattern_name: '',
    matern_name: '',
    matricula: '',
    mail: '',
    phone: '',
    password: '8bb0cf6eb9b17d0f7d22b456f121257dc1254e1f01665370476383ea776df414',
    confirm_pass: '8bb0cf6eb9b17d0f7d22b456f121257dc1254e1f01665370476383ea776df414',
    status: true,
    payments_id: [],
    hijos_matricula: [],
    lastGroupUID: ''
  }

  const checkKeys = ["name_user", "pattern_name", "matern_name"];
  const [datos, setDatos] = useState(
    info
      ? { ...info }
      : initialDatos
  );

  const VerificarFormulario = () => {
    return (datos.type_user
      && datos.name_user
      && datos.pattern_name
      && datos.matern_name
      && datos.mail
      && datos.phone
      && datos.phone.length == 10)
  }


  // Metodo para guardar a un usuario
  const autenticar = () => {

    // Revisamos que el formulario este completo y cumpla con el taño minimo algunos campos
    if (!VerificarFormulario() || !checkLenghtData(datos, checkKeys)) {
      setMsjModalError("Formulario incompleto")
      setModalErrorVisible(true)
    } else {

      createUserWithEmailAndPassword(auth, datos.mail, "123456")
        .then((userCredential) => {
          setIsLoading(true)
          const user = userCredential.user.uid;
          datos.matricula = generateMatri(datos.name_user, datos.pattern_name, datos.matern_name)
          console.log(datos.matricula)
          console.log(user, '--------')
          createUserWUID(datos, user)
            .then(() => {
              setIsLoading(false)
              navigation.goBack();
            })
            .catch((error) => {
              setIsLoading(false)
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage)
            })
        })
        .catch((error) => {
          setIsLoading(false)
          const errorCode = error.code;
          const errorMessage = error.message;
          setMsjModalError(errorCode, '\n', errorMessage)
          setModalErrorVisible(true)
          console.log('Error AddUser - Create  \n', errorCode, errorMessage)
        })

    }
  }



  //Metodo para desactivar o activar a el usuario
  const desactivar = async () => {
    const groupsCollection = collection(db, "Groups");
    const infoUser = doc(db, "Usuarios", datos.id);
    try {
      // Realizar una consulta para encontrar un grupo con el id_teach igual a userInfo.id_teach y status activo
      const querySnapshot = await getDocs(query(groupsCollection, where("id_teac", "==", datos.id), where("status", "==", true)));
      // Verificar si NO se encontró ningún grupo activo
      if (querySnapshot.empty) {
        // El usuario NO pertenece a ningún grupo activo, puedes actualizar el estado
        await updateDoc(infoUser, {
          status: !info.status
        });
        navigation.goBack();
        console.log("Se actualizó el estado del usuario.");
      } else {
        // El usuario pertenece a algún grupo activo, no puedes actualizar el estado
        console.log("El usuario pertenece a algún grupo activo. No se puede actualizar el estado.");
        setMsjModalError("No se puede desactivar maestro")
        setModalErrorVisible(true)
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
    }
  }

  // Actualizar desde cloudStorage
  const actualizar = async () => {
    setIsLoading(true);
    const infoUser = doc(db, "Usuarios", datos.id);

    try {
      // Revisamos que el formulario este completo y cumpla con el taño minimo algunos campos
      if (!VerificarFormulario() || !checkLenghtData(datos, checkKeys)) {
        console.log("No se pudo actualizar. Verifica el formulario.");
        setMsjModalError("No se pudo actualizar\n Verifica el formulario")
        setModalErrorVisible(true)
        setIsLoading(false);
      } else {

        await updateDoc(infoUser, {
          type_user: datos.type_user,
          name_user: datos.name_user,
          pattern_name: datos.pattern_name,
          matern_name: datos.matern_name,
          phone: datos.phone
        });
        
        setIsLoading(false);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      errorCode = error.code;
      errorMessage = error.message;
      setMsjModalError(errorCode, '\n', errorMessage)
      setModalErrorVisible(true)
      setIsLoading(false);
    }
  }


  const MinTelephone = ({ phone }) => {
    if (phone.length == 10) {
      return null; // 
    } else {
      return (
        <Text style={{ color: 'red' }}>
          Debe ser minimo de 10 dígitos
        </Text>
      );
    }
  }

  const boton = () => {
    desactivar();

  }

  useEffect(
    () => {
      setIsLoading(true);
      getAllTypeUsers()
        .then((user) => {
          setTyUser(user);
        })
        .catch((error) => {
          setIsLoading(false)
          const errorCode = error.code;
          const errorMessage = error.message;
          setMsjModalError(errorCode, '\n', errorMessage)
          setModalErrorVisible(true)
          console.log('Error useEffect - getAllTypeUsers \n', errorCode, errorMessage)
        })
        .finally(() => {
          setIsLoading(false);
        })
    }, [])

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}>
      <View
        className="flex flex-1  px-10 pt-4 ">

        <ModalError
          setVisible={setModalErrorVisible}
          visible={modalErrorVisible}
          message={MsjModalError} />

        <ModalLoading
          visible={isLoading} />

        <View className="items-start w-96">
          <Text className=" text-2xl pt-2 pb-3 w-72">
            Datos de usuario
          </Text>
        </View>

        <View className=" px-1">
          {
            isLoading
              ? <ModalLoading />
              : <><Dropdown

                list={tyUser}
                title={"Tipo usuario"}
                name={"type_user"}
                setValue={setDatos}
                value={datos} />

                <InputFileld
                  title={"Correo Electrónico"}
                  props={""}
                  edita={info ? false : true}
                  max={100}
                  name={"mail"}
                  setValue={setDatos}
                  value={datos}
                  type={'email'} />

                <InputFileld
                  title={"Nombre/s"}
                  props={""}
                  edita={true}
                  max={50}
                  name={"name_user"}
                  setValue={setDatos}
                  value={datos}
                  type={'letters'} />

                <InputFileld
                  title={"Apellido paterno"}
                  props={""}
                  edita={true}
                  max={100}
                  name={"pattern_name"}
                  setValue={setDatos}
                  value={datos}
                  type={'letters'} />

                <InputFileld
                  title={"Apellido materno"}
                  props={""}
                  max={100}
                  edita={true}
                  name={"matern_name"}
                  setValue={setDatos}
                  value={datos}
                  type={'letters'} />

                <InputTel
                  title={"Número de teléfono"}
                  props={""}
                  max={10}
                  min={10}
                  name={"phone"}
                  setValue={setDatos}
                  value={datos}
                  type={'numeric'} />
                <MinTelephone phone={datos.phone} />
              </>
          }



        </View>

        <View className="">
          <TouchableOpacity
            onPress={() => {
              if (info) {
                actualizar()
              } else {
                autenticar()
              }
            }
            }
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
            <View className='mb-11'>
              {
                info.hijos_matricula.map((hijo_id, index) => {
                  return (
                    <Formulario
                      key={index}
                      childID={hijo_id}
                      admin={true}
                    />
                  )
                })
              }
            </View>
            : null
        }
        <StatusBar backgroundColor={'#6560AA'} />
      </View>
    </ScrollView>
  )
}



export default AddUser