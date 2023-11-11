import { View, Text, Modal } from 'react-native'
import * as Progress from 'react-native-progress';

const ModalLoading = ({ visible=true }) => {

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}>

            <View
                className='flex flex-1 items-center justify-center bg-[#00000052]'>
                <Progress.Circle
                    size={100}
                    borderWidth={4}
                    indeterminate={true} />
            </View>
        </Modal>
    );
}

export default ModalLoading