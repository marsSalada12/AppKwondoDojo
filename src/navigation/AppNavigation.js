import React from 'react'
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
import { auth } from '../firebase/firebase';
import Config from '../screens/admin/Config';
import useUser from '../hooks/useUser';

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
    return (
        <NavigationContainer>
            <Stack.Navigator>
            <Stack.Screen name="AddGroup" component={AddGroup} options={TabScreenOptions("Grupos")} />
            </Stack.Navigator>
        </NavigationContainer>)
}

export default AppNavigation

// const { user } = useUser()
//     if (user) {
//         if (user.type_user === 'Administrador') {
//             return (
//                 <NavigationContainer>
//                     <Stack.Navigator>
//                         < Stack.Screen name="TabBarAdmin" component={TabBarAdmin} options={{ headerShown: false }} />
//                         <Stack.Screen name="UsersAdmin" component={UsersAdmin} options={TabScreenOptions("Usuarios")} />
//                         <Stack.Screen name="AddUser" component={AddUser} options={TabScreenOptions("Usuario")} />
//                         <Stack.Screen name="AddGroup" component={AddGroup} options={TabScreenOptions("Grupos")} />
//                         <Stack.Screen name="Config" component={Config} options={TabScreenOptions("Configuracón")} />
//                     </Stack.Navigator>
//                 </NavigationContainer>
//             )
//         } else {
//             return (
//                 <NavigationContainer>
//                     <Stack.Navigator>
//                         < Stack.Screen name="TabBarUser" component={TabBarUser} options={{ headerShown: false }} />
//                     </Stack.Navigator>
//                 </NavigationContainer >
//             )
//         }
//     } else {
//         return (
//             <NavigationContainer>
//                 <Stack.Navigator>
//                     <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
//                     <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
//                     <Stack.Screen name="Enroll" component={Enroll} options={{ headerShown: false }} />
//                     <Stack.Screen name="RecoveryPass" component={RecoveryPass} options={{ headerShown: false }} />
//                 </Stack.Navigator>
//             </NavigationContainer>
//         )
//     }