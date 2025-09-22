// src/lib/firebaseAdmin.ts
import * as admin from "firebase-admin";

/**
 * Credential resolution order:
 * 1) FIREBASE_SERVICE_ACCOUNT_BASE64 or FIREBASE_SERVICE_ACCOUNT (Base64 JSON)
 * 2) FB_ADMIN_* plain envs (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY)
 * 3) GOOGLE_APPLICATION_CREDENTIALS / application default credentials
 *
 * Also supports STORAGE via FIREBASE_STORAGE_BUCKET.
 * Module is hot-reload safe.
 */

let adminApp: admin.app.App | null = null;

function coercePrivateKey(pk?: string | null) {
  if (!pk) return pk as any;
  return pk.replace(/\\n/g, "\n");
}

function decodeBase64Json(b64?: string | null) {
  if (!b64) return null;
  try {
    const jsonStr = Buffer.from(b64, "base64").toString("utf8");
    const parsed = JSON.parse(jsonStr);
    if (parsed.private_key) parsed.private_key = coercePrivateKey(parsed.private_key);
    return parsed as admin.ServiceAccount;
  } catch {
    return null;
  }
}

function buildCredential(): admin.credential.Credential {
  const b64 =
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ||
    process.env.FIREBASE_SERVICE_ACCOUNT;
  const svcFromB64 = decodeBase64Json(b64);
  if (svcFromB64) return admin.credential.cert(svcFromB64);

  const projectId = process.env.FB_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FB_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = coercePrivateKey(
    process.env.FB_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY
  );
  if (projectId && clientEmail && privateKey) {
    return admin.credential.cert({ projectId, clientEmail, privateKey });
  }

  try {
    return admin.credential.applicationDefault();
  } catch (err: any) {
    throw new Error(
      "No Firebase Admin credentials found.\n" +
        "Provide ONE of the following:\n" +
        "  - FIREBASE_SERVICE_ACCOUNT_BASE64 (base64 of service-account JSON), or\n" +
        "  - FB_ADMIN_PROJECT_ID / FB_ADMIN_CLIENT_EMAIL / FB_ADMIN_PRIVATE_KEY, or\n" +
        "  - GOOGLE_APPLICATION_CREDENTIALS pointing to the JSON file.\n" +
        `Original error: ${err?.message || err}`
    );
  }
}

export function getAdminApp(): admin.app.App {
  if (adminApp) return adminApp;
  if (admin.apps.length) {
    adminApp = admin.app();
    return adminApp;
  }
  const credential = buildCredential();
  const storageBucket =
    process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  adminApp = admin.initializeApp({
    credential,
    ...(storageBucket ? { storageBucket } : {}),
  });
  return adminApp;
}

export function getAdminDb(): admin.firestore.Firestore {
  return getAdminApp().firestore();
}

export function getAdminAuth(): admin.auth.Auth {
  return getAdminApp().auth();
}

export function getAdminStorage(): admin.storage.Storage {
  // firebase-admin v11+: getStorage() off admin, not off app
  return admin.storage();
}

// Back-compat alias for older imports expecting { getDb }
export const getDb = getAdminDb;
