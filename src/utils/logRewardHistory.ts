import { db } from "@/lib/firebaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type RewardEntry = {
  userId: string;
  type: string;
  description: string;
  points: number;
};

export const logRewardHistory = async ({
  userId,
  type,
  description,
  points,
}: RewardEntry) => {
  try {
    const ref = collection(db, "users", userId, "rewardHistory");
    await addDoc(ref, {
      type,
      description,
      points,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging reward history:", error);
  }
};
