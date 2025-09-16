// src/lib/referral.ts

/** Canonical localStorage key for referral codes */
export const REF_KEY = "rewmo_ref_code";
/** Legacy key some older pages used */
export const LEGACY_REF_KEY = "refCode";

/** Low-level setter that writes BOTH keys (for backward compatibility) */
export function setRef(code: string) {
  try {
    if (typeof window === "undefined") return;
    const clean = String(code || "").trim();
    if (!clean) return;
    localStorage.setItem(REF_KEY, clean);
    localStorage.setItem(LEGACY_REF_KEY, clean);
  } catch {
    // ignore storage errors
  }
}

/** Read a referral code from storage (migrates legacy -> new key if needed) */
export function getSavedRef(): string | null {
  try {
    if (typeof window === "undefined") return null;
    const v = localStorage.getItem(REF_KEY);
    if (v) return v;

    // Fallback to legacy & migrate forward
    const legacy = localStorage.getItem(LEGACY_REF_KEY);
    if (legacy) {
      localStorage.setItem(REF_KEY, legacy);
      return legacy;
    }
    return null;
  } catch {
    return null;
  }
}

/** Remove referral markers from storage */
export function clearSavedRef() {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(REF_KEY);
    localStorage.removeItem(LEGACY_REF_KEY);
  } catch {
    // ignore
  }
}

/** Capture ?ref=... from the current URL and persist (both keys) */
export function saveRefFromUrl() {
  try {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const ref = url.searchParams.get("ref");
    if (ref) setRef(ref);
  } catch {
    // ignore URL errors
  }
}
