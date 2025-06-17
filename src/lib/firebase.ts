// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase project’s config values
const firebaseConfig = {
  apiKey: "AIzaSyC3G_b8h3mcjrBD9oU1veDX03Mp3Jn4uYo",
  authDomain: "rewmoai.firebaseapp.com",
  projectId: "rewmoai",
  storageBucket: "rewmoai.appspot.com",        // <-- typo fixed here!
  messagingSenderId: "1006457256424",
  appId: "1:1006457256424:web:d674a57e19969845c60c5d",
  // measurementId is not needed unless using Analytics
};

// Initialize Firebase App (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
