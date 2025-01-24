// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBz4InupKVrvZyU1A2iRC3xZTZQseU03zk",
  authDomain: "rejection-hub.firebaseapp.com",
  projectId: "rejection-hub",
  storageBucket: "rejection-hub.firebasestorage.app",
  messagingSenderId: "987903091183",
  appId: "1:987903091183:web:1a67c553e1992d4cf6161a",
  measurementId: "G-THWG9L903D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };