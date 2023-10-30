import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ChevronDownIcon } from 'react-native-heroicons/solid'

const DropdownBase = ({ list, name, setValue, value }) => {
    const [showSearch, setShowSearch] = useState(false)

    return (
        <>
            <View className='w-80 justify-between mt-4'>
                <Text className='pb-3 text-base'>
                    Maestro
                </Text>
                
            </View>
            <View className=" z-50 w-80 mt-50 mb-4">
                <TouchableOpacity
                    className="justify-between items-center bg-fondoInput rounded-lg p-3 flex-row "
                    onPress={() => setShowSearch(!showSearch)}>
                    <Text className="text-black text-base">
                        {value[name] === '' ? '' : value[name]}
                    </Text>
                    <ChevronDownIcon size='25' color='black' />
                </TouchableOpacity>

                {
                    showSearch ? (
                        <ScrollView 
                        className=" w-full bg-fondoInput top-1 rounded-lg shadow-sm z-30">
                            {
                                
                                list.map((type, index) => {
                                    let showBorder = index + 1 != list.length;
                                    let borderClass = showBorder ? ' border-b-2 border-white' : '';
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setValue({ ...value, [name]: type})
                                                setShowSearch(!showSearch)
                                            }}
                                            type={index}
                                            className={"items-start border-0 p-3 " + borderClass}>
                                            <Text className="text-black text-base ml-2 ">{type}</Text>
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

export default DropdownBase