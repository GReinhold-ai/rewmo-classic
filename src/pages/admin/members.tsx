// src/pages/admin/members.tsx
// Admin Dashboard - Track members, signups, and tier breakdown
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { collection, query, orderBy, getDocs, where, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebaseClient";

interface Member {
  uid: string;
  email: string;
  displayName: string;
  tier: string;
  createdAt: Date | null;
  lastLoginAt: Date | null;
  rewards: number;
  referralCount: number;
}

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  tiers: {
    FREE: number;
    PRO: number;
    BUSINESS: number;
  };
  totalRewards: number;
  totalReferrals: number;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [tierFilter, setTierFilter] = useState<"all" | "FREE" | "PRO" | "BUSINESS">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Wait for auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthReady(true);
      } else {
        window.location.href = "/account";
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch members data
  useEffect(() => {
    if (!authReady) return;

    async function fetchMembers() {
      setLoading(true);
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - 7);
        const monthStart = new Date(todayStart);
        monthStart.setDate(monthStart.getDate() - 30);

        const membersList: Member[] = [];
        let todayCount = 0;
        let weekCount = 0;
        let monthCount = 0;
        const tierCounts = { FREE: 0, PRO: 0, BUSINESS: 0 };
        let totalRewards = 0;
        let totalReferrals = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate?.() || null;
          const lastLoginAt = data.lastLoginAt?.toDate?.() || null;
          const tier = (data.tier || "FREE").toUpperCase();

          membersList.push({
            uid: doc.id,
            email: data.email || "",
            displayName: data.displayName || data.email?.split("@")[0] || "Unknown",
            tier,
            createdAt,
            lastLoginAt,
            rewards: data.rewards || data.rewardPoints || 0,
            referralCount: data.referralCount || 0,
          });

          // Count by time period
          if (createdAt) {
            if (createdAt >= todayStart) todayCount++;
            if (createdAt >= weekStart) weekCount++;
            if (createdAt >= monthStart) monthCount++;
          }

          // Count by tier
          if (tier === "PRO") tierCounts.PRO++;
          else if (tier === "BUSINESS") tierCounts.BUSINESS++;
          else tierCounts.FREE++;

          // Totals
          totalRewards += data.rewards || data.rewardPoints || 0;
          totalReferrals += data.referralCount || 0;
        });

        setMembers(membersList);
        setStats({
          total: membersList.length,
          today: todayCount,
          thisWeek: weekCount,
          thisMonth: monthCount,
          tiers: tierCounts,
          totalRewards,
          totalReferrals,
        });
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [authReady]);

  // Filter members
  const filteredMembers = members.filter((m) => {
    // Time filter
    if (filter !== "all" && m.createdAt) {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(todayStart);
      weekStart.setDate(weekStart.getDate() - 7);
      const monthStart = new Date(todayStart);
      monthStart.setDate(monthStart.getDate() - 30);

      if (filter === "today" && m.createdAt < todayStart) return false;
      if (filter === "week" && m.createdAt < weekStart) return false;
      if (filter === "month" && m.createdAt < monthStart) return false;
    }

    // Tier filter
    if (tierFilter !== "all" && m.tier !== tierFilter) return false;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        m.email.toLowerCase().includes(search) ||
        m.displayName.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "PRO":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "BUSINESS":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading || !authReady) {
    return (
      <main className="max-w-7xl mx-auto py-10 px-4 bg-[#003B49] text-white min-h-screen">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9151] mx-auto mb-4"></div>
          <p className="text-white/60">Loading members data...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>Members Dashboard | RewmoAI Admin</title>
      </Head>

      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#FF9151]">Members Dashboard</h1>
            <p className="text-white/60 mt-1">Track signups, members, and growth</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/affiliate"
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
            >
              Affiliate Dashboard
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
            >
              ← Home
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {/* Total Members */}
            <div className="bg-gradient-to-br from-[#FF9151]/20 to-[#FF9151]/5 border border-[#FF9151]/30 rounded-xl p-4">
              <p className="text-white/60 text-sm">Total Members</p>
              <p className="text-3xl font-bold text-[#FF9151]">{stats.total}</p>
            </div>

            {/* Today */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/60 text-sm">Today</p>
              <p className="text-3xl font-bold text-green-400">+{stats.today}</p>
            </div>

            {/* This Week */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/60 text-sm">This Week</p>
              <p className="text-3xl font-bold text-[#15C5C1]">+{stats.thisWeek}</p>
            </div>

            {/* This Month */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/60 text-sm">This Month</p>
              <p className="text-3xl font-bold text-white">+{stats.thisMonth}</p>
            </div>

            {/* Total Rewards */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/60 text-sm">Total Rewards</p>
              <p className="text-2xl font-bold text-yellow-400">{formatCurrency(stats.totalRewards)}</p>
            </div>

            {/* Total Referrals */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/60 text-sm">Referrals</p>
              <p className="text-3xl font-bold text-pink-400">{stats.totalReferrals}</p>
            </div>
          </div>
        )}

        {/* Tier Breakdown */}
        {stats && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Membership Tiers</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-400">{stats.tiers.FREE}</p>
                <p className="text-white/60">Free</p>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-400"
                    style={{ width: `${(stats.tiers.FREE / stats.total) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-400">{stats.tiers.PRO}</p>
                <p className="text-white/60">Pro ($10/mo)</p>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400"
                    style={{ width: `${(stats.tiers.PRO / stats.total) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-400">{stats.tiers.BUSINESS}</p>
                <p className="text-white/60">Business ($125/mo)</p>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400"
                    style={{ width: `${(stats.tiers.BUSINESS / stats.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* MRR Estimate */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-white/60 text-sm">Estimated MRR</p>
              <p className="text-2xl font-bold text-green-400">
                ${(stats.tiers.PRO * 10 + stats.tiers.BUSINESS * 125).toLocaleString()}/mo
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Time Filter */}
          <div className="flex gap-2">
            {(["all", "today", "week", "month"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? "bg-[#FF9151] text-[#003B49]"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {f === "all" ? "All Time" : f === "today" ? "Today" : f === "week" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>

          {/* Tier Filter */}
          <div className="flex gap-2">
            {(["all", "FREE", "PRO", "BUSINESS"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  tierFilter === t
                    ? "bg-[#15C5C1] text-[#003B49]"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {t === "all" ? "All Tiers" : t}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-[#FF9151] w-64"
          />
        </div>

        {/* Members Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-4 py-3 text-white/60 font-medium">Member</th>
                  <th className="text-left px-4 py-3 text-white/60 font-medium">Tier</th>
                  <th className="text-left px-4 py-3 text-white/60 font-medium">Joined</th>
                  <th className="text-left px-4 py-3 text-white/60 font-medium">Last Login</th>
                  <th className="text-right px-4 py-3 text-white/60 font-medium">Rewards</th>
                  <th className="text-right px-4 py-3 text-white/60 font-medium">Referrals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMembers.slice(0, 50).map((member) => (
                  <tr key={member.uid} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{member.displayName}</p>
                        <p className="text-sm text-white/50">{member.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getTierBadge(
                          member.tier
                        )}`}
                      >
                        {member.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/70 text-sm">
                      {formatDate(member.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-white/70 text-sm">
                      {formatDate(member.lastLoginAt)}
                    </td>
                    <td className="px-4 py-3 text-right text-yellow-400 font-medium">
                      {formatCurrency(member.rewards)}
                    </td>
                    <td className="px-4 py-3 text-right text-pink-400 font-medium">
                      {member.referralCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60">No members found matching your filters</p>
            </div>
          )}

          {filteredMembers.length > 50 && (
            <div className="text-center py-4 border-t border-white/10">
              <p className="text-white/60 text-sm">
                Showing 50 of {filteredMembers.length} members
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => {
              const csv = [
                ["Email", "Name", "Tier", "Joined", "Rewards", "Referrals"].join(","),
                ...filteredMembers.map((m) =>
                  [
                    m.email,
                    m.displayName,
                    m.tier,
                    m.createdAt?.toISOString() || "",
                    m.rewards,
                    m.referralCount,
                  ].join(",")
                ),
              ].join("\n");

              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `rewmoai-members-${new Date().toISOString().split("T")[0]}.csv`;
              a.click();
            }}
            className="px-4 py-2 bg-[#15C5C1] text-[#003B49] rounded-lg font-bold hover:bg-[#0fb5b1] transition"
          >
            📥 Export CSV
          </button>
        </div>
      </main>
    </div>
  );
}
