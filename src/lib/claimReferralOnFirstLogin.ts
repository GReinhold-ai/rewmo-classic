// src/lib/claimReferralOnFirstLogin.ts
import { getSavedRef, clearSavedRef } from "./referral";
import { db } from "./firebaseClient";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Best-effort: claim referral once after first successful auth.
 * - Uses localStorage (?ref=...) captured earlier
 * - Calls /api/referrals/claim on your server (idempotent there)
 * - Marks users/{uid}.referralClaimed = true so we never retry
 */
export async function claimReferralOnFirstLogin(user: { uid: string; email?: string | null }) {
  try {
    const referrerCode = getSavedRef();
    if (!referrerCode) return;

    const uref = doc(db, "users", user.uid);
    const snap = await getDoc(uref);

    const already = snap.exists() && (snap.data() as any)?.referralClaimed === true;
    if (already) {
      clearSavedRef();
      return;
    }

    await fetch("/api/referrals/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referrerCode,
        newUserUid: user.uid,
        newUserEmail: user.email ?? null,
      }),
    });

    await setDoc(uref, { referralClaimed: true }, { merge: true });
    clearSavedRef();
  } catch {
    // best-effort; ignore errors
  }
}
