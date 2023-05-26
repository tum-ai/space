import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyATGl55giRKlj8A_67eOJ4HcVMTGsqKbnM",
  authDomain: "agy-auth.firebaseapp.com",
  projectId: "agy-auth",
  storageBucket: "agy-auth.appspot.com",
  messagingSenderId: "515696964419",
  appId: "1:515696964419:web:b7d04882f22aa8fbe275f6"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth()