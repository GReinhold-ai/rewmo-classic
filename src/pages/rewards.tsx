import RewardCard from "@/components/RewardCard";
import { useRouter } from "next/router";

export default function RewardsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10">
      {/* Points/Early Access Message */}
      <div className="w-full max-w-2xl bg-orange-100 border border-orange-400 text-orange-900 text-sm p-4 rounded-xl mb-6 text-center">
        <strong>Points you earn during testing and referrals are being tracked!</strong>
        <br />
        All points earned for referrals, testing, and activities are posted to your account per the{" "}
        <a href="/terms" className="underline text-orange-600 hover:text-orange-800">Reward Rules</a>.
        <br />
        Withdrawals will open after launch, subject to program policies.
      </div>

      <h1 className="text-3xl font-bold text-orange-500 mt-2 mb-2 text-center">Your Rewards</h1>
      <p className="text-center mb-8 max-w-xl text-gray-200">
        Discover new ways to earn more with RewmoAI.<br />
        Complete actions and watch your points grow.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        <RewardCard
          title="Rent & Mortgage Rewards"
          description="Earn extra points just by paying your biggest bills."
          icon="🏠"
          onClick={() => router.push("/rewards/rent-mortgage")}
        />
        <RewardCard
          title="AI Smart Boosts"
          description="Smart reward boosts based on your behavior."
          icon="🤖"
          comingSoon
        />
        <RewardCard
          title="Made in America"
          description="Earn more for buying American products."
          icon="🇺🇸"
          comingSoon
        />
        <RewardCard
          title="Sustainable Shopping"
          description="Bonus for eco-friendly purchases."
          icon="🌱"
          comingSoon
        />
      </div>
    </main>
  );
}
