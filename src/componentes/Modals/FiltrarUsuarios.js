import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback } from 'react-native'

const FiltrarUsuarios = ({ filtro, setFiltro, visible, setVisible }) => {
    const [activos, setActivos] = useState(filtro[0]);
    const [desactivos, setDesactivos] = useState(!filtro[1]);

    useEffect(()=>{
        setFiltro([activos, !desactivos])
    },[visible, activos, desactivos])


    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}>
            <TouchableWithoutFeedback
                onPress={() => setVisible(!visible)}>
                <View className='flex-1 bg-[#0000007D] items-center justify-center'>
                    <View className='bg-white rounded-xl w-80  items-start justify-center p-10 '>
                        <View className="flex-row ">
                            <Checkbox
                                value={activos}
                                onValueChange={(check) => {
                                    setActivos(check)
                                    // handleGroups('activos', check)
                                }}
                                color={activos ? '#3E3D4F' : undefined}
                            />
                            <Text className='ml-3'>
                                Grupos activos
                            </Text>
                        </View>
                        <View className="flex-row mt-5 ">
                            <Checkbox
                                value={desactivos}
                                onValueChange={(check) => {
                                    setDesactivos(check)
                                }}
                                color={desactivos ? '#3E3D4F' : undefined}
                            />
                            <Text className='ml-3'>
                                Grupos desactivados
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default FiltrarUsuarios;
