// src/lib/AuthProvider.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AuthContextType = {
  currentUser: any;
  signInWithGoogle: () => Promise<any>;
  signInWithEmail: (email: string, pw: string) => Promise<any>;
  signUpWithEmail: (email: string, pw: string) => Promise<any>;
  logout: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authFns, setAuthFns] = useState<any>(null);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    import("./firebaseClientAuth").then(mod => {
      const { auth } = mod;
      setAuthFns(mod);

      unsub = auth.onAuthStateChanged((user: any) => {
        setCurrentUser(user);
      });
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Defensive wrappers prevent errors if not loaded yet
  const signInWithGoogle = async () => authFns?.signInWithGoogle?.();
  const signInWithEmail = async (email: string, pw: string) => authFns?.signInWithEmail?.(email, pw);
  const signUpWithEmail = async (email: string, pw: string) => authFns?.signUpWithEmail?.(email, pw);
  const logout = async () => authFns?.logout?.();

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

// Usage in components:
export const useAuth = () => useContext(AuthContext)!;
