import React, { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "./firebaseClient";

type User = {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  referralCode?: string;
};

type AuthContextType = {
  currentUser: User | null;
  referralLink: string | null;  // <--- ADD THIS LINE
  logout: () => void;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  referralLink: null,           // <--- AND HERE
  logout: async () => {},
  signInWithGoogle: async () => {},
});

type AuthProviderProps = { children: React.ReactNode };

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [referralLink, setReferralLink] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userObj: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || undefined,
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        };
        setCurrentUser(userObj);

        // Generate referral link with domain + /signup?ref=uid
        const base = typeof window !== "undefined" ? window.location.origin : "https://rewmo.ai";
        setReferralLink(`${base}/signup?ref=${firebaseUser.uid}`);
      } else {
        setCurrentUser(null);
        setReferralLink(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // onAuthStateChanged will update user and referralLink
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setReferralLink(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, referralLink, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
