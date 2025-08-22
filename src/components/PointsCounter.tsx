import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";        // keep this alias consistent with your project
import { useAuth } from "@/lib/AuthProvider";

type Props = {
  /** Optional: override the uid. If omitted we use the signed-in user. */
  userId?: string;
  className?: string;
};

export default function PointsCounter({ userId, className }: Props) {
  const { currentUser } = useAuth();
  const uid = userId ?? currentUser?.uid;
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    // Logged out? Don't attach a Firestore listener.
    if (!uid) {
      setPoints(null);
      return;
    }

    const ref = doc(db, "users", uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const d = snap.data() || {};
        // Your user doc uses `rewardPoints` (with fallback to legacy `points`)
        const value =
          typeof d.rewardPoints === "number"
            ? d.rewardPoints
            : typeof d.points === "number"
            ? d.points
            : 0;
        setPoints(value);
      },
      // Swallow transient permission errors if they ever occur
      () => { /* no-op */ }
    );

    return () => unsub();
  }, [uid]);

  // On public pages while logged out, don't render anything to avoid layout shifts.
  if (!uid) return null;

  return (
    <div className={className ?? "text-sm text-gray-500"}>
      Total Points: <strong>{points === null ? "…" : points.toLocaleString()}</strong>
    </div>
  );
}
