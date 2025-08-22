import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFgS6-Wsxsi5RAqiaxVV55kdkzYStiuw0",
  authDomain: "arthurzikablaster.firebaseapp.com",
  projectId: "arthurzikablaster",
  storageBucket: "arthurzikablaster.firebasestorage.app",
  messagingSenderId: "787039775628",
  appId: "1:787039775628:web:1b5a49580a9cc25bb784a9",
  measurementId: "G-Q5JFZHC8HZ"
  };

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);