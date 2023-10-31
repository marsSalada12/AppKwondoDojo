import { View, Text, Modal, TouchableWithoutFeedback } from 'react-native'

const ModalError = ({ visible, setVisible, message }) => {

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}>
                
            <TouchableWithoutFeedback
                onPress={() => setVisible(!visible)}>
                <View className='flex-1 bg-[#0000007D] items-center justify-center'>
                    <View className='bg-white rounded-xl w-80 items-center justify-center '>
                        <Text className='text-base px-10 py-10 w-72 '>
                            {message}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default ModalError