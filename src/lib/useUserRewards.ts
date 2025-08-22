import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import { useAuth } from "@/lib/AuthProvider";

export type Reward = {
  id: string;
  type: string;
  points: number;
  description?: string;
  createdAt?: any;
};

export function useUserRewards(userIdOverride?: string) {
  const { currentUser } = useAuth();
  const uid = userIdOverride ?? currentUser?.uid;

  const [data, setData] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // SSR / logged-out guard
    if (typeof window === "undefined" || !uid) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "users", uid, "rewards"),
      orderBy("createdAt", "desc"),
      limit(100)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
        setLoading(false);
      },
      () => setLoading(false) // swallow transient errors
    );

    return () => unsub();
  }, [uid]);

  return { rewards: data, loading };
}
