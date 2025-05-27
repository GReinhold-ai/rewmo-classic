import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect,
  GoogleAuthProvider, signOut, User
} from "firebase/auth";
import { setDoc, doc, serverTimestamp, getDoc, updateDoc, increment } from "firebase/firestore";
import { app, db } from "./firebaseClient";

interface AuthContextType {
  currentUser: User | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Macintosh') && 'ontouchend' in document)
  );
}

function getReferralCodeFromURL(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("ref");
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Only do referral logic if user is new (you may want a better new-user check in production)
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const alreadyExists = userDoc.exists();

        // Get referral code from URL (works only on first login, on client)
        const refCode = getReferralCodeFromURL();

        // User creation & referral tracking
        await setDoc(
          userDocRef,
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            provider: "google",
            lastSignIn: serverTimestamp(),
            referralCode: user.uid, // user’s own code for sharing
            ...(refCode && !alreadyExists ? { referredBy: refCode } : {}), // Only set on first login
          },
          { merge: true }
        );

        // If this is a NEW user and they signed up with a ref, increment the referrer
        if (refCode && !alreadyExists) {
          const referrerRef = doc(db, "users", refCode);
          try {
            await updateDoc(referrerRef, {
              referralCount: increment(1),
              lastReferral: serverTimestamp(),
              // Add more fields/rewards as you wish!
            });
          } catch (err) {
            // Ignore error if referrer not found
            console.warn("Referral failed: ", err);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      if (isIOS()) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (err: any) {
      alert("signInWithGoogle error: " + err);
    }
  };

  const logout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
