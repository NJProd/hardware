// Firebase Configuration for Katz ACE Hardware
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAi50zLxJWhDcGLP7Uu-hww0A-fuLrEqjI",
  authDomain: "katz-ace-hardware.firebaseapp.com",
  projectId: "katz-ace-hardware",
  storageBucket: "katz-ace-hardware.firebasestorage.app",
  messagingSenderId: "531436214836",
  appId: "1:531436214836:web:f68ca933fa15af8a390861"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
