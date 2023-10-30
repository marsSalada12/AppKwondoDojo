import { collection, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const autenticar = async (datos) => {
    const gruposReference = doc(collection(db, "Groups"));
    await setDoc(gruposReference, datos);
    console.log("agreganding...")

    navigation.goBack()
}