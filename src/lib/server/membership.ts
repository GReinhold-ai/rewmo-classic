// src/lib/server/membership.ts
// Server-side helpers for membership / entitlements (array-of-strings model)

import { getAdminDb } from "@/lib/serverAdmin";
import { FieldValue } from "firebase-admin/firestore";

/** A single entitlement string, e.g. "leanai.fundamentals" */
export type EntitlementKey = string;

/** Optional top-level shape if you fetch the whole user doc */
export type UserEntitlements = {
  entitlements: EntitlementKey[];
};

// ——— Small in-memory cache to reduce repeated reads in a single process ———
type CacheEntry = { value: EntitlementKey[]; expiry: number; timer: any | null };
const cache = new Map<string, CacheEntry>();
const TTL_MS = 30_000;

function setCache(uid: string, value: EntitlementKey[]) {
  const existing = cache.get(uid);
  if (existing?.timer) clearTimeout(existing.timer as any);

  const expiry = Date.now() + TTL_MS;
  const timer: any = setTimeout(() => {
    cache.delete(uid);
  }, TTL_MS);

  cache.set(uid, { value, expiry, timer });
}

function getCache(uid: string): EntitlementKey[] | null {
  const hit = cache.get(uid);
  if (!hit) return null;
  if (Date.now() > hit.expiry) {
    if (hit.timer) clearTimeout(hit.timer as any);
    cache.delete(uid);
    return null;
  }
  return hit.value;
}

// ——— Public API ———

/**
 * Read the user's entitlements array from users/{uid}.entitlements.
 * Returns [] if missing. Briefly cached to reduce reads.
 */
export async function getUserEntitlements(uid: string): Promise<EntitlementKey[]> {
  if (!uid) return [];

  const cached = getCache(uid);
  if (cached) return cached;

  const db = getAdminDb();
  const snap = await db.collection("users").doc(uid).get();

  const list: EntitlementKey[] =
    snap.exists && Array.isArray(snap.get("entitlements"))
      ? (snap.get("entitlements") as EntitlementKey[])
      : [];

  setCache(uid, list);
  return list;
}

/** Convenience boolean check. */
export async function userHasEntitlement(uid: string, key: EntitlementKey): Promise<boolean> {
  const list = await getUserEntitlements(uid);
  return list.includes(key);
}

/**
 * Grant an entitlement (idempotent). Safe to call from webhooks/admin tools.
 * Uses FieldValue.arrayUnion under users/{uid}.entitlements
 */
export async function grantEntitlement(uid: string, key: EntitlementKey): Promise<void> {
  if (!uid || !key) return;
  const db = getAdminDb();
  const ref = db.collection("users").doc(uid);

  await ref.set({ entitlements: FieldValue.arrayUnion(key) }, { merge: true });

  const existing = await getUserEntitlements(uid);
  if (!existing.includes(key)) setCache(uid, [...existing, key]);
}

/** Revoke an entitlement (optional utility). */
export async function revokeEntitlement(uid: string, key: EntitlementKey): Promise<void> {
  if (!uid || !key) return;
  const db = getAdminDb();
  const ref = db.collection("users").doc(uid);

  await ref.set({ entitlements: FieldValue.arrayRemove(key) }, { merge: true });

  const existing = await getUserEntitlements(uid);
  setCache(uid, existing.filter((k) => k !== key));
}
