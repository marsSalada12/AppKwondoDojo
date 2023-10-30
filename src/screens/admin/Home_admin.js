import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { CogIcon } from 'react-native-heroicons/outline'

const HomeAdmin = ({navigation}) => {
  return (
    <View className=" items-end mr-5 mt-5">
      <TouchableOpacity>
        <CogIcon size={45} color= {"gray"} 
        onPress={() => navigation.navigate("Config")}/>
      </TouchableOpacity>
    </View>
  )
}

export default HomeAdmin