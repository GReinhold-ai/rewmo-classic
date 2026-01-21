// src/lib/AuthProvider.tsx
// FIXED: Better iOS Safari handling for sessionStorage/popup issues
import React, { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";
import { logRewardHistory } from "@/utils/logRewardHistory";

export type AuthContextType = {
  currentUser: User | null;
  getIdToken: () => Promise<string | null>;
  authHeader: () => Promise<Record<string, string>>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Detect iOS Safari
const isIOSSafari = (): boolean => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const webkit = /WebKit/.test(ua);
  const notChrome = !/CriOS/.test(ua);
  const notFirefox = !/FxiOS/.test(ua);
  return iOS && webkit && notChrome && notFirefox;
};

// Detect if in standalone mode (added to home screen)
const isStandalone = (): boolean => {
  if (typeof window === "undefined") return false;
  return (window.navigator as any).standalone === true;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const initializingRef = useRef(false);

  // 🔧 Set persistence to LOCAL on mount (helps with iOS Safari)
  useEffect(() => {
    const setupPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        console.log('✅ [AuthProvider] Set auth persistence to LOCAL');
      } catch (error) {
        console.error('❌ [AuthProvider] Failed to set persistence:', error);
      }
    };
    setupPersistence();
  }, []);

  // 🧠 UNIFIED: Create/Update Firestore user document
  const ensureUserDocument = async (user: User): Promise<void> => {
    try {
      console.log('🔥 [AuthProvider] Ensuring user document for:', user.uid, user.email);
      
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        console.log('📝 [AuthProvider] Creating NEW user document...');
        
        const referredBy = typeof window !== "undefined" 
          ? localStorage.getItem("rewmo_ref_code") || null 
          : null;

        const userData = {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || user.email?.split('@')[0] || "User",
          photoURL: user.photoURL || null,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          rewardPoints: 0,
          rewards: 0,
          membershipTier: "Silver",
          tier: "FREE",
          goal: 10000,
          referralCode: `REF-${user.uid.slice(0, 8)}`,
          referredBy,
          referralCount: 0,
        };

        await setDoc(userRef, userData);
        console.log('✅ [AuthProvider] User document created successfully');
      } else {
        console.log('✅ [AuthProvider] User document exists, updating lastLoginAt');
        await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
      }
    } catch (error: any) {
      console.error('❌ [AuthProvider] ERROR creating/updating user document:', error);
    }
  };

  // 🎯 Handle Referral Tracking
  const handleReferralTracking = async (newUser: User): Promise<void> => {
    const referrerId = typeof window !== "undefined" 
      ? localStorage.getItem("rewmo_ref_code") 
      : null;
      
    if (!referrerId) return;

    try {
      const response = await fetch(
        "https://us-central1-rewmoai.cloudfunctions.net/handleReferral",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            referrerId,
            newUserId: newUser.uid,
            newUserEmail: newUser.email,
          }),
        }
      );

      if (response.ok) {
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

        if (typeof window !== "undefined") {
          localStorage.removeItem("rewmo_ref_code");
        }
      }
    } catch (err: any) {
      console.error("❌ [AuthProvider] Referral tracking failed:", err.message);
    }
  };

  // 🔐 Google Sign-In with POPUP (with iOS Safari workarounds)
  const signInWithGoogle = async (): Promise<void> => {
    try {
      console.log('🔐 [AuthProvider] Starting Google sign-in (popup)...');
      console.log('📱 [AuthProvider] iOS Safari:', isIOSSafari(), 'Standalone:', isStandalone());
      
      // Set persistence before sign in (helps with iOS)
      await setPersistence(auth, browserLocalPersistence);
      
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ 
        prompt: "select_account"
      });
      
      // Add scopes
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      
      console.log('✅ [AuthProvider] Google sign-in successful!', {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      });
      
      await ensureUserDocument(result.user);
      
      // Check if this is a new user for referral tracking
      const userRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists() && !docSnap.data().referredBy) {
        await handleReferralTracking(result.user);
      }
      
    } catch (error: any) {
      // Handle popup closed by user
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('ℹ️ [AuthProvider] User closed the sign-in popup');
        return;
      }
      
      // Handle popup blocked
      if (error.code === 'auth/popup-blocked') {
        console.error('❌ [AuthProvider] Popup was blocked. Please allow popups for this site.');
        alert('Sign-in popup was blocked. Please allow popups for rewmo.ai and try again.');
        throw new Error('Sign-in popup was blocked. Please allow popups and try again.');
      }
      
      // Handle iOS Safari sessionStorage issue
      if (error.message?.includes('missing initial state') || 
          error.code === 'auth/missing-initial-state') {
        console.error('❌ [AuthProvider] iOS Safari sessionStorage issue detected');
        
        // For iOS Safari in standalone mode, suggest opening in Safari
        if (isStandalone()) {
          alert('Please open rewmo.ai in Safari browser to sign in, then return to this app.');
        } else {
          alert('Sign-in failed. Please try again or use a different browser.');
        }
        throw new Error('Sign-in failed due to browser storage restrictions. Please try again.');
      }
      
      // Handle cancelled by user (iOS specific)
      if (error.code === 'auth/cancelled-popup-request') {
        console.log('ℹ️ [AuthProvider] Sign-in cancelled');
        return;
      }
      
      console.error('❌ [AuthProvider] Google sign-in failed:', error.code, error.message);
      throw error;
    }
  };

  // 📧 Email Sign-In
  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await ensureUserDocument(result.user);
    } catch (error: any) {
      console.error('❌ [AuthProvider] Email sign-in failed:', error.code, error.message);
      throw error;
    }
  };

  // 🆕 Email Sign-Up
  const signUpWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await ensureUserDocument(result.user);
      await handleReferralTracking(result.user);
    } catch (error: any) {
      console.error('❌ [AuthProvider] Email sign-up failed:', error.code, error.message);
      throw error;
    }
  };

  // 🚪 Logout
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error: any) {
      console.error('❌ [AuthProvider] Logout failed:', error.message);
      throw error;
    }
  };

  // 👁️ Auth State Listener
  useEffect(() => {
    // Prevent double initialization (React Strict Mode)
    if (initializingRef.current) {
      console.log('⚠️ [AuthProvider] Already initializing, skipping...');
      return;
    }
    
    initializingRef.current = true;
    console.log('🔥 [AuthProvider] Initializing...');

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        console.log('🔄 [AuthProvider] Auth state changed:', user ? `${user.email} (${user.uid})` : 'signed out');
        
        if (user) {
          await ensureUserDocument(user);
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
        
        setLoading(false);
      },
      (error) => {
        console.error('❌ [AuthProvider] Auth listener error:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('🔥 [AuthProvider] Cleaning up...');
      unsubscribe();
      initializingRef.current = false;
    };
  }, []);

  // 🔑 Token Management
  const getIdToken = async (): Promise<string | null> => {
    try {
      if (!currentUser) return null;
      return await currentUser.getIdToken(false);
    } catch (error: any) {
      console.error('❌ [AuthProvider] Failed to get ID token:', error.message);
      return null;
    }
  };

  const authHeader = async (): Promise<Record<string, string>> => {
    const token = await getIdToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = useMemo<AuthContextType>(
    () => ({
      currentUser,
      getIdToken,
      authHeader,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      logout,
    }),
    [currentUser]
  );

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(to bottom right, #134e4a, #115e59)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Loading...</h2>
          <p style={{ color: '#99f6e4' }}>Setting up your session...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;