// src/utils/saveUserToFirestore.ts
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { User } from "firebase/auth";
import { UserData } from "@/types/UserData";

export const saveUserToFirestore = async (user: User): Promise<void> => {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    const referralCode = `REF-${user.uid.slice(0, 6).toUpperCase()}`;

    const newUserData: UserData = {
      uid: user.uid,
      email: user.email || "",
      name: user.displayName || "",
      rewardPoints: 0,
      membershipTier: "Silver",
      goal: 10000,
      referralCode,
      referralCount: 0,
      createdAt: serverTimestamp() as any,
    };

    await setDoc(userRef, newUserData);
    console.log("✅ New user saved to Firestore:", newUserData);
  } else {
    console.log("ℹ️ User already exists in Firestore.");
  }
};
