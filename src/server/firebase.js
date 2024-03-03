const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getDatabase } = require('firebase/database');
const { getFirestore } = require('firebase/firestore/lite');

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyA1yGqCpXLPXwJqHRbftgmXWWcydJMI2Lg",
    authDomain: "dots-41c5f.firebaseapp.com",
    databaseURL: "https://dots-41c5f-default-rtdb.firebaseio.com",
    projectId: "dots-41c5f",
    storageBucket: "dots-41c5f.appspot.com",
    messagingSenderId: "1098098293300",
    appId: "1:1098098293300:web:f508d984442b3800476861",
    measurementId: "G-GH2Y0YWH2X"
};

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Firebase service account key file

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://dots-41c5f-default-rtdb.firebaseio.com'
});

firebaseAdmin = admin.firestore();

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const database = getDatabase(firebase);
const firestore = getFirestore(firebase);
//const reference = ref(database, 'users/', userID);

module.exports = { firebase, auth, database, firebaseAdmin };