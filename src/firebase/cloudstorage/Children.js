import { doc, getDoc, setDoc } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getDataGroup } from "./Groups";

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
  const childrenRef = doc(db, "Children", child_id);
  const docSnapshot = await getDoc(childrenRef);
  if (docSnapshot.exists()) {
    // Variable para almacenar la informacion del grupo
    let infroGroup = {}
    if (docSnapshot.data().lastGroupUID !== ""){

      infroGroup = await getDataGroup(docSnapshot.data().lastGroupUID)
    }
    return { ...docSnapshot.data(), ...infroGroup, userUID: child_id, }

  } else {
    return { noting: "nothing" }
  }
}


export const getDataChildren = async (child_ids) => {
  const child_info = await Promise.all(
    child_ids.map(async (ch_id) => {
      return await getDataChild(ch_id);
    })
  );

  return child_info;
};
