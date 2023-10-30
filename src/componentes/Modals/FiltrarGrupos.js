import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback } from 'react-native'

const FiltrarGrupo = ({ visible, setVisible }) => {
    const [isCheckedAct, setCheckedAct] = useState(false);
    const [isCheckedDes, setCheckedDes] = useState(false);
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}>
            <TouchableWithoutFeedback
                onPress={() => setVisible(!visible)}>
                <View className='flex-1 bg-[#0000007D] items-center justify-center'>
                    <View className='bg-white rounded-xl w-80  items-center justify-center '>
                        <View className="flex-row px-5 py-5 w-72 ">
                            <Checkbox
                                value={isCheckedAct}
                                onValueChange={setCheckedAct}
                                color={isCheckedAct ? '#3E3D4F' : undefined}
                            />
                            <Text>Grupos activos</Text>
                        </View>
                        <View className="flex-row px-5 py-5 w-72 ">
                            <Checkbox
                                value={isCheckedDes}
                                onValueChange={setCheckedDes}
                                color={isCheckedDes ? '#3E3D4F' : undefined}
                            />
                            <Text>Grupos desactivados</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default FiltrarGrupo