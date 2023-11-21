import { View, Text } from 'react-native'
import React, { useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'



export const DropdownTeacher = ({ list, title, name, field_id, setValue, value }) => {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState(list)

    return (
        <View className='mb-5 '>
            {console.log(value[name])}
            <Text className='pb-3 text-base'>
                {title}
            </Text>
            <DropDownPicker
                disableBorderRadius={true}
                //Estillos del boton que muestra al dropdown
                style={{
                    backgroundColor: "#e6e6e6",
                    borderColor: "#FFF",
                    zIndex: 40
                }}

                //Estillos del  dropdown
                dropDownContainerStyle={{
                    marginTop: 10,
                    backgroundColor: "#e6e6e6",
                    borderColor: "#FFF"
                }}

                
                value={value[name]}
                
                onSelectItem={(item) => {
                    // Concatenamos el valor del ID,, esta guardado en la prop testID sabra diosito que es
                    setValue({...value, [field_id]: item.testID, [name]: item.label})                    
                }}

                open={open}
                setOpen={setOpen}

                items={items}
                setItems={setItems}
                placeholder={""}
            />
        </View>
    )
}

export default DropdownTeacher