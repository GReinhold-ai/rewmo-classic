// src/pages/admin/clicks.tsx
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

interface AffiliateClick {
  id: string;
  memberId: string;
  retailerId: string;
  network: "amazon" | "impact" | "awin";
  subId: string;
  clickedAt: Date;
  userAgent?: string;
  converted?: boolean;
}

export default function AdminClicksPage() {
  const [clicks, setClicks] = useState<AffiliateClick[]>([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  // Filters
  const [networkFilter, setNetworkFilter] = useState<"all" | "amazon" | "impact" | "awin">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  // Wait for auth to initialize
  useEffect(() => {
    const { onAuthStateChanged } = require("firebase/auth");
    const { auth } = require("@/lib/firebaseClient");
    
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setAuthReady(true);
      } else {
        window.location.href = "/account";
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authReady) {
      fetchClicks();
    }
  }, [authReady]);

  const fetchClicks = async () => {
    try {
      setLoading(true);
      const clicksRef = collection(db, "affiliateClicks");
      const snapshot = await getDocs(clicksRef);

      const clicksData: AffiliateClick[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          memberId: data.memberId || "unknown",
          retailerId: data.retailerId || "unknown",
          network: data.network || "unknown",
          subId: data.subId || "",
          clickedAt: data.clickedAt?.toDate?.() || new Date(),
          userAgent: data.userAgent,
          converted: data.converted || false,
        };
      });

      // Sort by clickedAt descending
      clicksData.sort((a, b) => b.clickedAt.getTime() - a.clickedAt.getTime());
      setClicks(clicksData);
    } catch (error) {
      console.error("Error fetching clicks:", error);
      alert("Error loading clicks: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

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

  // Filter clicks
  const filteredClicks = clicks.filter((c) => {
    const dateFilter = getDateFilter();
    if (dateFilter && c.clickedAt < dateFilter) return false;
    if (networkFilter !== "all" && c.network !== networkFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        c.memberId.toLowerCase().includes(search) ||
        c.retailerId.toLowerCase().includes(search) ||
        c.subId.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getNetworkBadge = (network: string) => {
    switch (network) {
      case "amazon":
        return (
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            🛒 Amazon
          </span>
        );
      case "impact":
        return (
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            💫 Impact
          </span>
        );
      case "awin":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            🔗 Awin
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
            {network}
          </span>
        );
    }
  };

  // Calculate stats
  const stats = {
    total: filteredClicks.length,
    amazon: filteredClicks.filter((c) => c.network === "amazon").length,
    impact: filteredClicks.filter((c) => c.network === "impact").length,
    awin: filteredClicks.filter((c) => c.network === "awin").length,
    converted: filteredClicks.filter((c) => c.converted).length,
    uniqueMembers: new Set(filteredClicks.map((c) => c.memberId)).size,
    uniqueRetailers: new Set(filteredClicks.map((c) => c.retailerId)).size,
  };

  // Top retailers
  const retailerCounts = filteredClicks.reduce((acc, c) => {
    acc[c.retailerId] = (acc[c.retailerId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topRetailers = Object.entries(retailerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Export CSV
  const exportCSV = () => {
    const header = "Click ID,Member ID,Retailer,Network,Sub ID,Clicked At,Converted\n";
    const rows = filteredClicks
      .map(
        (c) =>
          `${c.id},${c.memberId},${c.retailerId},${c.network},${c.subId},"${formatDate(c.clickedAt)}",${c.converted}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rewmoai-clicks-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-7xl mx-auto py-10 px-4 bg-white text-gray-900 min-h-screen">
      <Head>
        <title>Click Tracking | RewmoAI Admin</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <Link
            href="/admin/affiliate"
            className="text-orange-600 hover:text-orange-700 text-sm mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-orange-600">Click Tracking</h1>
          <p className="text-gray-600">
            View all affiliate link clicks and conversion tracking
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={fetchClicks}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            🔄 Refresh
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
        <div className="bg-gray-50 border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Clicks</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-700">{stats.amazon}</p>
          <p className="text-sm text-orange-600">Amazon</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">{stats.impact}</p>
          <p className="text-sm text-purple-600">Impact</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.awin}</p>
          <p className="text-sm text-blue-600">Awin</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.converted}</p>
          <p className="text-sm text-green-600">Converted</p>
        </div>
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-cyan-700">{stats.uniqueMembers}</p>
          <p className="text-sm text-cyan-600">Members</p>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-pink-700">{stats.uniqueRetailers}</p>
          <p className="text-sm text-pink-600">Retailers</p>
        </div>
      </div>

      {/* Top Retailers */}
      {topRetailers.length > 0 && (
        <div className="bg-gray-50 border rounded-xl p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">🏆 Top Retailers</h3>
          <div className="flex flex-wrap gap-3">
            {topRetailers.map(([retailer, count]) => (
              <div
                key={retailer}
                className="bg-white border rounded-lg px-4 py-2 flex items-center gap-2"
              >
                <span className="font-medium text-gray-800">{retailer}</span>
                <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-50 border rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by member ID, retailer, or sub ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <select
            value={networkFilter}
            onChange={(e) => setNetworkFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Networks</option>
            <option value="amazon">Amazon</option>
            <option value="impact">Impact</option>
            <option value="awin">Awin</option>
          </select>
        </div>
      </div>

      {/* Clicks Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading clicks...</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 border-b">
                  <th className="py-3 px-4">Date/Time</th>
                  <th className="py-3 px-4">Network</th>
                  <th className="py-3 px-4">Retailer</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Sub ID</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredClicks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      No clicks found
                    </td>
                  </tr>
                ) : (
                  filteredClicks.slice(0, 100).map((click) => (
                    <tr key={click.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {formatDate(click.clickedAt)}
                      </td>
                      <td className="py-3 px-4">{getNetworkBadge(click.network)}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {click.retailerId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs text-gray-600">
                          {click.memberId.substring(0, 12)}...
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs text-gray-400">
                          {click.subId.length > 20
                            ? `${click.subId.substring(0, 20)}...`
                            : click.subId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {click.converted ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                            ✓ Converted
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredClicks.length > 100 && (
            <div className="px-4 py-3 bg-gray-50 border-t text-center text-sm text-gray-500">
              Showing 100 of {filteredClicks.length} clicks. Export CSV for full data.
            </div>
          )}
        </div>
      )}
    </main>
  );
}
