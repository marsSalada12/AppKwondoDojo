import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

//Funcion para traerse la informacion de un pago
export const getDataGroup = async (id_group) => {
    const groupRef = doc(db, "Groups", id_group);
    const docSnapshot = await getDoc(groupRef);
    if (docSnapshot.exists()) {
        return { ...docSnapshot.data(), group_id: id_group }
    } else {
        return { noting: "noth" }
    }
}