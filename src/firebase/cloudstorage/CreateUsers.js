import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

//funcion crear un usuario con el uid
export const createUserWUID = async(data, UID) => {
    await setDoc(doc(db, "Usuarios", UID), {...data});
    console.log(data.password , "create")
    return {...data, "userUID" : UID }
}