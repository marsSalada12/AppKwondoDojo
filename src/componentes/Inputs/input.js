import { View, TextInput, Text } from 'react-native'
import React from 'react'

const InputFileld = ({ title, props, edita = true, max, name, setValue, value }) => {
  return (
    <View className={" w-80 "}>
      <Text
        className="text-lg mb-2 mt-0">{title}
      </Text>
      <TextInput
        placeholder={props}
        editable = {edita}
        maxLength={max}
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

export default InputFileld