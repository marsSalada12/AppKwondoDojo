import { View, TextInput, Text } from 'react-native'
import React from 'react'

const InputTel = ({ title, props, edita, max, min, name, setValue, value }) => {
  return (
    <View className={" w-80 "}>
      <Text
        className="text-lg mb-2 mt-0">{title}
      </Text>
      <TextInput
      keyboardType='numeric'
        placeholder={props}
        editable = {edita}
        maxLength={max}
        minLength={min}
        className={"bg-fondoInput fixed p-3 rounded-md "}
        value={value[name]}
        onChangeText={(Text) => {
          setValue({ ...value, [name]: Text })
        }
        }
      />
    </View>
  )
}

export default InputTel