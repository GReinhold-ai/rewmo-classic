// src/pages/admin/affiliate.tsx
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { collection, query, getDocs, orderBy, limit, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

interface AffiliateStats {
  totalClicks: number;
  totalCommissions: number;
  totalGrossRevenue: number;
  totalMemberShare: number;
  totalRewmoShare: number;
  pendingCommissions: number;
  approvedCommissions: number;
  paidCommissions: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
  conversionRate: number;
}

interface RecentActivity {
  id: string;
  type: "click" | "commission";
  memberId: string;
  network: string;
  retailerId?: string;
  amount?: number;
  timestamp: Date;
}

interface NetworkBreakdown {
  network: string;
  clicks: number;
  commissions: number;
  revenue: number;
}

export default function AdminAffiliateDashboard() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [networkBreakdown, setNetworkBreakdown] = useState<NetworkBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const getDateFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "30d":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "90d":
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const dateFilter = getDateFilter();
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Fetch all clicks
      const clicksRef = collection(db, "affiliateClicks");
      const clicksSnap = await getDocs(clicksRef);
      const allClicks = clicksSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickedAt: doc.data().clickedAt?.toDate?.() || new Date(),
      }));

      // Fetch all commissions
      const commissionsRef = collection(db, "affiliateCommissions");
      const commissionsSnap = await getDocs(commissionsRef);
      const allCommissions = commissionsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));

      // Filter by date range
      const filteredClicks = dateFilter
        ? allClicks.filter(c => c.clickedAt >= dateFilter)
        : allClicks;
      const filteredCommissions = dateFilter
        ? allCommissions.filter(c => c.createdAt >= dateFilter)
        : allCommissions;

      // Calculate stats
      const totalGrossRevenue = filteredCommissions.reduce((sum, c: any) => sum + (c.grossAmount || 0), 0);
      const totalMemberShare = filteredCommissions.reduce((sum, c: any) => sum + (c.memberShare || 0), 0);
      const totalRewmoShare = filteredCommissions.reduce((sum, c: any) => sum + (c.rewmoShare || 0), 0);

      const pendingCommissions = filteredCommissions.filter((c: any) => c.status === "pending").length;
      const approvedCommissions = filteredCommissions.filter((c: any) => c.status === "approved").length;
      const paidCommissions = filteredCommissions.filter((c: any) => c.status === "paid").length;

      const clicksToday = allClicks.filter(c => c.clickedAt >= todayStart).length;
      const clicksThisWeek = allClicks.filter(c => c.clickedAt >= weekStart).length;
      const clicksThisMonth = allClicks.filter(c => c.clickedAt >= monthStart).length;

      const conversionRate = filteredClicks.length > 0
        ? (filteredCommissions.length / filteredClicks.length) * 100
        : 0;

      setStats({
        totalClicks: filteredClicks.length,
        totalCommissions: filteredCommissions.length,
        totalGrossRevenue,
        totalMemberShare,
        totalRewmoShare,
        pendingCommissions,
        approvedCommissions,
        paidCommissions,
        clicksToday,
        clicksThisWeek,
        clicksThisMonth,
        conversionRate,
      });

      // Network breakdown
      const networks = ["amazon", "impact", "awin"];
      const breakdown: NetworkBreakdown[] = networks.map(network => ({
        network,
        clicks: filteredClicks.filter((c: any) => c.network === network).length,
        commissions: filteredCommissions.filter((c: any) => c.network === network).length,
        revenue: filteredCommissions
          .filter((c: any) => c.network === network)
          .reduce((sum, c: any) => sum + (c.grossAmount || 0), 0),
      }));
      setNetworkBreakdown(breakdown);

      // Recent activity (last 20 items)
      const recentClicks: RecentActivity[] = allClicks
        .slice(0, 10)
        .map(c => ({
          id: c.id,
          type: "click" as const,
          memberId: (c as any).memberId || "unknown",
          network: (c as any).network || "unknown",
          retailerId: (c as any).retailerId,
          timestamp: c.clickedAt,
        }));

      const recentCommissions: RecentActivity[] = allCommissions
        .slice(0, 10)
        .map(c => ({
          id: c.id,
          type: "commission" as const,
          memberId: (c as any).memberId || "unknown",
          network: (c as any).network || "unknown",
          amount: (c as any).grossAmount,
          timestamp: c.createdAt,
        }));

      const combined = [...recentClicks, ...recentCommissions]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 15);

      setRecentActivity(combined);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert("Error loading dashboard: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (date: Date) => date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getNetworkIcon = (network: string) => {
    switch (network) {
      case "amazon": return "🛒";
      case "impact": return "💫";
      case "awin": return "🔗";
      default: return "📦";
    }
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case "amazon": return "bg-orange-500";
      case "impact": return "bg-purple-500";
      case "awin": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  // CSV Export
  const exportSummaryCSV = () => {
    if (!stats) return;
    const header = "Metric,Value\n";
    const rows = [
      `Total Clicks,${stats.totalClicks}`,
      `Total Commissions,${stats.totalCommissions}`,
      `Gross Revenue,${formatCurrency(stats.totalGrossRevenue)}`,
      `Member Share (50%),${formatCurrency(stats.totalMemberShare)}`,
      `Rewmo Share (50%),${formatCurrency(stats.totalRewmoShare)}`,
      `Conversion Rate,${stats.conversionRate.toFixed(2)}%`,
      `Pending Commissions,${stats.pendingCommissions}`,
      `Approved Commissions,${stats.approvedCommissions}`,
      `Paid Commissions,${stats.paidCommissions}`,
    ].join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rewmoai-affiliate-summary-${dateRange}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto py-10 px-4 bg-white text-gray-900 min-h-screen">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading affiliate dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-10 px-4 bg-white text-gray-900 min-h-screen">
      <Head>
        <title>Affiliate Dashboard | RewmoAI Admin</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-orange-600 mb-2">
            Affiliate Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of affiliate clicks, commissions, and revenue
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <button
            onClick={exportSummaryCSV}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-4 mb-8">
        <Link
          href="/admin/commissions"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition"
        >
          📋 Manage Commissions
        </Link>
        <Link
          href="/admin/payouts"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition"
        >
          💳 Process Payouts
        </Link>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <p className="text-green-700 text-sm font-medium mb-1">Gross Revenue</p>
          <p className="text-3xl font-bold text-green-800">
            {formatCurrency(stats?.totalGrossRevenue || 0)}
          </p>
          <p className="text-xs text-green-600 mt-1">Total commissions earned</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <p className="text-blue-700 text-sm font-medium mb-1">Rewmo Share (50%)</p>
          <p className="text-3xl font-bold text-blue-800">
            {formatCurrency(stats?.totalRewmoShare || 0)}
          </p>
          <p className="text-xs text-blue-600 mt-1">Your revenue</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <p className="text-purple-700 text-sm font-medium mb-1">Member Share (50%)</p>
          <p className="text-3xl font-bold text-purple-800">
            {formatCurrency(stats?.totalMemberShare || 0)}
          </p>
          <p className="text-xs text-purple-600 mt-1">Owed to members</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <p className="text-orange-700 text-sm font-medium mb-1">Conversion Rate</p>
          <p className="text-3xl font-bold text-orange-800">
            {stats?.conversionRate.toFixed(2)}%
          </p>
          <p className="text-xs text-orange-600 mt-1">Clicks → Purchases</p>
        </div>
      </div>

      {/* Click & Commission Stats */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Click Stats */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Click Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <p className="text-3xl font-bold text-cyan-600">{stats?.clicksToday || 0}</p>
              <p className="text-sm text-gray-500">Today</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <p className="text-3xl font-bold text-cyan-600">{stats?.clicksThisWeek || 0}</p>
              <p className="text-sm text-gray-500">This Week</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <p className="text-3xl font-bold text-cyan-600">{stats?.clicksThisMonth || 0}</p>
              <p className="text-sm text-gray-500">This Month</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Clicks ({dateRange})</span>
              <span className="text-2xl font-bold text-gray-800">{stats?.totalClicks || 0}</span>
            </div>
          </div>
        </div>

        {/* Commission Status */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💰 Commission Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="text-yellow-800">Pending</span>
              </span>
              <span className="text-xl font-bold text-yellow-800">{stats?.pendingCommissions || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-800">Approved</span>
              </span>
              <span className="text-xl font-bold text-green-800">{stats?.approvedCommissions || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="text-blue-800">Paid</span>
              </span>
              <span className="text-xl font-bold text-blue-800">{stats?.paidCommissions || 0}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Commissions</span>
              <span className="text-2xl font-bold text-gray-800">{stats?.totalCommissions || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Breakdown */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🌐 Network Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600 border-b border-gray-300">
                <th className="pb-3 pr-4">Network</th>
                <th className="pb-3 pr-4 text-right">Clicks</th>
                <th className="pb-3 pr-4 text-right">Commissions</th>
                <th className="pb-3 pr-4 text-right">Revenue</th>
                <th className="pb-3 text-right">Conv. Rate</th>
              </tr>
            </thead>
            <tbody>
              {networkBreakdown.map((network) => (
                <tr key={network.network} className="border-b border-gray-100">
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${getNetworkColor(network.network)}`}></span>
                      <span className="text-2xl">{getNetworkIcon(network.network)}</span>
                      <span className="font-medium capitalize">{network.network}</span>
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right font-medium">{network.clicks}</td>
                  <td className="py-3 pr-4 text-right font-medium">{network.commissions}</td>
                  <td className="py-3 pr-4 text-right font-bold text-green-600">
                    {formatCurrency(network.revenue)}
                  </td>
                  <td className="py-3 text-right text-gray-600">
                    {network.clicks > 0
                      ? ((network.commissions / network.clicks) * 100).toFixed(1)
                      : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🕐 Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No recent activity</p>
        ) : (
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    activity.type === "click"
                      ? "bg-cyan-100 text-cyan-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {activity.type === "click" ? "CLICK" : "COMMISSION"}
                  </span>
                  <span className="text-xl">{getNetworkIcon(activity.network)}</span>
                  <span className="text-gray-600 text-sm">
                    Member: <span className="font-mono">{activity.memberId.substring(0, 12)}...</span>
                  </span>
                  {activity.retailerId && (
                    <span className="text-gray-400 text-sm">
                      → {activity.retailerId}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {activity.amount && (
                    <span className="font-bold text-green-600">
                      {formatCurrency(activity.amount)}
                    </span>
                  )}
                  <span className="text-sm text-gray-400">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 text-center">
          <Link
            href="/admin/commissions"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            View All Commissions →
          </Link>
        </div>
      </div>
    </main>
  );
}
