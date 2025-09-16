// src/pages/api/_firebaseAdmin.ts
import * as admin from "firebase-admin";

/**
 * Credential resolution order:
 * 1) GOOGLE_APPLICATION_CREDENTIALS => applicationDefault()
 * 2) FIREBASE_SERVICE_ACCOUNT (Base64 JSON) => admin.credential.cert()
 * 3) Fallback to applicationDefault() (GCP metadata, etc.)
 *
 * In local dev, the easiest is GOOGLE_APPLICATION_CREDENTIALS=full\path\to\serviceAccount.json
 * In hosted envs (Vercel/Netlify), use FIREBASE_SERVICE_ACCOUNT as a Base64-encoded JSON string.
 */

let adminApp: admin.app.App | null = null;

function buildCredential(): admin.credential.Credential {
  const gac = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT;

  // 1) Prefer GOOGLE_APPLICATION_CREDENTIALS for local dev
  if (gac && gac.trim().length > 0) {
    return admin.credential.applicationDefault();
  }

  // 2) Base64 service account JSON (for hosted envs)
  if (b64 && b64.trim().length > 0) {
    const jsonStr = Buffer.from(b64, "base64").toString("utf8");
    const json = JSON.parse(jsonStr);
    return admin.credential.cert(json);
  }

  // 3) Fallback to ADC (e.g., GCP metadata)
  return admin.credential.applicationDefault();
}

export function getAdminApp(): admin.app.App {
  if (adminApp) return adminApp;
  if (admin.apps.length > 0) {
    adminApp = admin.app();
    return adminApp;
  }
  const credential = buildCredential();
  adminApp = admin.initializeApp({ credential });
  return adminApp;
}

export function getAdminDb(): admin.firestore.Firestore {
  return getAdminApp().firestore();
}

export function getAdminAuth(): admin.auth.Auth {
  return getAdminApp().auth();
}
