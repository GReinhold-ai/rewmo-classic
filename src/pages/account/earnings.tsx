// src/pages/account/earnings.tsx
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";
import { useRouter } from "next/router";

interface AffiliateCommission {
  id: string;
  network: string;
  orderId: string;
  grossAmount: number;
  memberShare: number;
  status: "pending" | "approved" | "paid";
  createdAt: { _seconds: number };
}

interface EarningsData {
  pendingBalance: number;
  paidBalance: number;
  totalEarnings: number;
  totalClicks: number;
  recentCommissions: AffiliateCommission[];
  pendingBalanceFormatted: string;
  paidBalanceFormatted: string;
  totalEarningsFormatted: string;
}

export default function EarningsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!currentUser) {
      router.push("/account");
      return;
    }

    fetchEarnings();
  }, [currentUser, authLoading, router]);

  const fetchEarnings = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      const token = await currentUser.getIdToken();
      const response = await fetch("/api/affiliate/earnings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch earnings");
      }

      const data = await response.json();
      setEarnings(data);
    } catch (err: any) {
      console.error("Error fetching earnings:", err);
      setError(err?.message || "Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: { _seconds: number }) => {
    if (!timestamp?._seconds) return "N/A";
    return new Date(timestamp._seconds * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-semibold">
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-semibold">
            Approved
          </span>
        );
      case "paid":
        return (
          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-semibold">
            Paid
          </span>
        );
      default:
        return (
          <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  const getNetworkIcon = (network: string) => {
    switch (network) {
      case "amazon":
        return "🛒";
      case "impact":
        return "💫";
      case "awin":
        return "🔗";
      default:
        return "📦";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#003B49] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9151] mx-auto mb-4"></div>
          <p className="text-white/60">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>Affiliate Earnings | RewmoAI</title>
        <meta name="description" content="View your affiliate earnings and commission history" />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/account"
          className="inline-flex items-center text-[#15C5C1] hover:text-[#1DE5E0] mb-6"
        >
          ← Back to Account
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#FF9151] mb-2">
            Affiliate Earnings
          </h1>
          <p className="text-white/70">
            Track your commissions from shopping rewards. You earn 50% of every commission!
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchEarnings}
              className="mt-2 text-sm text-red-300 underline hover:text-red-200"
            >
              Try again
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {/* Pending Balance */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-white/60 text-sm mb-1">Pending Balance</p>
            <p className="text-3xl font-bold text-yellow-400">
              {earnings?.pendingBalanceFormatted || "$0.00"}
            </p>
            <p className="text-xs text-white/40 mt-1">Awaiting approval</p>
          </div>

          {/* Available to Withdraw */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-white/60 text-sm mb-1">Available</p>
            <p className="text-3xl font-bold text-green-400">
              {formatCurrency((earnings?.totalEarnings || 0) - (earnings?.paidBalance || 0) - (earnings?.pendingBalance || 0))}
            </p>
            <p className="text-xs text-white/40 mt-1">Ready to withdraw</p>
          </div>

          {/* Total Paid */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-white/60 text-sm mb-1">Total Paid Out</p>
            <p className="text-3xl font-bold text-blue-400">
              {earnings?.paidBalanceFormatted || "$0.00"}
            </p>
            <p className="text-xs text-white/40 mt-1">Lifetime payouts</p>
          </div>

          {/* Total Clicks */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-white/60 text-sm mb-1">Total Clicks</p>
            <p className="text-3xl font-bold text-[#15C5C1]">
              {earnings?.totalClicks || 0}
            </p>
            <p className="text-xs text-white/40 mt-1">Shopping links clicked</p>
          </div>
        </div>

        {/* Total Earnings Highlight */}
        <div className="bg-gradient-to-r from-[#FF9151]/20 to-[#15C5C1]/20 border border-[#FF9151]/30 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 mb-1">Lifetime Earnings (Your 50% Share)</p>
              <p className="text-4xl font-extrabold text-[#FF9151]">
                {earnings?.totalEarningsFormatted || "$0.00"}
              </p>
            </div>
            <div className="text-6xl">💰</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-[#15C5C1] mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🛒</div>
              <h3 className="font-bold text-white mb-1">1. Shop</h3>
              <p className="text-white/60 text-sm">
                Click any retailer link and make a purchase
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">💵</div>
              <h3 className="font-bold text-white mb-1">2. We Earn</h3>
              <p className="text-white/60 text-sm">
                Retailers pay us a commission (usually 1-10%)
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🤝</div>
              <h3 className="font-bold text-white mb-1">3. You Earn</h3>
              <p className="text-white/60 text-sm">
                We share 50% of that commission with you!
              </p>
            </div>
          </div>
        </div>

        {/* Commission History */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#15C5C1] mb-4">
            Commission History
          </h2>

          {!earnings?.recentCommissions || earnings.recentCommissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-white/60 mb-2">No commissions yet</p>
              <p className="text-white/40 text-sm mb-4">
                Start shopping through our links to earn commissions!
              </p>
              <Link
                href="/shopping"
                className="inline-block bg-[#FF9151] text-[#003B49] px-6 py-2 rounded-lg font-bold hover:bg-[#FFA36C] transition"
              >
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-white/60 text-sm border-b border-white/10">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Network</th>
                    <th className="pb-3 pr-4">Order ID</th>
                    <th className="pb-3 pr-4 text-right">Commission</th>
                    <th className="pb-3 pr-4 text-right">Your Share (50%)</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.recentCommissions.map((commission) => (
                    <tr
                      key={commission.id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-3 pr-4 text-white/80">
                        {formatDate(commission.createdAt)}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="flex items-center gap-2">
                          <span>{getNetworkIcon(commission.network)}</span>
                          <span className="capitalize text-white/80">
                            {commission.network}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-white/60 text-sm font-mono">
                        {commission.orderId.length > 15
                          ? `${commission.orderId.substring(0, 15)}...`
                          : commission.orderId}
                      </td>
                      <td className="py-3 pr-4 text-right text-white/60">
                        {formatCurrency(commission.grossAmount)}
                      </td>
                      <td className="py-3 pr-4 text-right font-bold text-green-400">
                        {formatCurrency(commission.memberShare)}
                      </td>
                      <td className="py-3">{getStatusBadge(commission.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payout Info */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="font-bold text-blue-400 mb-2">💳 Payouts</h3>
          <p className="text-white/70 text-sm">
            Payouts are processed monthly for approved commissions over $25. 
            Payments are sent via PayPal or direct deposit. 
            Contact support to set up your payout method.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm underline"
          >
            Contact Support to Set Up Payouts →
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="font-bold text-[#15C5C1] mb-4">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-white mb-1">
                How long until commissions appear?
              </p>
              <p className="text-white/60 text-sm">
                Commissions typically appear within 24-72 hours after your purchase is confirmed.
                Some retailers may take up to 30 days to report.
              </p>
            </div>
            
            <div>
              <p className="font-semibold text-white mb-1">
                Why is my commission "pending"?
              </p>
              <p className="text-white/60 text-sm">
                Commissions stay pending until the retailer confirms the order wasn't returned.
                This usually takes 30-60 days.
              </p>
            </div>
            
            <div>
              <p className="font-semibold text-white mb-1">
                What's the minimum payout?
              </p>
              <p className="text-white/60 text-sm">
                The minimum payout is $25 in approved (non-pending) commissions.
              </p>
            </div>
            
            <div>
              <p className="font-semibold text-white mb-1">
                Can I earn on my own purchases?
              </p>
              <p className="text-white/60 text-sm">
                Yes! When you shop through our links, you earn 50% of the commission on your own purchases.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}