import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";


export const getAllhoras = async () => {
    const data = []
    const q = query(collection(db, "Default"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        doc.data().schedule.forEach((hora) => {
            data.push({ label: hora, value: hora })
        })
    });
    return data
}

export const gruposFun = async () => {
    const grupos = []
    const qu = query(collection(db, "Default"));
    const querySnapshot = await getDocs(qu);
    querySnapshot.forEach((doc) => {
        doc.data().type_groups.forEach((grupo) => {
            grupos.push({ label: grupo, value: grupo })
        })
    });
    return grupos
}

export const maestrosFun = async () => {
    const maestros = [];
    const que = query(collection(db, "Usuarios"), where("type_user", "==", "Maestro"));
    const querySnapshot = await getDocs(que);
    querySnapshot.forEach((doc) => {
        maestros.push({ label: doc.data().name_user, value: doc.data().name_user });
    });
    return maestros;
};


