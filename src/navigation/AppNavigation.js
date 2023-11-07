import React, { useEffect, useLayoutEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from '../screens/main';
import SignIn from '../screens/SignIn';
import Enroll from '../screens/enroll';
import RecoveryPass from '../screens/recoveryPass';
import { TabBarAdmin, TabBarUser } from './navTopBar';
import AddUser from '../screens/admin/AddUser';
import UsersAdmin from '../screens/admin/UsersAdmin';
import AddGroup from '../screens/admin/AddGroup';
import Config from '../screens/admin/Config';
import { clearAll, getData } from '../Storage/storage';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import inscripcion from '../screens/user/inscripcion';
import Mensualidad from '../screens/user/mensualidad';

const TabScreenOptions = (title) => ({
    title: title,
    headerStyle: {
        backgroundColor: '#6560AA',
        height: 80,
    },
    headerTintColor: '#ffffff',
    headerTitleStyle: {
        fontWeight: 'normal',
        fontSize: 25
    },
});

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
    const [loading, setLoading] = useState(true)
    const [paginaInicial, setPaginaInicial] = useState('Main')

    useLayoutEffect(() => {
        setLoading(true)
        getData()
            .then((userData) => {
                console.log(userData, "---")
                if (!userData) {
                    setPaginaInicial('Main')
                }
                if (userData.type_user === 'Administrador') {
                    setPaginaInicial('TabBarAdmin')
                    console.log("entre admi")
                } else {
                    setPaginaInicial('TabBarUser')
                    console.log({ paginaInicial })
                    console.log("entre user")

                }

                setLoading(false)
            })
            .catch((error) => {
                setPaginaInicial('Main')
                setLoading(false)
                console.log('Error AppNavigation : ', error)
            })
    }, [])

    return (
        <>
            {
                loading
                    ? <View className='flex-1 bg-blue-600 items-center justify-center'>

                        <Progress.Circle
                            size={100}
                            borderWidth={4}

                            indeterminate={true} />

                        <Text className='mt-6 w-fit text-white text-xl'>
                            Cargando
                        </Text>
                        <TouchableOpacity
                            className='mt-6 bg-red px-5 py-2 rounded-lg'
                            onPress={async () => {
                                const data = await getData()
                                console.log(data)
                                await clearAll()
                            }}>
                            <Text
                                className='mt text-white text-xl'
                            >
                                Cerrar sesion
                            </Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <NavigationContainer >
                        <Stack.Navigator initialRouteName={paginaInicial} >
                            {/* Pantallas del login */}
                            <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
                            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                            <Stack.Screen name="Enroll" component={Enroll} options={{ headerShown: false }} />
                            <Stack.Screen name="RecoveryPass" component={RecoveryPass} options={{ headerShown: false }} />
                            {/* Pantalas del administrador */}
                            <Stack.Screen name="TabBarAdmin" component={TabBarAdmin} options={{ headerShown: false }} />
                            <Stack.Screen name="UsersAdmin" component={UsersAdmin} options={TabScreenOptions("Usuarios")} />
                            <Stack.Screen name="AddUser" component={AddUser} options={TabScreenOptions("Usuario")} />
                            <Stack.Screen name="AddGroup" component={AddGroup} options={TabScreenOptions("Grupos")} />
                            <Stack.Screen name="Config" component={Config} options={TabScreenOptions("Configuracón")} />
                            {/* Pantalas del usuario */}
                            < Stack.Screen name="TabBarUser" component={TabBarUser} options={{ headerShown: false }} />
                            <Stack.Screen name="Inscripcion" component={inscripcion} options={TabScreenOptions("Mensualidad")} />
                            <Stack.Screen name="Mensualidad" component={Mensualidad} options={TabScreenOptions("Confirmación")} />

                        </Stack.Navigator>
                    </NavigationContainer>
            }
        </>
    )
}

export default AppNavigation
