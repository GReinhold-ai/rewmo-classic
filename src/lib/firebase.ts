export {}; // ✅ Ensures TypeScript treats this as a module

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3G_b8h3mcjrBD9oU1veDX03Mp3Jn4uYo",
  authDomain: "rewmoai.firebaseapp.com",
  projectId: "rewmoai",
  storageBucket: "rewmoai.appspot.com",
  messagingSenderId: "1006457256424",
  appId: "1:1006457256424:web:d674a57e19969845c60c5d",
  measurementId: "G-RWYF3HYL79"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };
