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
      <View className='flex-row justify-between pt-2 '>
        <Text className="text-lg ">{title}</Text>

        {/* Revisamos el tamaño que tiene el objeto del usuario
        para que se muestre el mensaje debe de ser menor a 3 el tamaño y 
        debe de contenter algo */}
        {
          name !== 'mail' && (value[name].length < 3 && value[name])
            ? <Text className="text-base text-red ">Tamaño minimo 3</Text>
            : null
        }
      </View>



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
            const result = Text.replace(/[\W|\d|\s]*/g, '');
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