// src/lib/serverAdmin.ts
// Single place to initialize and access Firebase Admin (Firestore/Auth)

import { cert, getApp, getApps, initializeApp, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let _app: App | null = null;

function getAdminApp(): App {
  if (_app) return _app;

  if (getApps().length) {
    _app = getApp();
    return _app;
  }

  const {
    FB_ADMIN_PROJECT_ID,
    FB_ADMIN_CLIENT_EMAIL,
    FB_ADMIN_PRIVATE_KEY,
  } = process.env;

  // If full service-account envs are present, use them.
  // Otherwise fall back to default credentials (works on GCP environments).
  if (FB_ADMIN_PROJECT_ID && FB_ADMIN_CLIENT_EMAIL && FB_ADMIN_PRIVATE_KEY) {
    _app = initializeApp({
      credential: cert({
        projectId: FB_ADMIN_PROJECT_ID,
        clientEmail: FB_ADMIN_CLIENT_EMAIL,
        // Allow escaped newlines in env var
        privateKey: FB_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    // Will rely on GOOGLE_APPLICATION_CREDENTIALS or platform default creds
    _app = initializeApp();
  }

  return _app;
}

/** Get a Firestore Admin instance */
export function getAdminDb() {
  const db = getFirestore(getAdminApp());
  // Optional: avoid errors when writing partial objects
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

/** Get a Firebase Admin Auth instance (handy for server-only verifications) */
export function getAdminAuth() {
  return getAuth(getAdminApp());
}

