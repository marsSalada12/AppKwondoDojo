import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const createPaymentWUID = async (data, UID) => {
    await setDoc(doc(db, "Payments", UID), { ...data });
    return { ...data, "payment_id": UID }
}

//funcion crear un usuario con el uid
export const createPayment = async (data) => {
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "Payments"), {
        ...data
    });
    return docRef.id
}


//Funcion para traerse la informacion de un pago
export const getDataPayment = async (pay_id) => {
    const payRef = doc(db, "Payments", pay_id);
    const docSnapshot = await getDoc(payRef);
    if (docSnapshot.exists()) {
        return { ...docSnapshot.data(), pay_id: pay_id }
    } else {
        return { noting: "nothing" }
    }
}

