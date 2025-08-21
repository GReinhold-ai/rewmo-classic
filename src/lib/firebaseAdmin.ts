import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export function getDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FB_ADMIN_PROJECT_ID!,
        clientEmail: process.env.FB_ADMIN_CLIENT_EMAIL!,
        privateKey: (process.env.FB_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}
