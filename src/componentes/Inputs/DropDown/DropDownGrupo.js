import { View, Text } from 'react-native'
import React, { useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import { QuestionMarkCircleIcon } from 'react-native-heroicons/solid'
import GroupInfo from '../../Modals/GroupInfo'

export const DropdownGroup = ({ list, title, active = true, name, setValue, value }) => {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState(list)
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <GroupInfo
                setVisible={setShowModal}
                visible={showModal}
            />
            <View className='pb-0 w-80 '>
                <View className='flex-row justify-between'>
                    <Text className='pb-3 text-base'>
                        {title}
                    </Text>
                    <QuestionMarkCircleIcon size={30} fill={"black"}
                        onPress={(() => setShowModal(true))} />
                </View>
                <DropDownPicker
                    disableBorderRadius={true}
                    disabled= {!active}
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
                        setValue({ ...value, [name]: item.value })
                    }}

                    open={open}
                    setOpen={setOpen}

                    items={items}
                    setItems={setItems}
                    placeholder={""}
                />
            </View>
        </>
    )
}

export default DropdownGroup