// src/pages/admin.tsx
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { onSnapshot, collection, getDocs } from "firebase/firestore";
import { useAuth } from "@/lib/AuthProvider";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();

  // Replace with your actual admin email(s) or logic!
  const ADMIN_EMAILS = ["gary@rewmo.ai", "youradmin@rewmo.ai"];
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);

  // State for data
  const [userCount, setUserCount] = useState<number>(0);
  const [referralTotal, setReferralTotal] = useState<number>(0);
  const [rewardTotal, setRewardTotal] = useState<number>(0);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/");
      return;
    }
    // Fetch all users
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setUserCount(snap.size);

      let totalReferrals = 0;
      let totalRewards = 0;
      snap.forEach((doc) => {
        const d = doc.data();
        totalReferrals += d.referralCount || 0;
        totalRewards += d.rewardPoints || 0;
      });
      setReferralTotal(totalReferrals);
      setRewardTotal(totalRewards);
    };
    fetchUsers();
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-start px-4 py-8">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-orange-600">RewmoAI Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-orange-100 rounded-lg p-5">
            <div className="text-4xl font-bold text-orange-600">{userCount}</div>
            <div className="text-gray-700">Total Users</div>
          </div>
          <div className="bg-orange-100 rounded-lg p-5">
            <div className="text-4xl font-bold text-orange-600">{referralTotal}</div>
            <div className="text-gray-700">Total Referrals</div>
          </div>
          <div className="bg-orange-100 rounded-lg p-5">
            <div className="text-4xl font-bold text-orange-600">{rewardTotal}</div>
            <div className="text-gray-700">Total Reward Points Awarded</div>
          </div>
        </div>
        <div className="mt-8 text-sm text-gray-600">
          <p>Compliance metrics, affiliate clicks, and consent logs coming soon.</p>
        </div>
      </div>
    </main>
  );
}
