mport type { User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import type { UserData } from "@/type/UserData";

export const createUserInFirestore = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    const newUser: UserData = {
      uid: user.uid,
      email: user.email || "",
      name: user.displayName || "",
      rewardPoints: 0,
      membershipTier: "Silver",
      goal: 10000,
      referralCode: `REF-${user.uid.slice(0, 6)}`,
      referralCount: 0,
      createdAt: serverTimestamp() as any,
    };

    await setDoc(userRef, newUser);
    console.log("✅ New user saved to Firestore:", newUser);
  } else {
    console.log("ℹ️ User already exists in Firestore.");
  }
};
