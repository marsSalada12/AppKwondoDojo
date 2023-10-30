import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ChevronDownIcon, QuestionMarkCircleIcon } from 'react-native-heroicons/solid'
import GroupInfo from '../../Modals/GroupInfo'


const DropdownGroups = ({ list, name, setValue, value }) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [showSearch, setShowSearch] = useState(false)

    return (
        <>
            <GroupInfo
                setVisible={setIsModalVisible}
                visible={isModalVisible}
            />

            <View className='flex flex-row w-80 justify-between'>
                <Text className='pb-3 text-base'>
                    Grupos
                </Text>
                <QuestionMarkCircleIcon
                    size={35} fill="#6560AA"
                    onPress={() => setIsModalVisible(true)} />
            </View>
            <View className="relative z-50 w-80 mt-50 mb-4">
                <TouchableOpacity
                    className="justify-between items-center bg-fondoInput rounded-lg p-3 flex-row"
                    onPress={() => setShowSearch(!showSearch)}>
                    <Text className="text-black text-base">
                        {value[name] === '' ? '' : value[name]}
                    </Text>
                    <ChevronDownIcon size='25' color='black' />
                </TouchableOpacity>


                {
                    showSearch ? (
                        <ScrollView className="w-full bg-fondoInput top-1 rounded-lg shadow-sm">
                            {
                                Object.keys(list[0]).map((key, index) => {
                                    let showBorder = index + 1 != Object.keys(list[0]).length;
                                    let borderClass = showBorder ? ' border-b-2 border-white' : '';
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setValue({ ...value, [name]: list[0][key] })
                                                setShowSearch(!showSearch)
                                            }}
                                            key={index}
                                            className={"items-start border-0 p-3 " + borderClass}>
                                            <Text className="text-black text-base ml-2 ">
                                                {list[0][key]}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </ScrollView>
                    ) : null
                }
            </View>
        </>
    )
}

export default DropdownGroups