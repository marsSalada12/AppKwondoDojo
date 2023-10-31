import AsyncStorage from '@react-native-async-storage/async-storage';


//Funcion para GUARDAR  informacion //Funcion para borrar la informacion guardada en el celular en el celular
export const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('my-key', jsonValue);
  } catch (e) {
    // saving error
  }
};


//Funcion para OBTENER la informacion guardada en el celular
export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('my-key');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};


//Funcion para borrar la informacion guardada en el celular
export const clearAll = async () => {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    return false;
  }
  return true;
}