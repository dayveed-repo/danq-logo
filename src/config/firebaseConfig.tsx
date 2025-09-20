import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "clone-aed47.firebaseapp.com",
  databaseURL: "https://clone-aed47.firebaseio.com",
  projectId: "clone-aed47",
  storageBucket: "clone-aed47.appspot.com",
  messagingSenderId: "360731163578",
  appId: "1:360731163578:web:31f2b56c810d074cc57b83",
  measurementId: "G-E4DZY81FZS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // db

// firebase storage
export const storageBucket = getStorage(app);
