import {
    collection, addDoc,
    doc, setDoc,
    query, where,
    getDocs, getDoc,
    updateDoc
} from "firebase/firestore"
import { db } from "../firebase";

export const getAnOnlyUser = async (docId) => {
    const docRef = doc(db, "Usuarios", docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data()
    } else {
        console.log("No such document!");
    }
}