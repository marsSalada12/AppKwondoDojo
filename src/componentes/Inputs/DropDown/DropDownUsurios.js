import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ChevronDownIcon, QuestionMarkCircleIcon } from 'react-native-heroicons/solid'
import UsersInfo from '../../Modals/UsersInfo'


const DropdownUsuarios = ({ list, name, setValue, value }) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [showSearch, setShowSearch] = useState(false)

    return (
        <>
            <UsersInfo
                setVisible={setIsModalVisible}
                visible={isModalVisible}
            />
            
            
            

            <View className='flex flex-row w-80 justify-between'>
                <Text className='pb-3 text-base'>
                    Tipo de usuario
                </Text>
                <QuestionMarkCircleIcon
                    size={35} fill="#6560AA"
                    onPress={() => setIsModalVisible(true)} />
            </View>
            <View className="relative z-50 w-80 mt-50 mb-4">
                <TouchableOpacity
                    className="justify-between items-center bg-backInput rounded-lg p-3 flex-row"
                    onPress={() => setShowSearch(!showSearch)}>
                    <Text className="text-black text-base">
                        {value[name] === '' ? '' : value[name]}
                    </Text>
                    <ChevronDownIcon size='25' color='black' />
                </TouchableOpacity>


                {
                    showSearch ? (
                        <View className=" w-full bg-backInput top-14 rounded-lg shadow-sm">
                            {
                                list.map((type, index) => {
                                    let showBorder = index + 1 != list.length;
                                    let borderClass = showBorder ? ' border-b-2 border-white' : '';
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setValue({ ...value, [name]: type.name })
                                                setShowSearch(!showSearch)
                                            }}
                                            key={index}
                                            className={"items-start border-0 p-3 " + borderClass}>
                                            <Text className="text-black text-base ml-2 ">{type.name}</Text>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </View>
                    ) : null
                }
            </View>
        </>
    )
}

export default DropdownUsuarios