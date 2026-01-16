// src/pages/admin/commissions.tsx
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { collection, getDocs, doc, updateDoc, Timestamp, serverTimestamp, increment } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

interface Commission {
  id: string;
  memberId: string;
  memberEmail?: string;
  retailerId?: string;
  network: "amazon" | "impact" | "awin";
  orderId: string;
  subId: string;
  grossAmount: number;
  memberShare: number;
  rewmoShare: number;
  status: "pending" | "approved" | "paid";
  orderDate?: Date;
  createdAt: Date;
  paidAt?: Date;
}

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "paid">("all");
  const [networkFilter, setNetworkFilter] = useState<"all" | "amazon" | "impact" | "awin">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const commissionsRef = collection(db, "affiliateCommissions");
      const snapshot = await getDocs(commissionsRef);

      const commissionsData: Commission[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        commissionsData.push({
          id: docSnap.id,
          memberId: data.memberId || "unknown",
          memberEmail: data.memberEmail,
          retailerId: data.retailerId,
          network: data.network || "unknown",
          orderId: data.orderId || "",
          subId: data.subId || "",
          grossAmount: data.grossAmount || 0,
          memberShare: data.memberShare || 0,
          rewmoShare: data.rewmoShare || 0,
          status: data.status || "pending",
          orderDate: data.orderDate?.toDate?.(),
          createdAt: data.createdAt?.toDate?.() || new Date(),
          paidAt: data.paidAt?.toDate?.(),
        });
      }

      // Sort by createdAt descending
      commissionsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setCommissions(commissionsData);
    } catch (error) {
      console.error("Error fetching commissions:", error);
      alert("Error loading commissions: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Filter commissions
  const filteredCommissions = commissions.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (networkFilter !== "all" && c.network !== networkFilter) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        c.memberId.toLowerCase().includes(search) ||
        c.orderId.toLowerCase().includes(search) ||
        c.subId.toLowerCase().includes(search) ||
        (c.memberEmail?.toLowerCase().includes(search) ?? false)
      );
    }
    return true;
  });

  // Approve a commission
  const approveCommission = async (commission: Commission) => {
    if (commission.status !== "pending") return;

    try {
      setProcessing(commission.id);
      const commissionRef = doc(db, "affiliateCommissions", commission.id);
      await updateDoc(commissionRef, {
        status: "approved",
      });

      // Update local state
      setCommissions((prev) =>
        prev.map((c) =>
          c.id === commission.id ? { ...c, status: "approved" } : c
        )
      );

      alert(`Commission ${commission.orderId} approved!`);
    } catch (error) {
      console.error("Error approving commission:", error);
      alert("Error approving: " + (error as Error).message);
    } finally {
      setProcessing(null);
    }
  };

  // Mark commission as paid
  const markAsPaid = async (commission: Commission) => {
    if (commission.status === "paid") return;

    try {
      setProcessing(commission.id);

      // Update commission status
      const commissionRef = doc(db, "affiliateCommissions", commission.id);
      await updateDoc(commissionRef, {
        status: "paid",
        paidAt: serverTimestamp(),
      });

      // Update member's balances
      if (commission.memberId && commission.memberId !== "unknown") {
        const userRef = doc(db, "users", commission.memberId);
        await updateDoc(userRef, {
          affiliatePendingBalance: increment(-commission.memberShare),
          affiliatePaidBalance: increment(commission.memberShare),
        });
      }

      // Update local state
      setCommissions((prev) =>
        prev.map((c) =>
          c.id === commission.id
            ? { ...c, status: "paid", paidAt: new Date() }
            : c
        )
      );

      alert(`Commission ${commission.orderId} marked as paid!`);
    } catch (error) {
      console.error("Error marking as paid:", error);
      alert("Error: " + (error as Error).message);
    } finally {
      setProcessing(null);
    }
  };

  // Bulk approve
  const bulkApprove = async () => {
    const toApprove = filteredCommissions.filter(
      (c) => selectedIds.has(c.id) && c.status === "pending"
    );

    if (toApprove.length === 0) {
      alert("No pending commissions selected");
      return;
    }

    if (!confirm(`Approve ${toApprove.length} commission(s)?`)) return;

    try {
      setProcessing("bulk");
      for (const commission of toApprove) {
        const commissionRef = doc(db, "affiliateCommissions", commission.id);
        await updateDoc(commissionRef, { status: "approved" });
      }

      setCommissions((prev) =>
        prev.map((c) =>
          selectedIds.has(c.id) && c.status === "pending"
            ? { ...c, status: "approved" }
            : c
        )
      );

      setSelectedIds(new Set());
      alert(`${toApprove.length} commission(s) approved!`);
    } catch (error) {
      alert("Error: " + (error as Error).message);
    } finally {
      setProcessing(null);
    }
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Select all visible
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCommissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCommissions.map((c) => c.id)));
    }
  };

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
            Approved
          </span>
        );
      case "paid":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
            Paid
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

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

  // Export to CSV
  const exportCSV = () => {
    const header =
      "Commission ID,Member ID,Network,Order ID,Gross Amount,Member Share,Rewmo Share,Status,Created At,Paid At\n";
    const rows = filteredCommissions
      .map(
        (c) =>
          `${c.id},${c.memberId},${c.network},${c.orderId},${formatCurrency(c.grossAmount)},${formatCurrency(c.memberShare)},${formatCurrency(c.rewmoShare)},${c.status},"${formatDate(c.createdAt)}","${c.paidAt ? formatDate(c.paidAt) : ""}"`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rewmoai-commissions-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Summary stats
  const stats = {
    total: filteredCommissions.length,
    pending: filteredCommissions.filter((c) => c.status === "pending").length,
    approved: filteredCommissions.filter((c) => c.status === "approved").length,
    paid: filteredCommissions.filter((c) => c.status === "paid").length,
    totalGross: filteredCommissions.reduce((sum, c) => sum + c.grossAmount, 0),
    totalMemberShare: filteredCommissions.reduce((sum, c) => sum + c.memberShare, 0),
  };

  return (
    <main className="max-w-7xl mx-auto py-10 px-4 bg-white text-gray-900 min-h-screen">
      <Head>
        <title>Commissions Management | RewmoAI Admin</title>
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
          <h1 className="text-3xl font-bold text-orange-600">
            Commission Management
          </h1>
          <p className="text-gray-600">
            Review, approve, and manage affiliate commissions
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={fetchCommissions}
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

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-gray-50 border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
          <p className="text-sm text-green-600">Approved</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.paid}</p>
          <p className="text-sm text-blue-600">Paid</p>
        </div>
        <div className="bg-gray-50 border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalGross)}</p>
          <p className="text-sm text-gray-500">Gross</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">{formatCurrency(stats.totalMemberShare)}</p>
          <p className="text-sm text-purple-600">Member Share</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by member ID, order ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
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

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="mt-4 pt-4 border-t flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedIds.size} selected
            </span>
            <button
              onClick={bulkApprove}
              disabled={processing === "bulk"}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            >
              {processing === "bulk" ? "Processing..." : "✓ Approve Selected"}
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Commissions Table */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading commissions...</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 border-b">
                  <th className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredCommissions.length && filteredCommissions.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Network</th>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4 text-right">Gross</th>
                  <th className="py-3 px-4 text-right">Member Share</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400">
                      No commissions found
                    </td>
                  </tr>
                ) : (
                  filteredCommissions.map((commission) => (
                    <tr
                      key={commission.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(commission.id)}
                          onChange={() => toggleSelect(commission.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(commission.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        {getNetworkBadge(commission.network)}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {commission.orderId.length > 20
                          ? `${commission.orderId.substring(0, 20)}...`
                          : commission.orderId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs">
                          <div className="font-mono text-gray-600">
                            {commission.memberId.substring(0, 12)}...
                          </div>
                          {commission.memberEmail && (
                            <div className="text-gray-400">
                              {commission.memberEmail}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(commission.grossAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-green-600">
                        {formatCurrency(commission.memberShare)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(commission.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {commission.status === "pending" && (
                            <button
                              onClick={() => approveCommission(commission)}
                              disabled={processing === commission.id}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-xs font-medium disabled:opacity-50"
                            >
                              {processing === commission.id
                                ? "..."
                                : "Approve"}
                            </button>
                          )}
                          {commission.status === "approved" && (
                            <button
                              onClick={() => markAsPaid(commission)}
                              disabled={processing === commission.id}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs font-medium disabled:opacity-50"
                            >
                              {processing === commission.id
                                ? "..."
                                : "Mark Paid"}
                            </button>
                          )}
                          {commission.status === "paid" && commission.paidAt && (
                            <span className="text-xs text-gray-400">
                              Paid {formatDate(commission.paidAt)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
