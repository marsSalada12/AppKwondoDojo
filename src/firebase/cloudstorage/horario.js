import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";


export const getAllhoras = async () => {
    const data = []
    const q = query(collection(db, "Default"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        doc.data().schedule.forEach((hora) => {
            data.push({ label: hora, value: hora })
            // console.log(hora)
        })
    });
    return data
}