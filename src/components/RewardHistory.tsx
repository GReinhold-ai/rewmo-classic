import { useAuth } from "@/lib/AuthProvider";
import { useUserRewards } from "@/lib/useUserRewards";

export default function RewardHistory() {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  // Public route? Don't query Firestore.
  if (!uid) return null;

  const { rewards, loading } = useUserRewards(uid);

  if (loading) return <div className="text-sm text-gray-500">Loading rewards…</div>;
  if (!rewards?.length) return <div className="text-sm text-gray-500">No rewards yet.</div>;

  return (
    <ul className="space-y-2">
      {rewards.map((r) => (
        <li key={r.id} className="text-sm">
          <span className="font-medium">{r.type}</span>{" "}
          <span className="text-gray-500">({r.points} pts)</span>
          {r.description ? <> — {r.description}</> : null}
        </li>
      ))}
    </ul>
  );
}
