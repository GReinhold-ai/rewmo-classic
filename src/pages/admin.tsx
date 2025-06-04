import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { useRouter } from "next/router";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

const ADMIN_EMAILS = ["gary@rewmo.ai", "youradmin@rewmo.ai"];

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Stats
  const [userCount, setUserCount] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [affiliateClicks, setAffiliateClicks] = useState(0);
  const [affiliatePurchases, setAffiliatePurchases] = useState(0);
  const [affiliateRevenue, setAffiliateRevenue] = useState(0);
  const [consentedUsers, setConsentedUsers] = useState(0);
  const [disclosureViews, setDisclosureViews] = useState(0);

  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email || "");

  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);
    setError(null);

    async function fetchStats() {
      try {
        // USERS
        const usersSnap = await getDocs(collection(db, "users"));
        let totalReferrals = 0;
        let totalPoints = 0;
        let consents = 0;
        let disclosures = 0;
        let affiliates = 0;
        let purchases = 0;
        let revenue = 0;
        const usersList: any[] = [];

        usersSnap.forEach((doc) => {
          const u = doc.data();
          totalReferrals += u.referralCount || 0;
          totalPoints += u.rewardPoints || 0;
          if (u.consented) consents += 1;
          if (u.viewedDisclosure) disclosures += 1;
          if (u.affiliateClicks) affiliates += u.affiliateClicks;
          if (u.affiliatePurchases) purchases += u.affiliatePurchases;
          if (u.affiliateRevenue) revenue += u.affiliateRevenue;
          usersList.push({
            email: u.email,
            referrals: u.referralCount || 0,
            rewards: u.rewardPoints || 0,
            consented: !!u.consented,
          });
        });

        setUserCount(usersSnap.size);
        setReferralCount(totalReferrals);
        setTotalRewards(totalPoints);
        setConsentedUsers(consents);
        setDisclosureViews(disclosures);
        setAffiliateClicks(affiliates);
        setAffiliatePurchases(purchases);
        setAffiliateRevenue(revenue);
        setUsers(usersList);
      } catch (err: any) {
        setError("Failed to fetch analytics. " + (err.message || ""));
      }
      setLoading(false);
    }

    fetchStats();
  }, [isAdmin]);

  const handleExportCSV = () => {
    const header = "Email,Referrals,Rewards,Consented\n";
    const rows = users
      .map(
        (u) =>
          `${u.email || ""},${u.referrals},${u.rewards},${u.consented ? "Yes" : "No"}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rewmo-users.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="bg-orange-900/70 rounded-xl shadow-lg px-8 py-6 text-center">
          <h2 className="text-2xl font-bold text-orange-300 mb-2">
            Admin Access Only
          </h2>
          <p className="text-orange-100">You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-orange-50 px-4 py-8">
      {/* Navigation */}
      <nav className="flex gap-6 items-center mb-8">
        <Link href="/dashboard" className="text-orange-400 hover:underline font-semibold">Dashboard</Link>
        <Link href="/rewards" className="text-orange-400 hover:underline font-semibold">Rewards</Link>
        <Link href="/analytics" className="text-orange-400 hover:underline font-semibold">Analytics</Link>
        <Link href="/profile" className="text-orange-400 hover:underline font-semibold">Profile</Link>
        <Link href="/admin" className="text-orange-200 underline font-bold">Admin</Link>
      </nav>

      <h1 className="text-3xl font-extrabold mb-8 text-orange-400">Rewmo Admin Dashboard</h1>

      {loading ? (
        <div className="text-center text-orange-200 text-lg py-12">
          Loading live analytics...
        </div>
      ) : error ? (
        <div className="text-red-400 bg-white/10 rounded-xl p-4 mb-8">{error}</div>
      ) : (
        <>
          {/* Analytics Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {/* User Growth */}
            <div className="bg-orange-400/10 rounded-xl p-6 shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-300">{userCount}</div>
              <div className="text-lg text-orange-200 mt-2">Total Users</div>
            </div>
            {/* Referrals */}
            <div className="bg-orange-400/10 rounded-xl p-6 shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-300">{referralCount}</div>
              <div className="text-lg text-orange-200 mt-2">Referrals</div>
            </div>
            {/* Total Rewards */}
            <div className="bg-orange-400/10 rounded-xl p-6 shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-300">{totalRewards}</div>
              <div className="text-lg text-orange-200 mt-2">Rewards Points Awarded</div>
            </div>
            {/* Affiliate Analytics */}
            <div className="bg-orange-400/10 rounded-xl p-6 shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-300">{affiliateClicks}</div>
              <div className="text-lg text-orange-200 mt-2">Affiliate Clicks</div>
            </div>
            <div className="bg-orange-400/10 rounded-xl p-6 shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-300">{affiliatePurchases}</div>
              <div className="text-lg text-orange-200 mt-2">Affiliate Purchases</div>
            </div>
            <div className="bg-orange-400/10 rounded-xl p-6 shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-300">${affiliateRevenue.toFixed(2)}</div>
              <div className="text-lg text-orange-200 mt-2">Affiliate Revenue</div>
            </div>
            {/* Compliance */}
            <div className="bg-orange-400/10 rounded-xl p-6 shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-300">
                {userCount === 0 ? 0 : ((consentedUsers / userCount) * 100).toFixed(1)}%
              </div>
              <div className="text-lg text-orange-200 mt-2">Consented to Terms</div>
            </div>
            <div className="bg-orange-400/10 rounded-xl p-6 shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-300">
                {userCount === 0 ? 0 : ((disclosureViews / userCount) * 100).toFixed(1)}%
              </div>
              <div className="text-lg text-orange-200 mt-2">Viewed Disclosure</div>
            </div>
          </div>
          {/* Users Table */}
          <div className="bg-orange-500/10 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-orange-300">Sample Users</h2>
              <button
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded text-white font-semibold shadow"
                onClick={handleExportCSV}
              >
                Export CSV
              </button>
            </div>
            <table className="w-full text-orange-100 border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="text-left">Email</th>
                  <th>Referrals</th>
                  <th>Rewards</th>
                  <th>Consented</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((u, i) => (
                  <tr key={i} className="bg-orange-800/20 rounded">
                    <td className="py-1">{u.email || <span className="text-orange-700">N/A</span>}</td>
                    <td className="text-center">{u.referrals}</td>
                    <td className="text-center">{u.rewards}</td>
                    <td className="text-center">{u.consented ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-orange-300 mt-2 text-sm">
              Showing {Math.min(users.length, 10)} of {users.length} users.
            </div>
          </div>
          {/* Compliance/Info */}
          <div className="bg-orange-800/20 rounded-xl p-4 text-orange-200 text-sm mb-12">
            <b>SEC Compliance Note:</b> All user data is managed per US data security guidelines. Consents/disclosures are logged for RegCF. For full analytics, connect Firestore queries.
          </div>
        </>
      )}
    </div>
  );
}
