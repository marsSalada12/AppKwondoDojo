import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { AdjustmentsHorizontalIcon, DevicePhoneMobileIcon, EnvelopeIcon, PhoneIcon, UserIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from "../../firebase/firebase"


const UsersAdmin = () => {
  const navigation = useNavigation()
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      setLoading(true)
      const q = query(collection(db, "Usuarios"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({ ...doc.data(), 'id': doc.id });
        });
        setDatos(users)
      });
      setLoading(false)
      return unsubscribe
    }, []
  )


  return (
    <ScrollView
      className="flex flex-1">

      <View className="items-center mb-28">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.navigate("AddUser")}
            className="rounded-md bg-blue-400 p-4 w-72 items-center mt-6 mb-6 ml-1 mr-10">
            <Text className="text-lg text-white font-bold ">
              Agregar
            </Text>
          </TouchableOpacity>
          <AdjustmentsHorizontalIcon color="black" size={35} />
        </View>
        {
          loading
            ? <ActivityIndicator size="large" />
            : <View className="items-center justify-center mt-4 w-full px-4">
              {
                datos.map((user, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => navigation.navigate("AddUser", user)}
                      key={index}
                      className="rounded-md w-full bg-white p-4 shadow-2xl items-start mt-4 mb-2">
                      <Text className=" text-lg font-semibold w-full">
                        <UserIcon size={25} color={"black"} />{"\t   " + user.name_user + " " + user.pattern_name + " " + user.matern_name}
                        {"\n"}
                        <EnvelopeIcon size={25} color={"black"} className="mb-4" /> {"\t   " + user.mail}
                        {"\n"}
                        <DevicePhoneMobileIcon size={25} color={"black"} className="mb-4" />{"\t   " + user.phone}
                      </Text>
                    </TouchableOpacity>
                  )
                })
              }
            </View>
        }
      </View>

    </ScrollView>
  )
}

export default UsersAdmin