import { View, TextInput, Text } from 'react-native'
import React from 'react'

const InputFileld = ({ title,
  props,
  edita = true,
  max,
  name,
  setValue,
  value,
  type = 'email'
}) => {
  return (
    <View className={" "}>
      <Text className="text-lg mb-2 mt-0">{title}</Text>
      <TextInput

        placeholder={props}
        editable={edita}
        maxLength={max}
        className={"bg-fondoInput fixed p-3 rounded-md "}
        value={value[name]}
        onChangeText={(Text) => {
          if (type === 'email') {
            setValue({ ...value, [name]: Text })
          } else {
            if (type === 'letters') {
              const result = Text.replace(/[^a-zA-Z0-9 ]/g, '');
              setValue({ ...value, [name]: result })  

            } else {
              const result = Text.replace(/\D*/g, '')
              setValue({ ...value, [name]: result })

            }
          }
        }
        }
      />
    </View>
  )
}

export default InputFileld