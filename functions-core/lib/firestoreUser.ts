// src/lib/firestoreUser.ts
import { db } from "@/lib/firebaseClient"; // adjust path if needed
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export async function ensureUserInFirestore(user: any) {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
      // Add any custom fields you need here
    });
  }
}
