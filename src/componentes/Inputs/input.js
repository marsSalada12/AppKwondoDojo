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
      <Text className="text-lg pb-2 w-80 pt-0">{title}</Text>
      <TextInput

        placeholder={props}
        editable={edita}
        maxLength={max}
        className={"bg-fondoInput fixed p-3 rounded-md "}
        value={value[name]}
        onChangeText={(Text) => {
          if (type === 'email') {
            setValue({ ...value, [name]: Text });
          } else if (type === 'letters') {
            const result = Text.replace(/[^a-zA-Z0-9 ]/g, '');
            setValue({ ...value, [name]: result });
          } else if (type === 'date') {
            // Asumiendo que el formato es DD/MM/YY
            const cleanedText = Text.replace(/[^\d/]/g, ''); // Eliminar caracteres no numéricos ni barras
            if (cleanedText.length <= 8) {
              // Validar solo si la longitud es igual o menor a 8 (DD/MM/YY)
              setValue({ ...value, [name]: cleanedText });
            }
            // Puedes manejar el caso en el que la fecha no cumple con el formato deseado.
            // Por ejemplo, mostrar un mensaje de error o no actualizar el valor.
          } else {
            const result = Text.replace(/\D*/g, '');
            setValue({ ...value, [name]: result });
          }
        }}
      />
    </View>
  )
}

export default InputFileld