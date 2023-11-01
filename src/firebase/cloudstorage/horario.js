import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

///No pude cambiarle el nombre a este archivo lo queria llamar usuarios
//No le movi a nada a este metodo pero ya no me muestra las horas
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
//Para que me traiga los grupos, si me lo muestra
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
// este me muestra a los maestros para el combobotz, como no es array cambio jijji
export const maestrosFun = async () => {
    const maestros = [];
    const que = query(collection(db, "Usuarios"), where("type_user", "==", "Maestro"), where("status", "==", true));
    const querySnapshot = await getDocs(que);
    querySnapshot.forEach((doc) => {
        const fullName = doc.data().name_user + ' ' + doc.data().pattern_name + ' ' + doc.data().matern_name
        maestros.push({ label: fullName, value: fullName });
    });
    return maestros;
};


