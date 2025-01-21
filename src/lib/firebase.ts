// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZPjIfWu_Du7HHnejQg_k7N-1jOmlTUSo",
  authDomain: "dkriuk-d36b9.firebaseapp.com",
  projectId: "dkriuk-d36b9",
  storageBucket: "dkriuk-d36b9.firebasestorage.app",
  messagingSenderId: "1018753533124",
  appId: "1:1018753533124:web:65b9294bc7959987e17591",
  measurementId: "G-B1JJ107H4G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inisialisasi Firestore
const db = getFirestore(app);

export { db };
