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

export const getType = async () => {
    const tyUser = []
    const q = query(collection(db, "Default"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        doc.data().type_user.forEach((tipo) => {
            tyUser.push({ label: tipo, value: tipo })
        })
    });
    return tyUser
}