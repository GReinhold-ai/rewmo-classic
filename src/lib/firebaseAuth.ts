// src/lib/firebaseAuth.ts

import { auth } from "./firebaseClient";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Use popup for web, you may need to adjust for SSR/Node
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    // User is now signed in (onAuthStateChanged will fire)
  } catch (error) {
    // Optionally handle errors here
    console.error("Google sign-in error:", error);
    throw error;
  }
}
