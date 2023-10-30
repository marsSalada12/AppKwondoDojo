import { updateDoc } from 'firebase/firestore'

export const actualizarUID = async (datos, UID) => {
	await updateDoc(doc(db, "Usuarios", UID), { datos })
}
