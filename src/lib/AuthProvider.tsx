// src/lib/AuthProvider.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { app } from "./firebaseClient";

interface AuthContextType {
  currentUser: User | null;
  login: () => void;
  logout: () => void;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => {},
  logout: () => {},
  signInWithGoogle: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    // iOS browsers require redirect flow
    const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isiOS) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
    }
  };

  const login = signInWithGoogle;
  const logoutUser = () => {
    const auth = getAuth(app);
    signOut(auth);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout: logoutUser, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}
