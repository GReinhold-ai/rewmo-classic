import { useState, useEffect } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "./firebaseClient"


// Utility: Generate short referral code (REF-xxxxxx)
function generateShortCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "REF-";
  for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

// Hook: Get referral code from URL param
function useReferralFromURL() {
  const [referralFromURL, setReferralFromURL] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      setReferralFromURL(ref);
    }
  }, []);

  return referralFromURL;
}

// Main Hook: Signup with Google & create user doc with referral fields
export function useSignupWithReferral() {
  const referralFromURL = useReferralFromURL();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogleAndProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Access user and new user info
      const user = result.user;
      // @ts-ignore - additionalUserInfo exists on result
      const additionalUserInfo = result.additionalUserInfo;

      // Only set user profile for new users
      if (additionalUserInfo?.isNewUser) {
        // If you want a custom referral code, use generateShortCode()
        // Otherwise, use user.uid as referralCode
        const referralCode = generateShortCode(6); // or: user.uid;

        await setDoc(
          doc(db, "users", user.uid),
          {
            uid: user.uid,
            email: user.email,
            name: user.displayName || "",
            photoURL: user.photoURL || "",
            referralCode,
            rewardPoints: 0,
            referralCount: 0,
            referredBy: referralFromURL || "",
            membershipTier: "Silver",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      setLoading(false);
      return result; // pass along to app context if needed
    } catch (err: any) {
      setError(err.message || "Sign-in failed");
      setLoading(false);
      return null;
    }
  };

  return { signInWithGoogleAndProfile, loading, error };
}
