import React, { useEffect, useState } from "react";
import { collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseClient";// Update if your path is different

type Reward = {
  id: string;
  userId: string;
  points: number;
  type: string;
  createdAt: string;
};

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRewards() {
      try {
        // Get ALL rewards from all users
        const rewardsSnap = await getDocs(collectionGroup(db, "rewards"));
        const allRewards: Reward[] = [];
        rewardsSnap.forEach((doc) => {
          const data = doc.data();
          // Parse userId from Firestore path (users/{userId}/rewards/{rewardId})
          const userId = doc.ref.parent.parent?.id || "unknown";
          allRewards.push({
            id: doc.id,
            userId,
            points: data.points ?? 0,
            type: data.type ?? "Other",
            createdAt: data.createdAt
              ? new Date(data.createdAt.seconds * 1000).toLocaleString()
              : "",
          });
        });
        setRewards(allRewards);
      } catch (e) {
        alert("Error loading rewards: " + (e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchRewards();
  }, []);

  // Simple CSV export
  function exportCSV() {
    const header = "Reward ID,User ID,Points,Type,Created At\n";
    const rows = rewards
      .map(
        (r) =>
          `${r.id},${r.userId},${r.points},${r.type},"${r.createdAt.replace(/"/g, "")}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rewmoai-rewards.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 bg-white text-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-orange-600">All User Rewards (Admin)</h1>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading rewards...</div>
      ) : (
        <>
          <button
            onClick={exportCSV}
            className="mb-4 px-5 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Export All as CSV
          </button>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-orange-100 text-gray-900">
                  <th className="py-2 px-3 border">Reward ID</th>
                  <th className="py-2 px-3 border">User ID</th>
                  <th className="py-2 px-3 border">Points</th>
                  <th className="py-2 px-3 border">Type</th>
                  <th className="py-2 px-3 border">Created At</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward) => (
                  <tr key={reward.id}>
                    <td className="border px-2 py-1">{reward.id}</td>
                    <td className="border px-2 py-1">{reward.userId}</td>
                    <td className="border px-2 py-1">{reward.points}</td>
                    <td className="border px-2 py-1">{reward.type}</td>
                    <td className="border px-2 py-1">{reward.createdAt}</td>
                  </tr>
                ))}
                {!rewards.length && (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 py-8">
                      No rewards found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
