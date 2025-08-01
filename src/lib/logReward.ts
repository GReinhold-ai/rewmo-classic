// src/lib/logReward.ts
import { db } from "@/lib/firebaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const logReward = async ({
  userId,
  type,
  points,
  notes = "",
}: {
  userId: string;
  type: string;
  points: number;
  notes?: string;
}) => {
  const rewardRef = collection(db, "users", userId, "rewardHistory");

  await addDoc(rewardRef, {
    type,
    points,
    notes,
    timestamp: serverTimestamp(),
  });
};
