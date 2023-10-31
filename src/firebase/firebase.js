// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCHhxER8im49hZnM5LsJCnR2hqua3QhTzQ",
  authDomain: "kwondojo-6f280.firebaseapp.com",
  projectId: "kwondojo-6f280",
  storageBucket: "kwondojo-6f280.appspot.com",
  messagingSenderId: "280117940453",
  appId: "1:280117940453:web:7cefb7190c475f2d60040c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
//export const auth = getAuth(app);

export const db = getFirestore(app);


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
