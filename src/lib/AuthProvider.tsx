import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authFns, setAuthFns] = useState<any>(null);

  useEffect(() => {
    // Only runs on client!
    import("./firebaseClientAuth").then(mod => {
      const { auth } = mod;
      setAuthFns(mod);

      // Subscribe to auth state changes
      const unsub = auth.onAuthStateChanged((user: any) => {
        setCurrentUser(user);
      });
      return () => unsub();
    });
  }, []);

  // These wrappers ensure your UI works even before the module loads
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
export const useAuth = () => useContext(AuthContext);
