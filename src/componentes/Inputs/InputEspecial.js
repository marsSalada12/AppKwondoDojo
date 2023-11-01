import { View, TextInput, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Checkbox from 'expo-checkbox'
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const InputFEspecial = ({ title, props, name, setValue, value, type }) => {

  const [isChecked, setChecked] = useState(false);
  const [mensualidad, setMensualidad] = useState();


  useEffect(() => {
    if (isChecked) {
      const q = query(collection(db, "Default"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const mensualidadValue = doc.data().base_price;
          setMensualidad(mensualidadValue);
          setValue({ ...value, [name]: mensualidadValue });
        });
      });
      return unsubscribe;
    }
  }, [isChecked]);

  return (
    <View className={"flex-row w-80 "}>
      <View>
        <Text
          className="text-lg mb-2 mt-2">
          {title}
        </Text>
        <TextInput
          placeholder={props}
          editable={!isChecked}
          className={"bg-fondoInput fixed p-3 rounded-md "}
          value={isChecked ? String(mensualidad) : value[name]}
          onChangeText={(Text) => {
            if (type === 'email') {
              setValue({ ...value, [name]: Text })
            } else {
              if (type === 'letters') {
                const result = Text.replace(/(\W|\d)*/g, '')
                setValue({ ...value, [name]: result })

              } else {
                const result = Text.replace(/\D*/g, '')
                setValue({ ...value, [name]: result })

              }
            }
          }}
        />
      </View>
      <View className="mt-3 ml-4">
        <Checkbox
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#3E3D4F' : undefined}
        />
      </View>
    </View>
  )
}

export default InputFEspecial