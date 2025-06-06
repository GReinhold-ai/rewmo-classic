import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#003B49] font-sans flex flex-col items-center justify-start py-10 px-2">
      {/* Main Header */}
      <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-[#FF9151] text-center">
        Welcome to Rewards Mobile AI
      </h1>
      <div className="text-lg md:text-xl text-[#B6E7EB] font-medium text-center mb-2">
        The AI-powered hub for rewards, savings, and smarter financial growth—for individuals, families, and businesses.
      </div>
      <div className="font-bold text-[#FF9151] text-center mb-6 text-base md:text-lg">
        Unlock instant rewards every time you shop, manage your spending, or improve your workflow!
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-3">
        <Link href="/signup">
          <button className="bg-[#FF9151] hover:bg-[#FFA36C] text-[#003B49] font-bold rounded-xl px-8 py-3 text-lg shadow transition">
            Get Started Free
          </button>
        </Link>
        <Link href="/shopping">
          <button className="bg-[#15C5C1] hover:bg-[#0fc8b5] text-[#003B49] font-bold rounded-xl px-8 py-3 text-lg shadow transition">
            Shop Now
          </button>
        </Link>
      </div>

      {/* Beta Banner */}
      <div className="bg-[#072b33] border border-[#15C5C1] rounded-xl text-center px-6 py-4 mb-8 w-full max-w-xs md:max-w-md">
        <span className="font-semibold text-[#FF9151]">🚀 Beta is LIVE!</span>
        <div className="text-[#B6E7EB] mt-1 text-sm">
          Your rewards and referrals are being tracked.<br />
          Withdrawals open after launch.<br />
          All points follow the <Link href="/reward-rules" className="underline text-[#15C5C1] hover:text-[#FFA36C]">Reward Rules</Link>.
        </div>
      </div>

      {/* Reward Types */}
      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-10 w-full">
        {/* Personal Shopping Rewards */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#15C5C1] px-8 py-8 text-center flex flex-col items-center">
          <h2 className="text-lg md:text-xl font-bold text-[#003B49] mb-2">Personal Shopping Rewards</h2>
          <p className="text-[#003B49] text-base mb-3">
            Earn instant cash back & bonus points when you shop your favorite brands.
            Simple, secure, automatic savings—everyday purchases, groceries, Amazon, and more!
          </p>
          <Link href="/shopping">
            <span className="text-[#15C5C1] font-semibold underline hover:text-[#FF9151] transition text-base">See eligible stores &rarr;</span>
          </Link>
        </div>

        {/* Business Shopping Rewards */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#15C5C1] px-8 py-8 text-center flex flex-col items-center">
          <h2 className="text-lg md:text-xl font-bold text-[#003B49] mb-2">Business Shopping Rewards</h2>
          <p className="text-[#003B49] text-base mb-3">
            Unlock exclusive rewards on business essentials, supplies, and bulk orders.
            Streamline expense tracking, earn more on every transaction—perfect for startups, teams, and entrepreneurs!
          </p>
          <Link href="/business-shopping">
            <span className="text-[#15C5C1] font-semibold underline hover:text-[#FF9151] transition text-base">Shop for your business &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Lean Lab Highlight */}
      <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-8 max-w-2xl w-full mb-10 text-center mx-auto">
        <h3 className="text-xl font-bold text-[#15C5C1] mb-2">
          Lean Lab – RewmoAI Process Management
        </h3>
        <p className="font-semibold text-[#FF9151] mb-2">
          NEW: AI-powered process improvement tools for <span className="text-[#15C5C1]">individuals and small businesses</span>.
        </p>
        <p className="text-[#B6E7EB] text-base mb-3">
          Map your routines, eliminate waste, and unlock continuous improvement.<br />
          Get step-by-step guidance and earn rewards for every improvement—at home or at work!
        </p>
        <Link href="/leanlab">
          <span className="text-[#15C5C1] font-semibold underline hover:text-[#FF9151] transition">Learn about Lean Lab &rarr;</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="text-center text-[#B6E7EB] italic mb-2 text-sm">
        Coming soon: Even more rewards, group challenges, and advanced AI financial tools.
      </div>
      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] bg-[#003B49] w-full mt-8">
        <span>
          © {new Date().getFullYear()} RewmoAI |{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-[#FFA36C] text-[#FF9151]">Affiliate Disclosure</Link> |{" "}
          <Link href="/privacy" className="underline hover:text-[#FFA36C] text-[#FF9151]">Privacy</Link> |{" "}
          <Link href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">Terms</Link>
        </span>
      </footer>
    </div>
  );
}
