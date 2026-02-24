// Updated FINANCE_MODULES for src/pages/lean-lab/index.tsx
// Replace the existing FINANCE_MODULES array with this expanded version

// Finance Training Modules - Updated with Personal & Business sections
const FINANCE_MODULES: Module[] = [
  // PERSONAL FINANCE - FREE
  {
    id: "fin-personal-track",
    title: "Personal Finance Track",
    description: "Complete personal finance curriculum: budgeting, debt payoff, emergency funds, and building wealth. Start here!",
    duration: "2+ hours",
    pageUrl: "/learn/finance",
  },
  {
    id: "fin-5-dollar",
    title: "The Power of $5/Day",
    description: "How small daily savings compound into life-changing wealth. The most important lesson you'll learn.",
    duration: "10 min",
    pageUrl: "/learn/finance/power-of-five-dollars",
  },
  {
    id: "fin-budget",
    title: "50/30/20 Budget Framework",
    description: "A simple, proven system to allocate your income between needs, wants, and savings.",
    duration: "15 min",
    pageUrl: "/learn/finance/50-30-20-budget",
  },
  {
    id: "fin-debt",
    title: "Debt Snowball vs. Avalanche",
    description: "Two proven strategies for paying off debt faster. Which one matches your psychology?",
    duration: "12 min",
    pageUrl: "/learn/finance/debt-snowball-avalanche",
  },
  // PERSONAL FINANCE - PRO
  {
    id: "fin-investing",
    title: "Investing 101",
    description: "Stocks, bonds, ETFs, and mutual funds explained in plain English. Build your first portfolio.",
    duration: "20 min",
    isPro: true,
    pageUrl: "/learn/finance/investing-101",
  },
  {
    id: "fin-retirement",
    title: "Retirement Accounts Explained",
    description: "401(k), IRA, Roth IRA—which accounts to use and in what order for maximum tax benefits.",
    duration: "18 min",
    isPro: true,
    pageUrl: "/learn/finance/retirement-accounts",
  },
  {
    id: "fin-tax",
    title: "Tax Optimization Basics",
    description: "Legal strategies to keep more of what you earn. Tax-advantaged accounts and common deductions.",
    duration: "20 min",
    isPro: true,
    pageUrl: "/learn/finance/tax-optimization",
  },
  // SMALL BUSINESS FINANCE
  {
    id: "fin-biz-track",
    title: "Small Business Finance Track",
    description: "Everything you need to manage your business finances: entities, bookkeeping, cash flow, and taxes.",
    duration: "3+ hours",
    isPro: true,
    pageUrl: "/learn/finance?section=business",
  },
  {
    id: "fin-biz-setup",
    title: "Business Finance Setup",
    description: "Separate personal & business finances, choose the right entity, set up business banking.",
    duration: "25 min",
    isPro: true,
    pageUrl: "/learn/finance/separate-finances",
  },
  {
    id: "fin-cashflow",
    title: "Cash Flow Management",
    description: "Why profitable businesses fail and how to manage the lifeblood of your business.",
    duration: "15 min",
    isPro: true,
    pageUrl: "/learn/finance/cash-flow-basics",
  },
];

// ===========================================
// ALSO UPDATE THE FINANCE TAB CONTENT
// ===========================================
// Replace the finance tab section in the main component with this:

{/* ---------- FINANCE TRAINING TAB ---------- */}
{activeTab === "finance" && (
  <TabPanel>
    <TabHeader
      icon={<BookOpen className="w-6 h-6" />}
      title="Finance Training"
      description="Personal finance and small business finance training. Practical money skills for life."
    />
    
    {/* Section Toggle */}
    <div className="flex flex-wrap gap-3 mb-8">
      <Link
        href="/learn/finance"
        className="px-5 py-2.5 rounded-lg font-semibold bg-[#15C5C1] text-[#003B49] flex items-center gap-2"
      >
        💰 Personal Finance
      </Link>
      <Link
        href="/learn/finance?section=business"
        className="px-5 py-2.5 rounded-lg font-semibold bg-[#FF6B00] text-white flex items-center gap-2"
      >
        💼 Small Business Finance
        {!isPro && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">PRO</span>}
      </Link>
    </div>

    {/* Info Card */}
    <div className="bg-[#072b33] rounded-xl p-5 border border-[#15C5C1]/20 mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#15C5C1]/10 rounded-lg">
          <Zap className="w-5 h-5 text-[#15C5C1]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#15C5C1]">
            🎓 Two Learning Paths
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            <strong>Personal Finance:</strong> Budgeting, debt payoff, investing, and building wealth.<br/>
            <strong>Small Business:</strong> Cash flow, bookkeeping, taxes, and growth financing.
          </p>
        </div>
      </div>
    </div>

    <ModuleGrid
      modules={FINANCE_MODULES}
      userIsPro={isPro}
      isLoggedIn={isLoggedIn}
      loading={loading}
      requireLogin={false}
    />
    
    {/* Full Course CTA */}
    <div className="mt-8 text-center">
      <Link
        href="/learn/finance"
        className="inline-flex items-center gap-2 px-8 py-4 bg-[#15C5C1] hover:bg-[#1ad4d0] text-[#003B49] font-bold rounded-xl transition-colors text-lg"
      >
        <Play className="w-5 h-5" />
        Open Full Finance Training
      </Link>
    </div>
  </TabPanel>
)}
