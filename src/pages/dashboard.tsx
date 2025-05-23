// pages/dashboard.tsx

import { useAuth } from "@/lib/AuthProvider";
import SuggestionForm from "@/components/SuggestionForm";
import BottomTabBar from "@/components/BottomTabBar";

export default function DashboardPage() {
  const { currentUser, login, logout } = useAuth();

  return (
    <>
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl flex flex-col items-center">

          {/* Dashboard Header */}
          <h1 className="text-3xl font-bold text-orange-600 mb-3 text-center">
            RewmoAI Dashboard
          </h1>

          {currentUser ? (
            <div className="text-gray-300 flex flex-col items-center justify-center mb-6">
              <span>
                Welcome, <span className="font-semibold">{currentUser.email}</span>!
              </span>
              <button
                onClick={logout}
                className="mt-3 px-4 py-1 rounded bg-orange-500 text-white"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="text-red-500 flex flex-col items-center mb-6">
              Please sign in to access your dashboard.
              <button
                onClick={login}
                className="mt-3 px-4 py-1 rounded bg-orange-500 text-white"
              >
                Sign In
              </button>
            </div>
          )}

          <section className="mb-8 w-full flex flex-col items-center">
            <div className="bg-white rounded-xl shadow p-6 mb-6 text-black w-full">
              <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                Your Account Overview
              </h2>
              <div className="text-gray-600 text-center">
                Account stats and latest activities will show here.
              </div>
            </div>
          </section>

          <section className="w-full flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2 text-orange-700 text-center">
              Have an idea or feedback?
            </h2>
            {currentUser?.uid ? (
              <SuggestionForm userId={currentUser.uid} />
            ) : (
              <div className="text-gray-500 text-center">Sign in to submit suggestions.</div>
            )}
          </section>

          {/* Withdrawal Notice - Bottom */}
          <div className="w-full flex flex-col items-center">
            <div className="mt-10 mb-2 text-xs text-orange-300 text-center max-w-md bg-orange-100/10 rounded px-3 py-2">
              <span className="font-bold text-orange-400">Note:</span> Withdrawals and redemptions of rewards are paused until RewmoAI’s funding is complete.<br />
              After launch, a <span className="font-bold text-orange-400">90-day holding period</span> will apply to all new rewards before they become eligible for withdrawal.
            </div>
          </div>

        </div>
      </main>
      <BottomTabBar />
    </>
  );
}
