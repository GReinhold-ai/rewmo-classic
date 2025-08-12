import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";
import { logRewardHistory } from "@/utils/logRewardHistory";

export type AuthContextType = {
  currentUser: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 🧠 Create Firestore user if not exists
  const createUserInFirestore = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || "",
        name: user.displayName || "",
        rewardPoints: 0,
        membershipTier: "Silver",
        goal: 10000,
        referralCode: `REF-${user.uid.slice(0, 6)}`,
        referralCount: 0,
        createdAt: serverTimestamp(),
      });
    }
  };

  // 🎯 Handle Referral Tracking
  const handleReferralTracking = async (newUser: User) => {
    const referrerId = localStorage.getItem("referrer");
    if (!referrerId) return;
    try {
      await fetch("https://us-central1-rewmoai.cloudfunctions.net/handleReferral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referrerId,
          newUserId: newUser.uid,
          newUserEmail: newUser.email,
        }),
      });

      // 🎁 Log rewards
      await logRewardHistory({
        userId: referrerId,
        type: "referral_bonus",
        description: `Referred user: ${newUser.email}`,
        points: 1000,
      });
      await logRewardHistory({
        userId: newUser.uid,
        type: "referral_signup_bonus",
        description: `Signed up using referral from ${referrerId}`,
        points: 500,
      });

      localStorage.removeItem("referrer");
    } catch (err) {
      console.error("Referral tracking/logging failed:", err);
    }
  };

  // 🔐 Google Sign-In
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await createUserInFirestore(result.user);
    await handleReferralTracking(result.user);
  };

  // 📧 Email Sign-In
  const signInWithEmail = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await createUserInFirestore(result.user);
  };

  // 🆕 Email Sign-Up
  const signUpWithEmail = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUserInFirestore(result.user);
    await handleReferralTracking(result.user);
  };

  // 🚪 Logout
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // 👁️ Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) await createUserInFirestore(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook returns a non-null context so `{ currentUser } = useAuth()` is fully typed
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// Add default export so both default and named imports work
export default AuthProvider;
