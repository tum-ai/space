import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { environment_name } from "../config/environment";

const firebaseConfigProd = {
  apiKey: "AIzaSyDzvLalrCrtzp5gB3KGB2aH6j9EaD8Su5E",
  authDomain: "tumai-space.firebaseapp.com",
  projectId: "tumai-space",
  storageBucket: "tumai-space.appspot.com",
  messagingSenderId: "593770252428",
  appId: "1:593770252428:web:6f89e79ee9f052111493a9",
  measurementId: "G-YD0J0DVV7D",
};

const firebaseConfigStaging = {
  apiKey: "AIzaSyCVM4ATMlidtjev2B7u0fB8bQhXnfOkSoI",
  authDomain: "tumai-space-staging.firebaseapp.com",
  projectId: "tumai-space-staging",
  storageBucket: "tumai-space-staging.appspot.com",
  messagingSenderId: "516645247811",
  appId: "1:516645247811:web:4d14368557a7e1ec132df6",
  measurementId: "G-ZNLMYF66DT",
};

var firebaseConfig;
if (environment_name === "production") {
  firebaseConfig = firebaseConfigProd;
  // TODO: staging
} else {
  firebaseConfig = firebaseConfigStaging;
  // throw new Error(`Invalid environment: ${environment_name}`);
}

console.log("Env: ", environment_name);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
