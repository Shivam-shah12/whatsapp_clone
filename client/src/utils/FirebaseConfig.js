// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfsZsW6POgFHzI9gstAYyuMiyFCCsEJH8",
  authDomain: "whatsapp-clone-project-4e99f.firebaseapp.com",
  projectId: "whatsapp-clone-project-4e99f",
  storageBucket: "whatsapp-clone-project-4e99f.appspot.com",
  messagingSenderId: "736410898472",
  appId: "1:736410898472:web:2a584566459652ce52a51d",
  measurementId: "G-4TRWE876P9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth=getAuth(app);