import { doc, getDoc, setDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getDataGroup } from "./Groups";
import { getDataPayment } from "./CreatePayment";
import { diasRestantes } from "../../componentes/fechas";

//funcion crear un usuario con el uid
export const createChildWUID = async (data, UID) => {
    await setDoc(doc(db, "Children", UID), { ...data });
    return { ...data, "userUID": UID }
}

//funcion crear un usuario con el uid
export const createChild = async (data) => {
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "Children"), {
        ...data
    });
    return docRef.id
}


//Funcion para traerse la informacion de un niño
export const getDataChild = async (child_id) => {
    try {
        const childrenRef = doc(db, "Children", child_id);
        const docSnapshot = await getDoc(childrenRef);
        // Variable para almacenar la informacion del grupo
        if (docSnapshot.data().status === true) {
            let infroGroup = {}
            if (docSnapshot.data().lastGroupUID) {
                infroGroup = await getDataGroup(docSnapshot.data().lastGroupUID)
            }

            let paymentID = ''
            let lastPaymentInfo = {}
            if (docSnapshot.data().payments_id.length > 0) {
                paymentID = docSnapshot.data().payments_id[docSnapshot.data().payments_id.length - 1]
                lastPaymentInfo = await getDataPayment(paymentID)
                const restantes = diasRestantes(lastPaymentInfo.end_mensulidad_date)

                lastPaymentInfo = { ...lastPaymentInfo, end_mensulidad_days: restantes }
            }

            return { ...docSnapshot.data(), ...infroGroup, ...lastPaymentInfo, userUID: child_id }
        } else {
            // Si el campo status no es true, puedes retornar null o un valor indicativo.
            return { nothing: "nothing" };
        }
    } catch (error) {
        return { noting: "nothing" }
    }

}


// Funcion para iterar sobre los IDs de los hijos y retorna la informacion
/**
 * 
 * @param {[]} child_ids 
 * @returns informacino de los hijos
 */
export const getDataChildren = async (child_ids) => {
    const child_info = await Promise.all(
        child_ids.map(async (ch_id) => {
            return await getDataChild(ch_id);
        })
    );

    return child_info;
};
