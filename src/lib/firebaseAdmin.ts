import * as admin from "firebase-admin";

/**
 * Credential resolution order:
 * 1) FIREBASE_SERVICE_ACCOUNT_BASE64 or FIREBASE_SERVICE_ACCOUNT (Base64 JSON)
 * 2) FB_ADMIN_* plain envs (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY)
 * 3) GOOGLE_APPLICATION_CREDENTIALS / application default credentials
 *
 * Notes:
 * - PRIVATE_KEY often needs \n -> real newlines.
 * - Module is hot-reload safe.
 */

let adminApp: admin.app.App | null = null;

function coercePrivateKey(pk?: string | null) {
  if (!pk) return pk;
  // Handle env-inlined keys like "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
  return pk.replace(/\\n/g, "\n");
}

function decodeBase64Json(b64?: string | null) {
  if (!b64) return null;
  try {
    const jsonStr = Buffer.from(b64, "base64").toString("utf8");
    const parsed = JSON.parse(jsonStr);
    // Normalize private_key just in case
    if (parsed.private_key) parsed.private_key = coercePrivateKey(parsed.private_key);
    return parsed as admin.ServiceAccount;
  } catch {
    return null;
  }
}

function buildCredential(): admin.credential.Credential {
  // 1) Base64 service account JSON (supports both variable names)
  const b64 =
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ||
    process.env.FIREBASE_SERVICE_ACCOUNT;
  const svcFromB64 = decodeBase64Json(b64);
  if (svcFromB64) {
    return admin.credential.cert(svcFromB64);
  }

  // 2) Plain envs (FB_ADMIN_*)
  const projectId = process.env.FB_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FB_ADMIN_CLIENT_EMAIL;
  const privateKey = coercePrivateKey(process.env.FB_ADMIN_PRIVATE_KEY);
  if (projectId && clientEmail && privateKey) {
    return admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    });
  }

  // 3) GOOGLE_APPLICATION_CREDENTIALS / ADC
  // (reads JSON from a file if GOOGLE_APPLICATION_CREDENTIALS is set,
  //  or uses GCP metadata when running on GCP)
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
  adminApp = admin.initializeApp({ credential });
  return adminApp;
}

export function getAdminDb(): admin.firestore.Firestore {
  return getAdminApp().firestore();
}

export function getAdminAuth(): admin.auth.Auth {
  return getAdminApp().auth();
}
