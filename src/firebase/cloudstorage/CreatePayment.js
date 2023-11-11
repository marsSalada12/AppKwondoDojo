import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const createPayWUID = async(data, UID) => {
    await setDoc(doc(db, "Payments", UID), {...data});
    return {...data, "payment_id" : UID }
}