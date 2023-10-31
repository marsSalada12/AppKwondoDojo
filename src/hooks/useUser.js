import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { getAnOnlyUser } from '../firebase/cloudstorage/users';
import { getData } from '../Storage/storage';

const useUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // const unsub = onAuthStateChanged(auth, user => {
        //     if (user) {
        //         getAnOnlyUser(user.uid)
        //             .then((dataUser) => {
        //                 setUser({ ...dataUser, uid: user.uid })
        //             }).catch((e) => {
        //                 console.log('algo salio mal', e)
        //             })
        //     } else {
        //         setUser(null)
        //     }
        // })

        getData()
            .then((data) => {
                setUser(data)
            })
            .catch((error) => {
                setUser(null)
                console.log('Something went wrong ', error)
            })

        // return unsub

    }, [])
    return { user, setUser }
}



export default useUser