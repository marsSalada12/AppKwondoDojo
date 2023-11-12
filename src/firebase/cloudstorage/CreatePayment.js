import { addDoc, collection, doc, setDoc } from "firebase/firestore";
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