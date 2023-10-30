import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { getAnOnlyUser } from '../firebase/cloudstorage/users';
import { getData } from '../Storage/storage';

const useUser = () => {
    const [user, setUser] = useState(null);

    const getInfo = () => {
        if (user) {
            getData()
                .then((value) => {
                    setUser(value)
                    
                })
                .catch(
                    () => {
                        setUser(null)
                    }
                )
        } else {
            setUser(null)
        }

    }

    useEffect(() => {
        getInfo();
    }, [])
    return { user }
}


// const unsub = onAuthStateChanged(auth, user => {
//     if (user) {
//         getAnOnlyUser(user.uid)
//             .then((dataUser) => {
//                 setUser({ ...dataUser, uid: user.uid })
//             }).catch((e) => { console.log('algo salio mal', e) })
//     } else {
//         setUser(null)
//     }
// })

export default useUser