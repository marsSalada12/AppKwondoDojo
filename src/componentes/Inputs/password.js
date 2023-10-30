import { View, TextInput, Text } from 'react-native'
import React, { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/solid'


const PasswordInput = ({ title, props, name, setValue, value }) => {
  const [visible, setVisible] = useState(true)
  return (
    <View >
      <Text className="text-lg mb-2 mt-2">
        {title}
      </Text>

      <View className="flex flex-row justify-between rounded-md bg-fondoInput p-3 w-80 ">
        <TextInput
          secureTextEntry={visible}
          placeholder={props}
          className={"flex flex-1 shrink"}
          value={value[name]}
          onChangeText={(Text) => {
            setValue({ ...value, [name]: Text })
          }
          } />
        {
          visible
            ? <EyeIcon className={"float-right fixed"}
              size={35} fill="#6560AA"
              onPress={() => setVisible(!visible)} />
            : <EyeSlashIcon
              size={35}
              fill="#6560AA"
              onPress={() => setVisible(!visible)} />
        }
      </View>
    </View>
  )
}

export default PasswordInput