import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

export type Reward = {
  id: string;
  type: string;
  points: number;
  description?: string;
  createdAt?: any;
};

/**
 * Unconditional hook:
 * - Pass `uid` (string | null). If null/undefined, the hook no-ops.
 * - Safe for SSR (checks typeof window).
 */
export function useUserRewards(uid: string | null | undefined) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<boolean>(!!uid);

  useEffect(() => {
    // SSR or logged-out: no subscription
    if (typeof window === "undefined" || !uid) {
      setRewards([]);
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
        const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Reward[];
        setRewards(data);
        setLoading(false);
      },
      () => setLoading(false) // swallow transient errors
    );

    return () => unsub();
  }, [uid]);

  return { rewards, loading };
}
