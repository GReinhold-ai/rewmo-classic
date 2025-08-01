// src/pages/profile.tsx
import { useAuth } from "@/lib/AuthProvider";
import { db } from "@/lib/firebaseClient";
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default function Profile() {
  const auth = useAuth();
  const currentUser = auth?.currentUser;
  const [rewards, setRewards] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchRewards = async () => {
      const q = query(
        collection(db, "rewardHistory"),
        where("userId", "==", currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRewards(data);
    };
    fetchRewards();
  }, [currentUser]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <p>Email: {currentUser?.email}</p>

      <h2 className="text-xl font-semibold mt-6">Reward History</h2>
      <ul className="mt-2 space-y-2">
        {rewards.map((r) => (
          <li key={r.id} className="p-3 border rounded-lg shadow-sm">
            <div className="font-bold text-[#003B49]">{r.type}</div>
            <div className="text-sm text-gray-500">{r.notes}</div>
            <div className="text-sm text-[#FF9151]">+{r.points} pts</div>
            <div className="text-xs text-gray-400">
              {r.timestamp?.toDate?.().toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
