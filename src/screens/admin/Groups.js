import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import FiltrarGrupo from '../../componentes/Modals/FiltrarGrupos'

const Groups = () => {
  const navigation = useNavigation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(
    () => {
      setLoading(true)
      const q = query(collection(db, "Groups"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const grupos = [];
        querySnapshot.forEach((doc) => {
          grupos.push({ ...doc.data(), 'id': doc.id });
        });
        setDatos(grupos)
      });
      setLoading(false)
      return unsubscribe
    }, []
  )

  return (
    <>
      <FiltrarGrupo
        setVisible={setIsModalVisible}
        visible={isModalVisible}
      />
      <ScrollView >
        <View className="flex flex-1 items-center mb-28">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => navigation.navigate("AddGroup")}
              className="rounded-md bg-blue-400 p-4 w-72 items-center mt-6 mb-6 ml-1 mr-10">
              <Text className="text-lg text-white font-bold ">
                Agregar
              </Text>
            </TouchableOpacity>

            {/* <AdjustmentsHorizontalIcon color="black" size={35}
              onPress={() => setIsModalVisible(true)} /> */}

          </View>
          {
            loading
              ? <ActivityIndicator size="large" />
              : <View className="items-center justify-center mt-4 w-full px-4">
                {
                  datos.map((grupillos, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => navigation.navigate("AddGroup", grupillos)}
                        key={index}
                        className="rounded-md w-full h-fit bg-white p-4 shadow-2xl items-start mt-2 mb-2">
                        <View className="flex-row">
                          <View className="mr-52">
                            <Text className=" text-2xl font-bold w-full">
                              {"Grupo " + grupillos.type_group}
                            </Text>
                            <Text className=" text-xl font-semibold w-full">
                              {"Horario:\n " +
                                grupillos.schedule}
                            </Text>
                          </View>
                          <View>
                            <Text className=" text-lg font-semibold w-full mt-2 ml-2">
                              {"Cupo: \n " + grupillos.cupo}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
          }
        </View>
        <StatusBar backgroundColor={'#6560AA'} />
      </ScrollView>
    </>
  )
}

export default Groups