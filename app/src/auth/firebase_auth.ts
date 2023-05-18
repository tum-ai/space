// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDzvLalrCrtzp5gB3KGB2aH6j9EaD8Su5E",
    authDomain: "tumai-space.firebaseapp.com",
    projectId: "tumai-space",
    storageBucket: "tumai-space.appspot.com",
    messagingSenderId: "593770252428",
    appId: "1:593770252428:web:6f89e79ee9f052111493a9",
    measurementId: "G-YD0J0DVV7D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);


const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        console.log(user)
    } catch (err) {
        console.error(err);
    }
};

const logInWithEmailAndPassword = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
    }
};

const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
    } catch (err) {
        console.error(err);
    }
};

const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
    }
};

const logout = () => {
    signOut(auth);
};

export {
    auth,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
};

// TODO: error handling: user does not exist, wrong pw, ...
