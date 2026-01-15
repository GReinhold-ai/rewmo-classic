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

  // FALLBACK: Inline service account
  const inlineServiceAccount = {
    projectId: "rewmoai",
    clientEmail: "firebase-adminsdk-fbsvc@rewmoai.iam.gserviceaccount.com",
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDdD2YCALBzsWW9
LEijA8ZtTnvxdj5iDCVVXIH5qIMw+bmTv7dm2afXbFZOE4pdh070wFv7i9T/vc61
oLNYTjzEK8E77f+Ycghx1VeE9ilQk8ZS18erzpok/TtMWFaWtdr/KirMwokbMv03
MDkW1iO/s4Fi08sLcrAMtAzYQ5ayXIadadTidTxIJCsHsj5aZF6UzBYeB1Z+QVcB
5y55IsCLe9tBx3CzUpX9vIElOncGwtoAuLimby6heCfdRcoSx9eECR3MIFPMjuWR
+oa2aFKJcYv8BzVQIfdJ8pAnBbcdQiuQK6T/n+mZTVZy6vuyC7vaSGiuRWXNDS9F
hl3hTDAvAgMBAAECggEAFNxVo32+KQTGFY5+wkdia8E6yAQBCg6cXUxQBafFzZLb
VNqEK6QBhz41fMOyTHYu2MDoTToaXRHj1lb2ZbBoYpjAcO/aLWAhdOCNlEIIjw6K
6hlrwcZK3I+7D07MyQcbRfYMOOtotdTfeVxHHuURVY9Sd+mFoSxu+ZvqFGR4bZdJ
rZhQrl7DuE6SeQqqjunMZ0QxrpZKGRqZtRyRSA/Quta7+LRVfRdGfnfjQKVHJ/e4
JBfCpCVffV4c338TdkLbn0zxkwcUOmtukAj0JmLAL5AguqvitNkbnj4+xt3HIBR8
lxybRdtB2qSXz+FPIYeExdDDSpgj+JCOKXxiYwoMNQKBgQD9fpHGXSOt4+lbAQx+
B2J6Mm3rKUqQK0teXcYkjX6M3685OOKYMR9mpj/0jimOx8laF/Y5upocbRw2Qcz5
heaIHuJYrL7rR50RPWIUN0ZK0DmQW8s8WM1gcPXJy/ehWs9t4Bk6oZQ5Azl7/1Vh
i8s+fC0ea32iB7SEWfb2WhseMwKBgQDfPsJFq5wvfkZpd9VEaJmmP9ywqsSR3KDf
ls8/v23HEWwxd4GYmYOxPwHJZW8A6BLOtcmQfyxIQT/D7LrmzmStnx7pDbg97NYj
P8YThnFrp+cw2JEFan7lJnDc6SMSbukuqwjRIQeqds6FQ5/oo4Yp52M/sM7R1hbM
/E1TD+ByFQKBgH0EK955VrxOl2pzNPb+q1l6f20nmwdI4s2yT6L9STkuo9sDq/TE
3Sihuw7gAazR6QKOqLdFyPVV9kDn6K/ykoP1P0neP/YHBnZXIIS50efZk1oXez7S
yM7URtNzzTd9cqlMiQS6ZUBMz8/QWApYiC7TzOiguH/tbuCLAdnzDEazAoGBALRj
pd9eF8pYotS+O9oXG3C20cD/e+7Q9D03QygjqrTcYyxlgJaqFTu3yd3O1K9K10eo
pMLZwBJyhu/t7ehqhfe1R+jRaTrAkRfShF9ql2OCPNG/bQ+PShInybL3v5s5e7p2
AZ3arrMTZTVRu3jkCZj6m7vvRm9QKwRgKqsffSExAoGBAM4sBk5qpjlEOJsj0SPw
eU4je4aHHQV2uEG874vjRYAJqUckTVvsAb15mz/5V0m+NxDlyaehl/s3bT09IT79
/An1bZ5V6n2r1A0zxSkpQ8Ck8tZSnwokaorORGA+zyCgiHx1fr46cY0dfNpOSqmg
1oC8mY4Jgzueb79AxiAssES0
-----END PRIVATE KEY-----`,
  };

  console.log("[firebaseAdmin] Using inline service account fallback");
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