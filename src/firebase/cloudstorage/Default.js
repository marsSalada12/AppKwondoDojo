import {
    collection, addDoc,
    doc, setDoc,
    query, where,
    getDocs, getDoc,
    updateDoc
} from "firebase/firestore"
import { db } from "../firebase";

Default_ID = 'yUIGazmtjPuxXwZroekk'

// Metodo para obtener todos los tipos de usuarios
export const getAllTypeUsers = async () => {
    const tipos = []
    const docRef = doc(db, "Default", Default_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        docSnap.data().tipo_usuarios.forEach(element => {
            tipos.push({ label: element, value: element })
        });
    } else {
        console.log("No such document!");
    }
    return tipos
}