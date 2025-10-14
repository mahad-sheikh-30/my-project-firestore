
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAO-Aoy7JOhyBU8ZVmTJhi6gzZ7TeIbJDk",
  authDomain: "etech-firebase.firebaseapp.com",
  projectId: "etech-firebase",
  storageBucket: "etech-firebase.app", 
  messagingSenderId: "972625976589",
  appId: "1:972625976589:web:dcf25bb0a9fad4f4756444",
  measurementId: "G-12ZPDF1WFY"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
