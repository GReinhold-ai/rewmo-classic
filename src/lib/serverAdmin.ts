// src/lib/serverAdmin.ts
import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

const {
  FB_ADMIN_PROJECT_ID,
  FB_ADMIN_CLIENT_EMAIL,
  FB_ADMIN_PRIVATE_KEY,
} = process.env;

let adminApp: App | undefined;

function ensureAdminApp(): App {
  if (!adminApp) {
    if (!getApps().length) {
      adminApp = initializeApp({
        credential: cert({
          projectId: FB_ADMIN_PROJECT_ID,
          clientEmail: FB_ADMIN_CLIENT_EMAIL,
          // Vercel stores newlines escaped — unescape them:
          privateKey: (FB_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        }),
        projectId: FB_ADMIN_PROJECT_ID,
      });
    } else {
      adminApp = getApps()[0]!;
    }
  }
  return adminApp!;
}

export function getAdminDb(): Firestore {
  return getFirestore(ensureAdminApp());
}
