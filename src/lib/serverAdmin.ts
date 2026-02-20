// src/lib/serverAdmin.ts
import * as admin from "firebase-admin";

function getServiceAccount(): admin.ServiceAccount {
  const privateKey = process.env.FB_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!privateKey) {
    throw new Error("FB_ADMIN_PRIVATE_KEY environment variable is not set");
  }

  return {
    projectId: "rewmoai",
    clientEmail: "firebase-adminsdk-fbsvc@rewmoai.iam.gserviceaccount.com",
    privateKey: privateKey,
  };
}

function initAdmin() {
  if (admin.apps.length) return;

  const sa = getServiceAccount();

  admin.initializeApp({
    credential: admin.credential.cert(sa),
  });
}

export function getAdminDb() {
  initAdmin();
  return admin.firestore();
}

export function getAdminAuth() {
  initAdmin();
  return admin.auth();
}