// src/lib/AuthProvider.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebaseClient";

type User = {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  referralCode?: string;
  rewardPoints?: number;
  // Add any additional fields here (e.g., referralCount, etc.)
};

type AuthContextType = {
  currentUser: User | null;
  logout: () => void;
  signInWithGoogle: () => Promise<void>;
  // Add other auth methods if needed
};

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  logout: async () => {},
  signInWithGoogle: async () => {},
});

type AuthProviderProps = { children: React.ReactNode };

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Listen to auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Listen to Firestore changes for user doc
        const userRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeUser = onSnapshot(userRef, (snap) => {
          const data = snap.exists() ? snap.data() : {};
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            referralCode: data.referralCode || undefined,
            rewardPoints: data.rewardPoints ?? 0,
            // Add any additional fields you want to sync here
          });
        });
        // Cleanup Firestore listener on logout/change
        return unsubscribeUser;
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // Firestore onSnapshot will update currentUser automatically
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
