import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native'

const UsersInfo = ({ visible, setVisible }) => {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
    >
      <TouchableWithoutFeedback
        onPress={() => setVisible(!visible)}>
        <View className='flex-1 bg-[#0000007D] items-center justify-center'>
          <View className='bg-white rounded-xl w-80 items-center justify-center '>
            <Text className='text-base px-10 py-10 w-72 '>
              Usuario: {"\n"}Un usuario unico para manejar su informacion en la escuela
              {"\n\n"}Padre:{"\n"}
              Tutor que puede dar de alta a usuarios (hijos) y
              manejar su informacion enl la escuela
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default UsersInfo