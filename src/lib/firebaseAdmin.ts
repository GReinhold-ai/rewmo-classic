// src/lib/firebaseAdmin.ts
import * as admin from "firebase-admin";

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
  // Try base64 encoded service account first
  const b64 =
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ||
    process.env.FIREBASE_SERVICE_ACCOUNT;
  const svcFromB64 = decodeBase64Json(b64);
  if (svcFromB64) {
    console.log("[firebaseAdmin] Using base64 service account");
    return admin.credential.cert(svcFromB64);
  }

  // Try individual env vars
  const projectId = process.env.FB_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FB_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = coercePrivateKey(
    process.env.FB_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY
  );
  if (projectId && clientEmail && privateKey) {
    console.log("[firebaseAdmin] Using individual env vars");
    return admin.credential.cert({ projectId, clientEmail, privateKey });
  }

  // FALLBACK: Inline service account (new key generated Jan 15, 2026)
  console.log("[firebaseAdmin] Using inline service account fallback");
  const inlineServiceAccount = {
    projectId: "rewmoai",
    clientEmail: "firebase-adminsdk-fbsvc@rewmoai.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCV6X9ZnK22Rymz\nGri1JUbmxL5igi1V01HEoAUDXcBCqGFjEdoxSsk7h/g4Annh/rMJS3F4dCcCaqcl\nzcx6Jm7rqK3v7ZxjAOR9gUg22bXs9HVh4JPgvzQpN1zq1qkJP/Hz/gZET5oRCJ06\nnXF/CLLPA9FROqhiEC3m7DUPBRtaGKQKQfPryQjwb3qec2R1k/J5YNcOKYL5xsPJ\nxkw6VW7CfjUobqQULCYv7DP3hBq+lb2bRAJ15JLdBDS/2In3ygTRM5kIHHFa/SmP\nfWFATghTMsYc9wpYPBac7pOn7ZzBcPX38b1IUaIcLttgoi7gWhVFp56TJ4vXus8/\nvuxo9HmBAgMBAAECggEADYKGVzr4wRY6F1ASq9x8Po+MQSnOUE9wrU6AdSe0C/qY\nE2Ruxew7JPH7EbODbJu8yPTAEpgt7DIhXK8ZvNTAc6nDykoFdgfRqTY6URsfCCFi\nf+h/WyZpp62iFYkBbcbeyEH9w/03R+hMIK92PkaetDis9FJb2o6IgtvwAinP9IP9\nnkKm+mCUJ90h7/KPwfdUiER52++yvtl3dEDaJ/VRhu/DnRRYW7grkpkV6hUgsJpJ\n84QoJr8P9K3N8Ejvb/3wec1wpFi31+l6aeA9WhDDtU9QCV6nuloRp0wsnRy/bMmk\ndk7ob0S0kNRr7fa+XIKyVG9U4a+EmuEWWbQHf7wBYwKBgQDNFbBO1UZ7PINm9UhM\nIXv1M375yWympFQPYgdZ5Y7T/uDCZP1R70hNbopjXYVbvw77wu2DNHLmnbWFb010\nagUJC2K9NtAEuef5dUY0E9eh72KOMjMNtDRamD/ppBC/aaZ9/FFlcLgYOg4ZCNUy\nYXZ7lhQULCq2hIzgvG3cEPvA3wKBgQC7IUWcmYWsRbAJBT3rZ45fkibdNiz4EXTg\nSo2AplSe7EBZhZHGpxfHWXODF+bhqyOPTxOthaAJ9jZI/8nP5+S3v+PQ2y/wPIRd\n48WaRvaC+h/RzSGFbJ9Wdl3Lel/Af+dedYxqYt6xsJo9Wjh1jTZKziLgp19RYxvq\njTewh/MxnwKBgFIQ2MFjBNYxq99aTbjxOTowhiIMYSb54Q1ay9hETPg2KNiBMwFD\ngCpEDqqedMv201cZdJOpPEVeXJHtrQ/lkOhCnxtaQLlzbwlazWHvgr0xHr4KBnX4\nY27RN9oVpgICk/YcLrIp/fDr4lJQP4fuikwADT7ZQapRtlID9O43+ZX/AoGAL+GO\nj0hVBMR8C4LU2iQQMPITkayoCv1ke3N4C4ADzPpEaOOdbkgY9IA150g5YmrI2YVx\nUogLcCEYuMsCV3lNc5rc7vb2qDDD6cY7LIOV1eOsOqGTPzGQ/62fyE3SrE3N5MSN\nHjeYJb07ahFouuNcDf36vKL257tFTFm/8yKGHp8CgYA/qf3CaEYIuZeKOfj1vAam\n2yL6+hUSAJC44PEjBlv00MBroa6GbRFbvFqFiim3Lvm+6yBD6Jj0UBTKBRAgG8xJ\ncZSbPLWCA2ZMiQ1iRb6JuJ+Dcg663DzlEyeIrytBo8yuD/vHIUINY5s4HnAnGG2x\naQISQOPNGt0i6oVbUcBWIA==\n-----END PRIVATE KEY-----\n",
  };

  return admin.credential.cert(inlineServiceAccount);
}

export function getAdminApp(): admin.app.App {
  if (adminApp) return adminApp;
  if (admin.apps.length) {
    adminApp = admin.app();
    return adminApp;
  }
  const credential = buildCredential();
  const storageBucket =
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "rewmoai.firebasestorage.app";
  adminApp = admin.initializeApp({
    credential,
    storageBucket,
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
  return admin.storage();
}

export const getDb = getAdminDb;