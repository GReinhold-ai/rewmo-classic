import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/lib/AuthProvider";
import { db } from "@/lib/firebaseClient"; // Adjust import if needed

export function useUserRewards() {
  const { currentUser } = useAuth();
  const [rewardPoints, setRewardPoints] = useState<number | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setRewardPoints(null);
      return;
    }

    // Example: users/{uid}/rewards/summary with { points: number }
    const docRef = doc(db, "users", currentUser.uid, "rewards", "summary");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      setRewardPoints(docSnap.exists() ? docSnap.data().points || 0 : 0);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return { rewardPoints };
}
