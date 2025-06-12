// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZImniTRTHeRXk_OsKDeB_1FuMzDLEDgQ",
  authDomain: "portfolio-form-9e2c4.firebaseapp.com",
  projectId: "portfolio-form-9e2c4",
  storageBucket: "portfolio-form-9e2c4.firebasestorage.app",
  messagingSenderId: "366685401916",
  appId: "1:366685401916:web:10cc9da4e0531c9ac1e439"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
