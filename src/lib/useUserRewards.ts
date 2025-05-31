// src/lib/useUserRewards.ts
import { useEffect, useState } from "react";
import { db } from "./firebaseClient"; // or your firebase file
import { doc, onSnapshot } from "firebase/firestore";

export function useUserRewards(uid?: string | null) {
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!uid) {
      setPoints(0);
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(doc(db, "users", uid), (docSnap) => {
      setPoints(docSnap.exists() ? docSnap.data().points ?? 0 : 0);
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  return { points, loading };
}
