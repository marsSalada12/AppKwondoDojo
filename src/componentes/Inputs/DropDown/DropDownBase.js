import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ChevronDownIcon } from 'react-native-heroicons/solid'



const DropdownBase = ({ list, title, name, setValue, value }) => {
    const [showSearch, setShowSearch] = useState(false)

    return (
        <>
            <View className='w-80 justify-between'>
                <Text className='pb-3 text-base'>
                    {title}
                </Text>
                
            </View>
            <View className={"relative z-10 w-52 mt-50 mb-4"}>
                <TouchableOpacity
                    className="justify-between items-center bg-fondoInput rounded-lg p-3 flex-row "
                    onPress={() => setShowSearch(!showSearch)}>
                    <Text className="text-black w-40 text-base">
                        {value[name] === '' ? '' : value[name]}
                    </Text>
                    <ChevronDownIcon size='25' color='black' />
                </TouchableOpacity>


                {
                    showSearch ? (
                        <ScrollView className=" -z-50 w-52 bg-fondoInput top-1 rounded-lg shadow-sm">
                                <View className="flex flex-1" >
                                    {
                                        Object.keys(list[0]).map((key, index) => {
                                            let showBorder = index + 1 != Object.keys(list[0]).length;
                                            let borderClass = showBorder ? ' border-b-2 border-white' : '';
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setValue({ ...value, [name]: list[0][key]  })
                                                        setShowSearch(!showSearch)
                                                    }}
                                                    key={index}
                                                    className={"items-start border-0 p-3 " + borderClass}>
                                                    <Text className="text-black text-base ml-2 w-full">{list[0][key]}</Text>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                </View>
                            
                        </ScrollView>
                    ) : null
                }
            </View>
        </>
    )
}

export default DropdownBase