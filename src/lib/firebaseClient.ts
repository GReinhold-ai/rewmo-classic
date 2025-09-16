// src/lib/firebaseClient.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  UserCredential,
} from "firebase/auth";
import {
  getFirestore,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

// ---------- Firebase (Client SDK) config ----------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ---------- Init (singleton-safe) ----------
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// ---------- Constants ----------
/** LocalStorage key where we stash ?ref=... from the landing page */
const REF_KEY = "rewmo_ref_code";

// ---------- Internal: ensure user profile doc ----------
async function ensureUserDoc(cred: UserCredential) {
  const user = cred.user;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // Only attach a referredBy value on first creation
    const referredBy =
      typeof window !== "undefined" ? localStorage.getItem(REF_KEY) || null : null;

    await setDoc(ref, {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      referralCode: user.uid, // default referral code
      referredBy,             // may be null
      referralCount: 0,
      rewards: 0,
    });
  } else {
    // Update last login timestamp on subsequent logins
    await setDoc(
      ref,
      { lastLoginAt: serverTimestamp() },
      { merge: true }
    );
  }
}

// ---------- Auth helpers ----------

// Google sign-in
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  await setPersistence(auth, browserLocalPersistence);
  const cred = await signInWithPopup(auth, provider);
  await ensureUserDoc(cred);
  return cred;
}

// Email sign-up
export async function signUpWithEmail(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(cred);
  return cred;
}

// Email sign-in
export async function signInWithEmail(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(cred);
  return cred;
}

// Password reset
export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

// Sign out
export function signOutUser() {
  return signOut(auth);
}
