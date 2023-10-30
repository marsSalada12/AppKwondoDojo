import { View, TextInput, Text } from 'react-native'
import React from 'react'

const InputCupo = ({ title, props, edita, max, name, setValue, value }) => {
  return (
    <View className={" -z-20 w-40 "}>
      <Text
        className="text-lg mb-2 mt-0">{title}
      </Text>
      <TextInput
        placeholder={props}
        editable = {edita}
        maxLength={max}
        className={"bg-fondoInput p-3 rounded-md "}
        value={value[name]}
        onChangeText={(Text) => {
          setValue({ ...value, [name]: Text })
        }
        }
      />
    </View>
  )
}

export default InputCupo