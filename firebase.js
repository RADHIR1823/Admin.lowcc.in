// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdgoa5tORvgHd0mO8K5jNMzjb97dDCIQU",
  authDomain: "lowcc2494.firebaseapp.com",
  projectId: "lowcc2494",
  storageBucket: "lowcc2494.appspot.com",
  messagingSenderId: "291411894367",
  appId: "1:291411894367:web:2e56c5794fc3dd87763bea",
  measurementId: "G-QDMB18HE39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
