import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback } from 'react-native'

const FiltrarGrupo = ({ filtro, setFiltro, visible, setVisible }) => {
    const [isCheckedAct, setCheckedAct] = useState(filtro[0]);
    const [isCheckedDes, setCheckedDes] = useState(!filtro[1]);

    useEffect(()=>{
        setFiltro([isCheckedAct, !isCheckedDes])
    },[visible, isCheckedAct, isCheckedDes])


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
                                value={isCheckedAct}
                                onValueChange={(check) => {
                                    setCheckedAct(check)
                                    // handleGroups('activos', check)
                                }}
                                color={isCheckedAct ? '#3E3D4F' : undefined}
                            />
                            <Text className='ml-3'>
                                Grupos activos
                            </Text>
                        </View>
                        <View className="flex-row mt-5 ">
                            <Checkbox
                                value={isCheckedDes}
                                onValueChange={(check) => {
                                    setCheckedDes(check)
                                }}
                                color={isCheckedDes ? '#3E3D4F' : undefined}
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

export default FiltrarGrupo;
