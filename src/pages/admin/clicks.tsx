// src/pages/admin/payouts.tsx
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { collection, getDocs, doc, updateDoc, writeBatch, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

interface MemberBalance {
  id: string;
  email?: string;
  displayName?: string;
  affiliatePendingBalance: number;
  affiliatePaidBalance: number;
  affiliateTotalEarnings: number;
  approvedBalance: number; // Calculated: approved but not yet paid
  pendingCommissionsCount: number;
  approvedCommissionsCount: number;
  lastActivity?: Date;
}

interface PayoutRecord {
  id: string;
  memberId: string;
  memberEmail?: string;
  amount: number;
  method: "paypal" | "bank" | "check" | "other";
  reference?: string;
  notes?: string;
  createdAt: Date;
}

export default function AdminPayoutsPage() {
  const [members, setMembers] = useState<MemberBalance[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // Payout modal
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberBalance | null>(null);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState<"paypal" | "bank" | "check" | "other">("paypal");
  const [payoutReference, setPayoutReference] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");

  // Filters
  const [minBalance, setMinBalance] = useState(2500); // $25 minimum
  const [sortBy, setSortBy] = useState<"balance" | "name" | "earnings">("balance");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all users
      const usersRef = collection(db, "users");
      const usersSnap = await getDocs(usersRef);

      // Fetch all commissions to calculate approved balance
      const commissionsRef = collection(db, "affiliateCommissions");
      const commissionsSnap = await getDocs(commissionsRef);

      const commissionsByMember: Record<string, { pending: number; approved: number; pendingCount: number; approvedCount: number }> = {};

      commissionsSnap.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const memberId = data.memberId;
        if (!memberId || memberId === "unknown") return;

        if (!commissionsByMember[memberId]) {
          commissionsByMember[memberId] = { pending: 0, approved: 0, pendingCount: 0, approvedCount: 0 };
        }

        if (data.status === "pending") {
          commissionsByMember[memberId].pending += data.memberShare || 0;
          commissionsByMember[memberId].pendingCount++;
        } else if (data.status === "approved") {
          commissionsByMember[memberId].approved += data.memberShare || 0;
          commissionsByMember[memberId].approvedCount++;
        }
      });

      // Build member balances
      const membersData: MemberBalance[] = [];

      usersSnap.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const pendingBalance = data.affiliatePendingBalance || 0;
        const paidBalance = data.affiliatePaidBalance || 0;
        const totalEarnings = data.affiliateTotalEarnings || 0;

        // Only include members with affiliate activity
        if (totalEarnings > 0 || commissionsByMember[docSnap.id]) {
          const commissions = commissionsByMember[docSnap.id] || { pending: 0, approved: 0, pendingCount: 0, approvedCount: 0 };

          membersData.push({
            id: docSnap.id,
            email: data.email,
            displayName: data.displayName,
            affiliatePendingBalance: pendingBalance,
            affiliatePaidBalance: paidBalance,
            affiliateTotalEarnings: totalEarnings,
            approvedBalance: commissions.approved,
            pendingCommissionsCount: commissions.pendingCount,
            approvedCommissionsCount: commissions.approvedCount,
            lastActivity: data.lastLogin?.toDate?.(),
          });
        }
      });

      setMembers(membersData);

      // Fetch payout history
      const payoutsRef = collection(db, "affiliatePayouts");
      const payoutsSnap = await getDocs(payoutsRef);
      const payoutsData: PayoutRecord[] = payoutsSnap.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          memberId: data.memberId,
          memberEmail: data.memberEmail,
          amount: data.amount || 0,
          method: data.method || "other",
          reference: data.reference,
          notes: data.notes,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        };
      });

      payoutsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setPayoutHistory(payoutsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error loading data: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Sort and filter members
  const filteredMembers = members
    .filter((m) => m.approvedBalance >= minBalance)
    .sort((a, b) => {
      switch (sortBy) {
        case "balance":
          return b.approvedBalance - a.approvedBalance;
        case "earnings":
          return b.affiliateTotalEarnings - a.affiliateTotalEarnings;
        case "name":
          return (a.displayName || a.email || "").localeCompare(b.displayName || b.email || "");
        default:
          return 0;
      }
    });

  // Open payout modal
  const openPayoutModal = (member: MemberBalance) => {
    setSelectedMember(member);
    setPayoutAmount((member.approvedBalance / 100).toFixed(2));
    setPayoutMethod("paypal");
    setPayoutReference("");
    setPayoutNotes("");
    setShowPayoutModal(true);
  };

  // Process payout
  const processPayout = async () => {
    if (!selectedMember) return;

    const amountCents = Math.round(parseFloat(payoutAmount) * 100);
    if (isNaN(amountCents) || amountCents <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (amountCents > selectedMember.approvedBalance) {
      alert("Amount exceeds approved balance");
      return;
    }

    if (!confirm(`Process payout of $${payoutAmount} to ${selectedMember.email || selectedMember.id}?`)) {
      return;
    }

    try {
      setProcessing(selectedMember.id);

      const batch = writeBatch(db);

      // 1. Create payout record
      const payoutRef = doc(collection(db, "affiliatePayouts"));
      batch.set(payoutRef, {
        memberId: selectedMember.id,
        memberEmail: selectedMember.email,
        amount: amountCents,
        method: payoutMethod,
        reference: payoutReference || null,
        notes: payoutNotes || null,
        createdAt: serverTimestamp(),
      });

      // 2. Update user balance
      const userRef = doc(db, "users", selectedMember.id);
      batch.update(userRef, {
        affiliatePaidBalance: (selectedMember.affiliatePaidBalance || 0) + amountCents,
      });

      // 3. Mark approved commissions as paid
      const commissionsRef = collection(db, "affiliateCommissions");
      const approvedQuery = query(
        commissionsRef,
        where("memberId", "==", selectedMember.id),
        where("status", "==", "approved")
      );
      const approvedSnap = await getDocs(approvedQuery);

      let remaining = amountCents;
      for (const docSnap of approvedSnap.docs) {
        if (remaining <= 0) break;
        const data = docSnap.data();
        const memberShare = data.memberShare || 0;

        if (memberShare <= remaining) {
          batch.update(docSnap.ref, {
            status: "paid",
            paidAt: serverTimestamp(),
          });
          remaining -= memberShare;
        }
      }

      await batch.commit();

      // Update local state
      setMembers((prev) =>
        prev.map((m) =>
          m.id === selectedMember.id
            ? {
                ...m,
                approvedBalance: m.approvedBalance - amountCents,
                affiliatePaidBalance: m.affiliatePaidBalance + amountCents,
              }
            : m
        )
      );

      setPayoutHistory((prev) => [
        {
          id: payoutRef.id,
          memberId: selectedMember.id,
          memberEmail: selectedMember.email,
          amount: amountCents,
          method: payoutMethod,
          reference: payoutReference,
          notes: payoutNotes,
          createdAt: new Date(),
        },
        ...prev,
      ]);

      setShowPayoutModal(false);
      alert("Payout processed successfully!");
    } catch (error) {
      console.error("Error processing payout:", error);
      alert("Error: " + (error as Error).message);
    } finally {
      setProcessing(null);
    }
  };

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // Summary stats
  const stats = {
    totalMembers: members.length,
    membersReadyForPayout: filteredMembers.length,
    totalApprovedOwed: members.reduce((sum, m) => sum + m.approvedBalance, 0),
    totalPendingOwed: members.reduce((sum, m) => sum + m.affiliatePendingBalance, 0),
    totalPaid: members.reduce((sum, m) => sum + m.affiliatePaidBalance, 0),
  };

  // Export members for payout
  const exportPayoutCSV = () => {
    const header = "Member ID,Email,Name,Approved Balance,Pending Balance,Total Paid,Total Earnings\n";
    const rows = filteredMembers
      .map(
        (m) =>
          `${m.id},${m.email || ""},${m.displayName || ""},${formatCurrency(m.approvedBalance)},${formatCurrency(m.affiliatePendingBalance)},${formatCurrency(m.affiliatePaidBalance)},${formatCurrency(m.affiliateTotalEarnings)}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rewmoai-payouts-due-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-7xl mx-auto py-10 px-4 bg-white text-gray-900 min-h-screen">
      <Head>
        <title>Payouts Management | RewmoAI Admin</title>
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
            Payout Management
          </h1>
          <p className="text-gray-600">
            Process payouts to members with approved commissions
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={fetchData}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            🔄 Refresh
          </button>
          <button
            onClick={exportPayoutCSV}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-50 border rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.totalMembers}</p>
          <p className="text-sm text-gray-500">Total Members</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{stats.membersReadyForPayout}</p>
          <p className="text-sm text-green-600">Ready for Payout</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{formatCurrency(stats.totalApprovedOwed)}</p>
          <p className="text-sm text-blue-600">Approved Owed</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{formatCurrency(stats.totalPendingOwed)}</p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">{formatCurrency(stats.totalPaid)}</p>
          <p className="text-sm text-purple-600">Total Paid Out</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Minimum Balance</label>
            <select
              value={minBalance}
              onChange={(e) => setMinBalance(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value={0}>All balances</option>
              <option value={1000}>$10+</option>
              <option value={2500}>$25+ (default)</option>
              <option value={5000}>$50+</option>
              <option value={10000}>$100+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            >
              <option value="balance">Highest Balance</option>
              <option value="earnings">Highest Earnings</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Ready for Payout */}
      <div className="bg-white border rounded-xl overflow-hidden mb-8">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-gray-800">💳 Members Ready for Payout</h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No members with approved balance above {formatCurrency(minBalance)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 border-b">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4 text-right">Approved Balance</th>
                  <th className="py-3 px-4 text-right">Pending</th>
                  <th className="py-3 px-4 text-right">Total Paid</th>
                  <th className="py-3 px-4 text-center">Commissions</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-800">
                          {member.displayName || member.email || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {member.id.substring(0, 12)}...
                        </div>
                        {member.email && !member.displayName && (
                          <div className="text-xs text-gray-500">{member.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(member.approvedBalance)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-yellow-600">
                      {formatCurrency(member.affiliatePendingBalance)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {formatCurrency(member.affiliatePaidBalance)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs">
                        <span className="text-green-600">{member.approvedCommissionsCount} approved</span>
                        {" / "}
                        <span className="text-yellow-600">{member.pendingCommissionsCount} pending</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => openPayoutModal(member)}
                        disabled={member.approvedBalance < 100}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        💸 Pay Out
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Payouts */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-gray-800">📜 Payout History</h2>
        </div>

        {payoutHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No payouts processed yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 border-b">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory.slice(0, 20).map((payout) => (
                  <tr key={payout.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(payout.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs">
                        <div className="font-mono text-gray-600">
                          {payout.memberId.substring(0, 12)}...
                        </div>
                        {payout.memberEmail && (
                          <div className="text-gray-400">{payout.memberEmail}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-green-600">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">
                        {payout.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs font-mono">
                      {payout.reference || "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {payout.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout Modal */}
      {showPayoutModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Process Payout
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600">Paying:</p>
              <p className="font-bold text-gray-800">
                {selectedMember.displayName || selectedMember.email || selectedMember.id}
              </p>
              <p className="text-sm text-gray-500">{selectedMember.email}</p>
              <p className="text-lg font-bold text-green-600 mt-2">
                Available: {formatCurrency(selectedMember.approvedBalance)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  step="0.01"
                  min="0.01"
                  max={(selectedMember.approvedBalance / 100).toFixed(2)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="check">Check</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference (optional)
                </label>
                <input
                  type="text"
                  value={payoutReference}
                  onChange={(e) => setPayoutReference(e.target.value)}
                  placeholder="PayPal transaction ID, check #, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  placeholder="Any additional notes..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPayoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={processPayout}
                disabled={processing !== null}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
              >
                {processing ? "Processing..." : `Pay ${formatCurrency(parseFloat(payoutAmount || "0") * 100)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
