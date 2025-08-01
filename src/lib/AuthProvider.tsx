import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebaseClient";

type AuthContextType = {
  currentUser: User | null;
  signUpWithEmail: (email: string, password: string, referralCode?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const logRewardHistory = async (
    uid: string,
    type: string,
    description: string,
    points: number
  ) => {
    const historyRef = collection(db, "users", uid, "rewardHistory");
    await addDoc(historyRef, {
      type,
      description,
      points,
      timestamp: serverTimestamp(),
    });
  };

  const saveUserToFirestore = async (user: User, referralCode?: string) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
        referralCodeUsed: referralCode || null,
        points: 0,
        referralCount: 0,
      });

      if (referralCode) {
        const refQuery = query(collection(db, "users"), where("uid", "==", referralCode));
        const refSnap = await getDocs(refQuery);
        if (!refSnap.empty) {
          const referrerDoc = refSnap.docs[0];
          const referrerRef = referrerDoc.ref;
          const currentPoints = referrerDoc.data().points || 0;
          const currentCount = referrerDoc.data().referralCount || 0;

          // Award bonus
          const bonusPoints = 1000;
          await updateDoc(referrerRef, {
            points: currentPoints + bonusPoints,
            referralCount: currentCount + 1,
          });

          await logRewardHistory(referrerDoc.id, "Referral", "Referred a new user", bonusPoints);
        }
      }
    }
  };

  const signUpWithEmail = async (email: string, password: string, referralCode?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(userCredential.user, referralCode);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async (referralCode?: string) => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await saveUserToFirestore(result.user, referralCode);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, signUpWithEmail, signInWithEmail, signInWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
