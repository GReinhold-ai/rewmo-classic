// src/lib/serverAdmin.ts
import admin from "firebase-admin";

function normalizePrivateKey(raw: string) {
  let k = (raw || "").trim();

  // Remove surrounding quotes if present
  if (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1);
  }

  // Convert escaped newlines to real newlines and strip CR
  k = k.replace(/\\n/g, "\n").replace(/\\r/g, "").replace(/\r/g, "");

  return k.trim();
}

export function getAdminDb() {
  if (!admin.apps.length) {
    const projectId = process.env.FB_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FB_ADMIN_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FB_ADMIN_PRIVATE_KEY;

    if (!projectId) throw new Error("[serverAdmin] Missing FB_ADMIN_PROJECT_ID");
    if (!clientEmail) throw new Error("[serverAdmin] Missing FB_ADMIN_CLIENT_EMAIL");
    if (!privateKeyRaw) throw new Error("[serverAdmin] Missing FB_ADMIN_PRIVATE_KEY");

    const privateKey = normalizePrivateKey(privateKeyRaw);

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return admin.firestore();
}
