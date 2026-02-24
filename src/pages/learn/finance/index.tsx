// src/pages/learn/finance/index.tsx
// Finance Training Hub - Personal Finance & Small Business Finance
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  Home, 
  Briefcase,
  Calculator,
  Target,
  Shield,
  Building,
  Receipt,
  BarChart3,
  Wallet,
  Lock,
  Play,
  CheckCircle,
  Clock,
  Award
} from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

// Types
type Section = "personal" | "business";
type LessonStatus = "locked" | "available" | "completed";

interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  isPro?: boolean;
  isBusiness?: boolean;
  isComingSoon?: boolean;
  points: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  lessons: Lesson[];
  isPro?: boolean;
  isBusiness?: boolean;
}

// ===========================================
// PERSONAL FINANCE MODULES
// ===========================================
const PERSONAL_FINANCE_MODULES: Module[] = [
  {
    id: "pf-foundations",
    title: "Financial Foundations",
    description: "Build a solid base for your financial future with these essential concepts.",
    icon: <PiggyBank className="w-6 h-6" />,
    lessons: [
      {
        id: "pf-1-1",
        slug: "power-of-five-dollars",
        title: "The Power of $5/Day",
        description: "How small daily savings compound into life-changing wealth over time.",
        duration: "10 min",
        icon: <DollarSign className="w-5 h-5" />,
        points: 25,
      },
      {
        id: "pf-1-2",
        slug: "50-30-20-budget",
        title: "The 50/30/20 Budget",
        description: "A simple framework to allocate your income: needs, wants, and savings.",
        duration: "15 min",
        icon: <Calculator className="w-5 h-5" />,
        points: 25,
      },
      {
        id: "pf-1-3",
        slug: "track-your-spending",
        title: "Track Your Spending",
        description: "You can't improve what you don't measure. Learn to see where your money actually goes.",
        duration: "12 min",
        icon: <Receipt className="w-5 h-5" />,
        points: 25,
      },
      {
        id: "pf-1-4",
        slug: "emergency-fund",
        title: "Building an Emergency Fund",
        description: "Your financial safety net: how much you need and how to build it fast.",
        duration: "10 min",
        icon: <Shield className="w-5 h-5" />,
        points: 25,
      },
    ],
  },
  {
    id: "pf-debt",
    title: "Conquering Debt",
    description: "Strategies to eliminate debt faster and free up your income for building wealth.",
    icon: <CreditCard className="w-6 h-6" />,
    lessons: [
      {
        id: "pf-2-1",
        slug: "debt-snowball-avalanche",
        title: "Snowball vs. Avalanche",
        description: "Two proven strategies for paying off debt—which one fits your psychology?",
        duration: "12 min",
        icon: <Target className="w-5 h-5" />,
        points: 25,
      },
      {
        id: "pf-2-2",
        slug: "credit-score-demystified",
        title: "Credit Score Demystified",
        description: "What actually affects your score and how to improve it strategically.",
        duration: "15 min",
        icon: <BarChart3 className="w-5 h-5" />,
        points: 25,
      },
      {
        id: "pf-2-3",
        slug: "good-debt-bad-debt",
        title: "Good Debt vs. Bad Debt",
        description: "Not all debt is created equal. Learn which debt can build wealth and which destroys it.",
        duration: "10 min",
        icon: <CreditCard className="w-5 h-5" />,
        points: 25,
      },
    ],
  },
  {
    id: "pf-investing",
    title: "Investing Basics",
    description: "Start building wealth through smart, simple investing strategies.",
    icon: <TrendingUp className="w-6 h-6" />,
    isPro: true,
    lessons: [
      {
        id: "pf-3-1",
        slug: "investing-101",
        title: "Investing 101",
        description: "Stocks, bonds, ETFs, and mutual funds explained in plain English.",
        duration: "20 min",
        icon: <TrendingUp className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
      {
        id: "pf-3-2",
        slug: "retirement-accounts",
        title: "Retirement Accounts Explained",
        description: "401(k), IRA, Roth IRA—which accounts to use and in what order.",
        duration: "18 min",
        icon: <Wallet className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
      {
        id: "pf-3-3",
        slug: "compound-interest-magic",
        title: "The Magic of Compound Interest",
        description: "Why starting early matters more than starting big. See the math.",
        duration: "12 min",
        icon: <Award className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
      {
        id: "pf-3-4",
        slug: "index-fund-strategy",
        title: "The Index Fund Strategy",
        description: "Why most professionals can't beat the market—and how you can match it.",
        duration: "15 min",
        icon: <BarChart3 className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
    ],
  },
  {
    id: "pf-advanced",
    title: "Advanced Strategies",
    description: "Level up your finances with tax optimization and real estate basics.",
    icon: <Home className="w-6 h-6" />,
    isPro: true,
    lessons: [
      {
        id: "pf-4-1",
        slug: "tax-optimization",
        title: "Tax Optimization Basics",
        description: "Legal strategies to keep more of what you earn. Tax-advantaged accounts and deductions.",
        duration: "20 min",
        icon: <Receipt className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
      {
        id: "pf-4-2",
        slug: "real-estate-intro",
        title: "Real Estate Fundamentals",
        description: "Should you rent or buy? Introduction to real estate as an investment.",
        duration: "25 min",
        icon: <Home className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
      {
        id: "pf-4-3",
        slug: "insurance-essentials",
        title: "Insurance Essentials",
        description: "What insurance you actually need and what's a waste of money.",
        duration: "15 min",
        icon: <Shield className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
    ],
  },
];

// ===========================================
// SMALL BUSINESS FINANCE MODULES
// ===========================================
const BUSINESS_FINANCE_MODULES: Module[] = [
  {
    id: "bf-foundations",
    title: "Business Finance Foundations",
    description: "Essential financial knowledge every business owner needs.",
    icon: <Briefcase className="w-6 h-6" />,
    lessons: [
      {
        id: "bf-1-1",
        slug: "separate-finances",
        title: "Separate Personal & Business",
        description: "Why mixing finances is dangerous and how to properly separate them.",
        duration: "12 min",
        icon: <Wallet className="w-5 h-5" />,
        points: 25,
      },
      {
        id: "bf-1-2",
        slug: "business-entity-types",
        title: "Business Entity Types",
        description: "LLC, S-Corp, C-Corp, Sole Proprietor—which structure is right for you?",
        duration: "20 min",
        icon: <Building className="w-5 h-5" />,
        points: 25,
      },
      {
        id: "bf-1-3",
        slug: "business-banking",
        title: "Business Banking Setup",
        description: "Choosing accounts, managing cash, and building business credit.",
        duration: "15 min",
        icon: <CreditCard className="w-5 h-5" />,
        points: 25,
      },
    ],
  },
  {
    id: "bf-cashflow",
    title: "Cash Flow Management",
    description: "Cash is king. Learn to manage the lifeblood of your business.",
    icon: <DollarSign className="w-6 h-6" />,
    isPro: true,
    lessons: [
      {
        id: "bf-2-1",
        slug: "cash-flow-basics",
        title: "Cash Flow Basics",
        description: "Revenue vs. profit vs. cash flow—why profitable businesses still fail.",
        duration: "15 min",
        icon: <TrendingUp className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
      {
        id: "bf-2-2",
        slug: "invoice-collections",
        title: "Invoicing & Collections",
        description: "Get paid faster with better invoicing practices and collection strategies.",
        duration: "12 min",
        icon: <Receipt className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
      {
        id: "bf-2-3",
        slug: "cash-flow-forecasting",
        title: "Cash Flow Forecasting",
        description: "Predict your cash position and avoid nasty surprises.",
        duration: "18 min",
        icon: <BarChart3 className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
    ],
  },
  {
    id: "bf-bookkeeping",
    title: "Bookkeeping & Accounting",
    description: "Keep your books clean and your accountant happy.",
    icon: <Calculator className="w-6 h-6" />,
    isPro: true,
    lessons: [
      {
        id: "bf-3-1",
        slug: "bookkeeping-basics",
        title: "Bookkeeping Basics",
        description: "Chart of accounts, double-entry, and keeping organized records.",
        duration: "20 min",
        icon: <BookOpen className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
      {
        id: "bf-3-2",
        slug: "financial-statements",
        title: "Reading Financial Statements",
        description: "P&L, Balance Sheet, Cash Flow Statement—what they tell you about your business.",
        duration: "25 min",
        icon: <BarChart3 className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
      {
        id: "bf-3-3",
        slug: "accounting-software",
        title: "Choosing Accounting Software",
        description: "QuickBooks vs. Xero vs. Wave—find the right fit for your business.",
        duration: "12 min",
        icon: <Calculator className="w-5 h-5" />,
        isPro: true,
        points: 50,
      },
    ],
  },
  {
    id: "bf-taxes",
    title: "Business Taxes",
    description: "Navigate business taxes and keep more of your hard-earned profit.",
    icon: <Receipt className="w-6 h-6" />,
    isBusiness: true,
    lessons: [
      {
        id: "bf-4-1",
        slug: "business-tax-basics",
        title: "Business Tax Basics",
        description: "Estimated taxes, quarterly payments, and common deductions.",
        duration: "20 min",
        icon: <Receipt className="w-5 h-5" />,
        isBusiness: true,
        points: 75,
      },
      {
        id: "bf-4-2",
        slug: "tax-deductions",
        title: "Maximizing Deductions",
        description: "Legal deductions you might be missing: home office, vehicles, travel, and more.",
        duration: "18 min",
        icon: <DollarSign className="w-5 h-5" />,
        isBusiness: true,
        points: 75,
      },
      {
        id: "bf-4-3",
        slug: "hiring-contractors",
        title: "Hiring & Payroll Taxes",
        description: "W-2 vs 1099, payroll taxes, and the true cost of employees.",
        duration: "22 min",
        icon: <Briefcase className="w-5 h-5" />,
        isBusiness: true,
        points: 75,
      },
    ],
  },
  {
    id: "bf-funding",
    title: "Funding & Growth",
    description: "Finance your business growth the smart way.",
    icon: <TrendingUp className="w-6 h-6" />,
    isBusiness: true,
    lessons: [
      {
        id: "bf-5-1",
        slug: "funding-options",
        title: "Funding Options Explained",
        description: "Bootstrapping, loans, lines of credit, investors—pros and cons of each.",
        duration: "20 min",
        icon: <DollarSign className="w-5 h-5" />,
        isBusiness: true,
        points: 75,
      },
      {
        id: "bf-5-2",
        slug: "business-credit",
        title: "Building Business Credit",
        description: "Establish and grow your business credit score for better financing options.",
        duration: "15 min",
        icon: <CreditCard className="w-5 h-5" />,
        isBusiness: true,
        points: 75,
      },
      {
        id: "bf-5-3",
        slug: "pricing-strategy",
        title: "Pricing Strategy",
        description: "How to price your products and services for profit, not just revenue.",
        duration: "18 min",
        icon: <Target className="w-5 h-5" />,
        isBusiness: true,
        points: 75,
      },
    ],
  },
];

// ===========================================
// MAIN COMPONENT
// ===========================================
export default function FinanceTraining() {
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const { currentUser } = useAuth();
  const [userTier, setUserTier] = useState<string>("FREE");
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      if (currentUser?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserTier(data?.tier || "FREE");
            setCompletedLessons(data?.completedLessons || []);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    }

    if (currentUser !== undefined) {
      fetchUserData();
    }
  }, [currentUser]);

  const isPro = userTier === "PRO" || userTier === "BUSINESS";
  const isBusiness = userTier === "BUSINESS";
  const isLoggedIn = !!currentUser;

  const modules = activeSection === "personal" ? PERSONAL_FINANCE_MODULES : BUSINESS_FINANCE_MODULES;

  // Calculate progress
  const totalLessons = modules.flatMap(m => m.lessons).length;
  const completedCount = modules.flatMap(m => m.lessons).filter(l => completedLessons.includes(l.id)).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <>
      <Head>
        <title>Finance Training | RewmoAI</title>
        <meta name="description" content="Personal finance and small business finance training. Learn to manage money, eliminate debt, invest wisely, and grow your business." />
      </Head>

      <div className="min-h-screen bg-[#003B49]">
        {/* Header */}
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-8">
          <Link href="/lean-lab" className="text-[#15C5C1] hover:text-white text-sm mb-4 inline-block">
            ← Back to LeanAI Lab
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#FF9151] text-center mt-4">
            💰 Finance Training
          </h1>
          
          <p className="text-center text-[#B6E7EB] mt-4 max-w-2xl mx-auto text-lg">
            Practical money skills for life. Master personal finance or learn to manage your business finances—earn points as you learn.
          </p>

          {/* Progress Bar */}
          {isLoggedIn && (
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-[#B6E7EB] mb-2">
                <span>{activeSection === "personal" ? "Personal Finance" : "Business Finance"} Progress</span>
                <span>{completedCount}/{totalLessons} lessons ({progressPercent}%)</span>
              </div>
              <div className="h-3 bg-[#072b33] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#15C5C1] to-[#FF9151] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section Tabs */}
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveSection("personal")}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 ${
                activeSection === "personal"
                  ? "bg-[#15C5C1] text-[#003B49] shadow-lg shadow-[#15C5C1]/20"
                  : "bg-[#072b33] text-slate-300 hover:bg-[#0a3d47] border border-white/10"
              }`}
            >
              <PiggyBank className="w-6 h-6" />
              Personal Finance
            </button>
            <button
              onClick={() => setActiveSection("business")}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 ${
                activeSection === "business"
                  ? "bg-[#FF9151] text-[#003B49] shadow-lg shadow-[#FF9151]/20"
                  : "bg-[#072b33] text-slate-300 hover:bg-[#0a3d47] border border-white/10"
              }`}
            >
              <Briefcase className="w-6 h-6" />
              Small Business Finance
            </button>
          </div>
        </div>

        {/* Modules */}
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="space-y-8">
            {modules.map((module) => (
              <ModuleSection
                key={module.id}
                module={module}
                isPro={isPro}
                isBusiness={isBusiness}
                isLoggedIn={isLoggedIn}
                loading={loading}
                completedLessons={completedLessons}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <div className="bg-gradient-to-r from-[#15C5C1]/20 to-[#FF9151]/20 rounded-2xl p-8 border border-white/10 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-[#B6E7EB] mb-6 max-w-xl mx-auto">
              {isPro 
                ? "You have full access to all finance training. Start learning and earning points!"
                : "Upgrade to Pro to unlock all lessons and earn more points as you learn."
              }
            </p>
            {!isPro && (
              <Link
                href="/account/upgrade?plan=PRO"
                className="inline-block px-8 py-3 bg-[#FF9151] text-[#003B49] font-bold rounded-lg hover:bg-[#FFA36C] transition"
              >
                Upgrade to Pro — $10/mo
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ===========================================
// SUB-COMPONENTS
// ===========================================

function ModuleSection({
  module,
  isPro,
  isBusiness,
  isLoggedIn,
  loading,
  completedLessons,
}: {
  module: Module;
  isPro: boolean;
  isBusiness: boolean;
  isLoggedIn: boolean;
  loading: boolean;
  completedLessons: string[];
}) {
  const moduleLocked = (module.isPro && !isPro) || (module.isBusiness && !isBusiness);
  const completedInModule = module.lessons.filter(l => completedLessons.includes(l.id)).length;

  return (
    <div className={`bg-[#052B33]/50 rounded-2xl p-6 border ${moduleLocked ? 'border-[#FF9151]/30' : 'border-[#15C5C1]/20'}`}>
      {/* Module Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${moduleLocked ? 'bg-[#FF9151]/10' : 'bg-[#15C5C1]/10'}`}>
            <span className={moduleLocked ? 'text-[#FF9151]' : 'text-[#15C5C1]'}>
              {module.icon}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{module.title}</h2>
              {module.isPro && (
                <span className="px-2 py-0.5 text-xs font-bold bg-[#FF9151]/20 text-[#FF9151] rounded">PRO</span>
              )}
              {module.isBusiness && (
                <span className="px-2 py-0.5 text-xs font-bold bg-purple-500/20 text-purple-400 rounded">BUSINESS</span>
              )}
            </div>
            <p className="text-slate-400 text-sm mt-1">{module.description}</p>
          </div>
        </div>
        
        {isLoggedIn && (
          <div className="text-right">
            <div className="text-sm text-[#15C5C1] font-semibold">
              {completedInModule}/{module.lessons.length} complete
            </div>
          </div>
        )}
      </div>

      {/* Upgrade notice for locked modules */}
      {moduleLocked && (
        <div className="bg-[#FF9151]/10 border border-[#FF9151]/30 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#FF9151]" />
            <span className="text-[#FF9151] font-medium">
              {module.isBusiness ? "Business tier required" : "Pro membership required"}
            </span>
          </div>
          <Link
            href={`/account/upgrade?plan=${module.isBusiness ? 'BUSINESS' : 'PRO'}`}
            className="px-4 py-2 bg-[#FF9151] text-[#003B49] font-bold rounded-lg hover:bg-[#FFA36C] transition text-sm"
          >
            Unlock
          </Link>
        </div>
      )}

      {/* Lessons Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {module.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isLocked={moduleLocked || (lesson.isPro && !isPro) || (lesson.isBusiness && !isBusiness)}
            isCompleted={completedLessons.includes(lesson.id)}
            isLoggedIn={isLoggedIn}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}

function LessonCard({
  lesson,
  isLocked,
  isCompleted,
  isLoggedIn,
  loading,
}: {
  lesson: Lesson;
  isLocked: boolean;
  isCompleted: boolean;
  isLoggedIn: boolean;
  loading: boolean;
}) {
  return (
    <div
      className={`relative rounded-xl p-4 border transition-all ${
        isCompleted
          ? "bg-[#15C5C1]/10 border-[#15C5C1]/40"
          : isLocked
          ? "bg-[#072b33]/50 border-white/5 opacity-70"
          : "bg-[#072b33] border-white/10 hover:border-[#15C5C1]/40"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${
          isCompleted ? 'bg-[#15C5C1]/20' : 'bg-white/5'
        }`}>
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-[#15C5C1]" />
          ) : (
            <span className={isLocked ? 'text-slate-500' : 'text-[#FF9151]'}>
              {lesson.icon}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold ${isLocked ? 'text-slate-400' : 'text-white'}`}>
              {lesson.title}
            </h3>
            {lesson.isPro && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#FF9151]/20 text-[#FF9151] rounded">PRO</span>
            )}
          </div>
          
          <p className={`text-sm mb-3 line-clamp-2 ${isLocked ? 'text-slate-500' : 'text-slate-400'}`}>
            {lesson.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {lesson.duration}
              </span>
              <span className="flex items-center gap-1 text-[#15C5C1]">
                <Award className="w-3 h-3" /> +{lesson.points} pts
              </span>
            </div>

            {/* Action Button */}
            {loading ? (
              <span className="text-xs text-slate-500">Loading...</span>
            ) : isLocked ? (
              <Lock className="w-4 h-4 text-slate-500" />
            ) : isCompleted ? (
              <span className="text-xs text-[#15C5C1] font-medium">Completed ✓</span>
            ) : (
              <Link
                href={`/learn/finance/${lesson.slug}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#15C5C1] text-[#003B49] text-sm font-bold rounded-lg hover:bg-[#1ad4d0] transition"
              >
                <Play className="w-3 h-3" /> Start
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
