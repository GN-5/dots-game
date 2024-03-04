import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyA1yGqCpXLPXwJqHRbftgmXWWcydJMI2Lg",
    authDomain: "dots-41c5f.firebaseapp.com",
    databaseURL: "https://dots-41c5f-default-rtdb.firebaseio.com",
    projectId: "dots-41c5f",
    storageBucket: "dots-41c5f.appspot.com",
    messagingSenderId: "1098098293300",
    appId: "1:1098098293300:web:f508d984442b3800476861",
    measurementId: "G-GH2Y0YWH2X",
};


const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const database = getDatabase(firebase);

export { firebase, auth, database };