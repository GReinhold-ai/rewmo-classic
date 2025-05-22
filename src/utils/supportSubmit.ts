// src/utils/supportSubmit.ts
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebaseClient"; // path to your initialized Firestore

export async function submitSupportMessage({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  return addDoc(collection(db, "supportMessages"), {
    name,
    email,
    message,
    createdAt: serverTimestamp(),
  });
}
