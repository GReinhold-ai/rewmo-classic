// src/lib/serverAdmin.ts
import admin from "firebase-admin";

type AdminApp = admin.app.App;

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`[serverAdmin] Missing env var: ${name}`);
  return v;
}

function initAdmin(): AdminApp {
  if (admin.apps.length) return admin.app();

  const projectId =
    process.env.FB_ADMIN_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const clientEmail =
    process.env.FB_ADMIN_CLIENT_EMAIL ||
    process.env.FIREBASE_CLIENT_EMAIL;

  const privateKeyRaw =
    process.env.FB_ADMIN_PRIVATE_KEY ||
    process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId) throw new Error("[serverAdmin] Missing projectId env var");
  if (!clientEmail) throw new Error("[serverAdmin] Missing clientEmail env var");
  if (!privateKeyRaw) throw new Error("[serverAdmin] Missing privateKey env var");

  // CRITICAL: Vercel stores multiline secrets as \n
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return admin.app();
}

export function getAdminDb() {
  initAdmin();
  return admin.firestore();
}
