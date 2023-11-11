import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PaymentsScreen from '../screens/user/Payments_Screen';
import HomeScreen from '../screens/user/Home_Screen';
import ProfileScreen from '../screens/user/Profile_Screen';

import { HomeIcon as HomeSolid, UserIcon as UserSolid, UserGroupIcon, CreditCardIcon } from 'react-native-heroicons/solid';
import Home_admin from '../screens/admin/Home_admin';
import Groups from '../screens/admin/Groups';
import UsersAdmin from '../screens/admin/UsersAdmin';


const Tab = createBottomTabNavigator();

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

const TabNavigatorOptions = ({ route }) => ({
    tabBarShowLabel: false,
    tabBarIcon: ({ focused, color, size }) => menuIcos(route, focused),
    tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
        height: 90
    }
})


export const TabBarUser = () => {
    return (
        <Tab.Navigator
            initialRouteName='HomeU'
            screenOptions={TabNavigatorOptions}>

            <Tab.Screen
                name="Payments"
                component={PaymentsScreen}
                options={TabScreenOptions('Payments')} />

            <Tab.Screen
                name="HomeU"
                component={HomeScreen}
                options={TabScreenOptions('Home')} />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={TabScreenOptions('Profile')} />
        </Tab.Navigator>
    );
}

export const TabBarAdmin = () => {
    return (
        <Tab.Navigator
            initialRouteName='HomeA'
            screenOptions={TabNavigatorOptions}>

            <Tab.Screen
            
                name="Groups"
                component={Groups}
                options={TabScreenOptions('Grupos')} />

            <Tab.Screen
                name="HomeA"
                component={Home_admin}
                options={TabScreenOptions('Inicio')} />

            <Tab.Screen
                name="Add"
                component={UsersAdmin}
                options={TabScreenOptions('Usuarios')} />
        </Tab.Navigator>
    );
}


const menuIcos = (route, focused) => {
    let icon;
    if (route.name == 'HomeU') {
        icon = <HomeSolid size={40} fill={focused ? '#FFFFFF' : '#3E3D4F'} />
    } else if (route.name == 'HomeA') {
        icon = <HomeSolid size={40} fill={focused ? '#FFFFFF' : '#3E3D4F'} />
    } else if (route.name == 'Groups') {
        icon = <UserGroupIcon size={30} fill={focused ? 'white' : '#3E3D4F'} />
    } else if (route.name == 'Add') {
        icon = <UserSolid size={30} fill={focused ? 'white' : '#3E3D4F'} />
    } else if (route.name == 'Payments') {
        icon = <CreditCardIcon size={30} fill={focused ? 'white' : '#3E3D4F'} />
    } else if (route.name == 'Profile') {
        icon = <UserSolid size={30} fill={focused ? 'white' : '#3E3D4F'} />
    }

    let buttonClass = focused ? " bg-[#6560AA] " : ""
    return (
        <View className={'flex items-center rounded-full p-6' + buttonClass}>
            {icon}
        </View>
    )
}