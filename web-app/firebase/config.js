// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

// staging
const firebaseConfig = {
    apiKey: "AIzaSyCVM4ATMlidtjev2B7u0fB8bQhXnfOkSoI",
    authDomain: "tumai-space-staging.firebaseapp.com",
    projectId: "tumai-space-staging",
    storageBucket: "tumai-space-staging.appspot.com",
    messagingSenderId: "516645247811",
    appId: "1:516645247811:web:4d14368557a7e1ec132df6",
    measurementId: "G-ZNLMYF66DT"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;
