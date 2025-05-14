import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // ✅ fixed!

const mockUserId = 'demoUser1'; // replace with auth uid later

interface RewardEntry {
  type: string;
  pointsUsed: number;
  redeemedAt: string;
}

export default function RewardHistory() {
  const [rewards, setRewards] = useState<RewardEntry[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const ref = collection(db, 'users', mockUserId, 'rewards');
      const q = query(ref, orderBy('redeemedAt', 'desc'));
      const snap = await getDocs(q);

      const list: RewardEntry[] = snap.docs.map(doc => doc.data() as RewardEntry);
      setRewards(list);
    };

    fetchHistory();
  }, []);

  if (rewards.length === 0) return <p className="text-gray-500">No rewards redeemed yet.</p>;

  return (
    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        🎁 Redemption History
      </h3>
      <ul className="space-y-2">
        {rewards.map((reward, i) => (
          <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">{reward.type}</span> — {reward.pointsUsed} pts
            <span className="ml-2 text-xs text-gray-400">
              ({new Date(reward.redeemedAt).toLocaleDateString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
