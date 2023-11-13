import { View, Text } from 'react-native'
import React, { useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'



export const Dropdown = ({ list, title, name, setValue, value }) => {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState(list)

    return (
        <View className='pb-5 '>
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
                    console.log(item.value);
                    setValue({... value, [name]: item.value})
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

export default Dropdown