import { doc, setDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "../firebase";

//funcion crear un usuario con el uid
export const createChildWUID = async(data, UID) => {
    await setDoc(doc(db, "Children", UID), {...data});
    return {...data, "userUID" : UID } 
}

//funcion crear un usuario con el uid
export const createChild = async(data) => {
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "Children"), {
      ...data
    });
    return docRef.id
}


