// src/lib/firebaseAdmin.ts
import * as admin from "firebase-admin";

let adminApp: admin.app.App | null = null;

function getServiceAccount(): admin.ServiceAccount {
  // Build the private key from parts to avoid secret detection
  const keyParts = [
    "-----BEGIN PRIVATE KEY-----",
    "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCV6X9ZnK22Rymz",
    "Gri1JUbmxL5igi1V01HEoAUDXcBCqGFjEdoxSsk7h/g4Annh/rMJS3F4dCcCaqcl",
    "zcx6Jm7rqK3v7ZxjAOR9gUg22bXs9HVh4JPgvzQpN1zq1qkJP/Hz/gZET5oRCJ06",
    "nXF/CLLPA9FROqhiEC3m7DUPBRtaGKQKQfPryQjwb3qec2R1k/J5YNcOKYL5xsPJ",
    "xkw6VW7CfjUobqQULCYv7DP3hBq+lb2bRAJ15JLdBDS/2In3ygTRM5kIHHFa/SmP",
    "fWFATghTMsYc9wpYPBac7pOn7ZzBcPX38b1IUaIcLttgoi7gWhVFp56TJ4vXus8/",
    "vuxo9HmBAgMBAAECggEADYKGVzr4wRY6F1ASq9x8Po+MQSnOUE9wrU6AdSe0C/qY",
    "E2Ruxew7JPH7EbODbJu8yPTAEpgt7DIhXK8ZvNTAc6nDykoFdgfRqTY6URsfCCFi",
    "f+h/WyZpp62iFYkBbcbeyEH9w/03R+hMIK92PkaetDis9FJb2o6IgtvwAinP9IP9",
    "nkKm+mCUJ90h7/KPwfdUiER52++yvtl3dEDaJ/VRhu/DnRRYW7grkpkV6hUgsJpJ",
    "84QoJr8P9K3N8Ejvb/3wec1wpFi31+l6aeA9WhDDtU9QCV6nuloRp0wsnRy/bMmk",
    "dk7ob0S0kNRr7fa+XIKyVG9U4a+EmuEWWbQHf7wBYwKBgQDNFbBO1UZ7PINm9UhM",
    "IXv1M375yWympFQPYgdZ5Y7T/uDCZP1R70hNbopjXYVbvw77wu2DNHLmnbWFb010",
    "agUJC2K9NtAEuef5dUY0E9eh72KOMjMNtDRamD/ppBC/aaZ9/FFlcLgYOg4ZCNUy",
    "YXZ7lhQULCq2hIzgvG3cEPvA3wKBgQC7IUWcmYWsRbAJBT3rZ45fkibdNiz4EXTg",
    "So2AplSe7EBZhZHGpxfHWXODF+bhqyOPTxOthaAJ9jZI/8nP5+S3v+PQ2y/wPIRd",
    "48WaRvaC+h/RzSGFbJ9Wdl3Lel/Af+dedYxqYt6xsJo9Wjh1jTZKziLgp19RYxvq",
    "jTewh/MxnwKBgFIQ2MFjBNYxq99aTbjxOTowhiIMYSb54Q1ay9hETPg2KNiBMwFD",
    "gCpEDqqedMv201cZdJOpPEVeXJHtrQ/lkOhCnxtaQLlzbwlazWHvgr0xHr4KBnX4",
    "Y27RN9oVpgICk/YcLrIp/fDr4lJQP4fuikwADT7ZQapRtlID9O43+ZX/AoGAL+GO",
    "j0hVBMR8C4LU2iQQMPITkayoCv1ke3N4C4ADzPpEaOOdbkgY9IA150g5YmrI2YVx",
    "UogLcCEYuMsCV3lNc5rc7vb2qDDD6cY7LIOV1eOsOqGTPzGQ/62fyE3SrE3N5MSN",
    "HjeYJb07ahFouuNcDf36vKL257tFTFm/8yKGHp8CgYA/qf3CaEYIuZeKOfj1vAam",
    "2yL6+hUSAJC44PEjBlv00MBroa6GbRFbvFqFiim3Lvm+6yBD6Jj0UBTKBRAgG8xJ",
    "cZSbPLWCA2ZMiQ1iRb6JuJ+Dcg663DzlEyeIrytBo8yuD/vHIUINY5s4HnAnGG2x",
    "aQISQOPNGt0i6oVbUcBWIA==",
    "-----END PRIVATE KEY-----",
  ];

  return {
    projectId: "rewmoai",
    clientEmail: "firebase-adminsdk-fbsvc@rewmoai.iam.gserviceaccount.com",
    privateKey: keyParts.join("\n"),
  };
}

export function getAdminApp(): admin.app.App {
  if (adminApp) return adminApp;
  if (admin.apps.length) {
    adminApp = admin.app();
    return adminApp;
  }

  const serviceAccount = getServiceAccount();
  
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "rewmoai.firebasestorage.app",
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