// src/pages/learn/finance/[slug].tsx
// Complete Finance Lesson Page - 25 Lessons
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  Award,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { doc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

// ===========================================
// TYPE DEFINITIONS
// ===========================================
interface ContentBlock {
  type: "intro" | "section" | "callout" | "action" | "summary" | "example";
  title?: string;
  text?: string;
  points?: string[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  duration: string;
  points: number;
  category: string;
  nextLesson: string | null;
  prevLesson: string | null;
  content: ContentBlock[];
  quiz: QuizQuestion[];
}

// ===========================================
// LESSON CONTENT DATABASE - 25 LESSONS
// ===========================================
const LESSON_CONTENT: Record<string, LessonData> = {
  "power-of-five-dollars": {
    id: "pf-1-1",
    title: "The Power of $5/Day",
    description: "How small daily savings compound into life-changing wealth over time.",
    duration: "10 min",
    points: 25,
    category: "Personal Finance",
    nextLesson: "50-30-20-budget",
    prevLesson: null,
    content: [
      { type: "intro", text: "$5 seems like nothing. A coffee. A snack. Forgettable. But what if that $5 could change your life?" },
      { type: "section", title: "The Math That Changes Everything", text: "$5 a day is:\n• **$150 a month**\n• **$1,825 a year**\n• **$18,250 over a decade**\n\nBut here's where it gets interesting. Invested at a 7% average return, that $5/day becomes **$25,000+ in 10 years**.\n\nOver 30 years? **$185,000+**.\n\nFrom five dollars. Every day." },
      { type: "section", title: "The Hidden Wealth Leak", text: "Most people don't feel poor because of big expenses. They feel poor because of hundreds of small ones that add up invisibly.\n\nThe daily coffee. The subscription you forgot about. The convenience store snack. The \"it's only $5\" purchases.\n\nNone of these feel significant in the moment. But they compound—against you." },
      { type: "callout", title: "💡 Key Insight", text: "The same compound interest that can make you wealthy works against you when you spend instead of save. Every $5 spent is $25+ lost over time." },
      { type: "section", title: "The Fix: Awareness, Not Deprivation", text: "The solution isn't dramatic sacrifice. It's awareness.\n\nWhen you see where the $5 goes, you can redirect it. Not deprivation—redirection.\n\n**Try this:** For one week, note every purchase under $10. Add it up at the end. That number is your hidden wealth leak." },
      { type: "action", title: "🎯 Your Action Item", text: "Track every purchase under $10 for the next 7 days. Use your phone's notes app or a simple spreadsheet. At the end of the week, calculate your total. That's your potential monthly savings × 12 for annual impact." },
      { type: "summary", title: "Key Takeaways", points: ["$5/day = $1,825/year = $25,000+ in 10 years (invested)", "Small expenses compound against you invisibly", "Awareness beats deprivation—see where money goes", "Redirect, don't restrict"] }
    ],
    quiz: [
      { question: "How much does $5/day become over one year?", options: ["$365", "$1,825", "$500", "$3,650"], correct: 1 },
      { question: "Invested at 7% return, $5/day becomes approximately how much in 10 years?", options: ["$18,250", "$10,000", "$25,000+", "$50,000"], correct: 2 },
      { question: "What's the recommended approach to small spending?", options: ["Eliminate all small purchases", "Ignore them—they don't matter", "Track and redirect with awareness", "Only spend on weekends"], correct: 2 }
    ]
  },

  "50-30-20-budget": {
    id: "pf-1-2",
    title: "The 50/30/20 Budget",
    description: "A simple framework to allocate your income: needs, wants, and savings.",
    duration: "15 min",
    points: 25,
    category: "Personal Finance",
    nextLesson: "track-your-spending",
    prevLesson: "power-of-five-dollars",
    content: [
      { type: "intro", text: "Budgeting doesn't have to be complicated. The 50/30/20 rule gives you a simple framework that actually works." },
      { type: "section", title: "The 50/30/20 Breakdown", text: "**50% — Needs**\nHousing, utilities, groceries, insurance, minimum debt payments, transportation to work. Things you literally cannot live without.\n\n**30% — Wants**\nDining out, entertainment, hobbies, vacations, upgrades, subscriptions. Nice to have, not need to have.\n\n**20% — Savings & Debt**\nEmergency fund, retirement, investments, extra debt payments. Future you." },
      { type: "callout", title: "💡 Why This Works", text: "The 50/30/20 rule works because it's simple enough to actually follow. No tracking every penny. No guilt about enjoying life. Just three buckets." },
      { type: "example", title: "📊 Example: $4,000/month take-home", text: "• Needs (50%): $2,000 — rent, utilities, groceries, car payment\n• Wants (30%): $1,200 — dining, entertainment, shopping\n• Savings (20%): $800 — retirement, emergency fund, investments" },
      { type: "action", title: "🎯 Your Action Item", text: "Calculate your personal 50/30/20 numbers using your actual take-home pay. Then look at last month's spending. Where do you actually stand?" },
      { type: "summary", title: "Key Takeaways", points: ["50% Needs, 30% Wants, 20% Savings", "Simple beats complicated for budgeting", "If needs exceed 50%, focus on housing and transportation", "Adjust ratios temporarily if needed, but always save something"] }
    ],
    quiz: [
      { question: "In the 50/30/20 rule, what percentage goes to 'Wants'?", options: ["50%", "30%", "20%", "40%"], correct: 1 },
      { question: "Which category does 'rent' fall into?", options: ["Wants", "Savings", "Needs", "Investments"], correct: 2 },
      { question: "If your take-home pay is $5,000/month, how much should go to savings?", options: ["$500", "$1,000", "$1,500", "$2,500"], correct: 1 }
    ]
  },

  "track-your-spending": {
    id: "pf-1-3",
    title: "Track Your Spending",
    description: "You can't improve what you don't measure. Learn to see where your money actually goes.",
    duration: "12 min",
    points: 25,
    category: "Personal Finance",
    nextLesson: "emergency-fund",
    prevLesson: "50-30-20-budget",
    content: [
      { type: "intro", text: "Most people have no idea where their money goes. They make decent income but feel broke. The problem isn't earning—it's awareness." },
      { type: "section", title: "Why Tracking Matters", text: "You can't fix what you can't see. Tracking your spending reveals:\n\n• **Forgotten subscriptions** you're still paying for\n• **Lifestyle creep** that happened gradually\n• **Emotional spending** patterns you didn't notice\n• **Categories** where you spend way more than you thought" },
      { type: "callout", title: "💡 The Best Method", text: "The best tracking method is the one you'll actually use. A simple system you follow beats a complex system you abandon." },
      { type: "action", title: "🎯 Your Action Item", text: "Pick ONE tracking method and commit to it for 30 days. At month end, categorize everything and calculate your actual 50/30/20 split." },
      { type: "summary", title: "Key Takeaways", points: ["You can't improve what you don't measure", "Most people are shocked by their actual spending", "Choose a tracking method you'll actually stick with", "Separate groceries from dining out—they're very different"] }
    ],
    quiz: [
      { question: "Why is tracking spending important?", options: ["It's required by law", "You can't fix what you can't see", "Banks require it", "It's fun"], correct: 1 },
      { question: "What's the best tracking method?", options: ["Always use an app", "Always use spreadsheets", "The one you'll actually use", "The envelope system"], correct: 2 },
      { question: "Why separate groceries from dining out?", options: ["Tax purposes", "They're very different spending behaviors", "Restaurants require it", "No reason"], correct: 1 }
    ]
  },

  "emergency-fund": {
    id: "pf-1-4",
    title: "Building an Emergency Fund",
    description: "Your financial safety net: how much you need and how to build it fast.",
    duration: "10 min",
    points: 25,
    category: "Personal Finance",
    nextLesson: "debt-snowball-avalanche",
    prevLesson: "track-your-spending",
    content: [
      { type: "intro", text: "An emergency fund is the foundation of financial security. Without one, every unexpected expense becomes a crisis." },
      { type: "section", title: "How Much Do You Need?", text: "**Starter Goal: $1,000**\nThis handles most small emergencies.\n\n**Standard Goal: 3-6 months of expenses**\nIf you spend $3,000/month, aim for $9,000-18,000.\n\n**Enhanced Goal: 6-12 months**\nFor self-employed or unstable industries." },
      { type: "callout", title: "💡 Key Insight", text: "Start with $1,000. It's achievable and changes your psychology immediately. You stop panicking about small problems." },
      { type: "action", title: "🎯 Your Action Item", text: "Open a high-yield savings account today (Ally, Marcus, Discover). Set up an automatic weekly transfer—even $25/week is $1,300/year." },
      { type: "summary", title: "Key Takeaways", points: ["Start with $1,000, then build to 3-6 months expenses", "Keep it in a separate high-yield savings account", "Automate your contributions", "An emergency fund turns crises into inconveniences"] }
    ],
    quiz: [
      { question: "What's a good starter emergency fund goal?", options: ["$100", "$500", "$1,000", "$10,000"], correct: 2 },
      { question: "Where should you keep your emergency fund?", options: ["Checking account", "Under your mattress", "High-yield savings account", "Stock market"], correct: 2 },
      { question: "How much should a full emergency fund cover?", options: ["1 month expenses", "3-6 months expenses", "1 year salary", "All your debt"], correct: 1 }
    ]
  },

  "debt-snowball-avalanche": {
    id: "pf-2-1",
    title: "Snowball vs. Avalanche",
    description: "Two proven strategies for paying off debt—which one fits your psychology?",
    duration: "12 min",
    points: 25,
    category: "Personal Finance",
    nextLesson: "credit-score-demystified",
    prevLesson: "emergency-fund",
    content: [
      { type: "intro", text: "Math says pay highest interest first. Psychology says something different. Here's how to choose the debt payoff strategy that you'll actually stick with." },
      { type: "section", title: "The Avalanche Method", text: "List debts by interest rate (highest first). Pay minimums on everything. Throw all extra money at the highest interest debt.\n\n**Pros:** Saves the most money in interest\n**Cons:** Can take longer to see progress" },
      { type: "section", title: "The Snowball Method", text: "List debts by balance (smallest first). Pay minimums on everything. Throw all extra money at the smallest balance.\n\n**Pros:** Quick wins build momentum\n**Cons:** May pay more in total interest" },
      { type: "callout", title: "💡 The Truth", text: "Studies show the snowball method has higher success rates. Personal finance is 80% behavior, 20% math." },
      { type: "summary", title: "Key Takeaways", points: ["Avalanche = highest interest first (saves money)", "Snowball = smallest balance first (builds momentum)", "The best method is the one you'll actually stick with"] }
    ],
    quiz: [
      { question: "Which method pays the highest interest rate first?", options: ["Snowball", "Avalanche", "Neither", "Both"], correct: 1 },
      { question: "Why does the Snowball method often work better?", options: ["It saves more money", "Quick wins build motivation", "Banks prefer it", "It's required by law"], correct: 1 },
      { question: "Personal finance is what percent behavior vs math?", options: ["50/50", "80% behavior, 20% math", "20% behavior, 80% math", "100% math"], correct: 1 }
    ]
  },

  "credit-score-demystified": {
    id: "pf-2-2",
    title: "Credit Score Demystified",
    description: "What actually affects your score and how to improve it strategically.",
    duration: "15 min",
    points: 25,
    category: "Personal Finance",
    nextLesson: "good-debt-bad-debt",
    prevLesson: "debt-snowball-avalanche",
    content: [
      { type: "intro", text: "Your credit score affects your mortgage rate, car loan, apartment approval, and insurance premiums. Here's how it actually works." },
      { type: "section", title: "The Five Factors", text: "**1. Payment History (35%)**\nPay on time. Every time.\n\n**2. Credit Utilization (30%)**\nKeep it under 30%, ideally under 10%.\n\n**3. Length of Credit History (15%)**\nDon't close your oldest card.\n\n**4. Credit Mix (10%)**\nDifferent types help slightly.\n\n**5. New Credit (10%)**\nToo many applications hurt." },
      { type: "callout", title: "💡 The 65% Rule", text: "Payment history + utilization = 65% of your score. Focus here first." },
      { type: "summary", title: "Key Takeaways", points: ["Payment history (35%) and utilization (30%) matter most", "Keep utilization under 30%, ideally under 10%", "Don't close old accounts—length of history helps"] }
    ],
    quiz: [
      { question: "What's the biggest factor in your credit score?", options: ["Credit mix", "Payment history", "New credit", "Age of accounts"], correct: 1 },
      { question: "What utilization rate should you aim for?", options: ["Under 50%", "Under 30%", "Over 75%", "100%"], correct: 1 },
      { question: "Why keep old credit cards open?", options: ["Banks require it", "Helps length of credit history", "You might need them", "Tax benefits"], correct: 1 }
    ]
  },

  "good-debt-bad-debt": {
    id: "pf-2-3",
    title: "Good Debt vs. Bad Debt",
    description: "Not all debt is created equal. Learn which debt builds wealth and which destroys it.",
    duration: "10 min",
    points: 25,
    category: "Personal Finance",
    nextLesson: "investing-101",
    prevLesson: "credit-score-demystified",
    content: [
      { type: "intro", text: "Some debt builds wealth. Some destroys it. Knowing the difference changes everything." },
      { type: "section", title: "Good Debt", text: "• **Finances appreciating assets** — things that grow in value\n• **Has low interest rates** — typically under 7%\n• **Is tax-advantaged** — interest may be deductible\n\nExamples: Mortgage, student loans (sometimes), business loans" },
      { type: "section", title: "Bad Debt", text: "• **Finances depreciating assets** — things that lose value\n• **Has high interest rates** — 15%+ APR\n• **Funds consumption** — stuff you use up\n\nExamples: Credit card debt for shopping, car loans on luxury vehicles" },
      { type: "callout", title: "💡 The Key Question", text: "Ask yourself: Will this debt help me earn more money or own something that grows in value? If no, it's probably bad debt." },
      { type: "summary", title: "Key Takeaways", points: ["Good debt finances appreciating assets at low rates", "Bad debt finances consumption at high rates", "Prioritize eliminating bad debt aggressively"] }
    ],
    quiz: [
      { question: "Which is typically considered 'good debt'?", options: ["Credit card balance", "Vacation loan", "Mortgage", "Payday loan"], correct: 2 },
      { question: "What makes debt 'bad'?", options: ["Any interest rate", "Financing depreciating assets at high rates", "Being over $1,000", "Taking more than a year to pay"], correct: 1 },
      { question: "A car loan is:", options: ["Always good debt", "Always bad debt", "Depends on the situation", "Not really debt"], correct: 2 }
    ]
  },

  "investing-101": {
    id: "pf-3-1",
    title: "Investing 101",
    description: "Stocks, bonds, ETFs, and mutual funds explained in plain English.",
    duration: "20 min",
    points: 50,
    category: "Personal Finance",
    nextLesson: "retirement-accounts",
    prevLesson: "good-debt-bad-debt",
    content: [
      { type: "intro", text: "Investing isn't gambling. It isn't complicated. And it isn't just for the wealthy." },
      { type: "section", title: "The Core Investment Types", text: "**Stocks** — Own a piece of a company. Higher risk, higher return.\n\n**Bonds** — Lend money. Lower risk, lower return.\n\n**ETFs** — A basket of stocks you buy as one thing.\n\n**Mutual Funds** — Similar but often higher fees." },
      { type: "callout", title: "💡 The Simple Truth", text: "For most people, low-cost index ETFs are the answer. They're diversified, cheap, and historically outperform most actively managed funds." },
      { type: "summary", title: "Key Takeaways", points: ["Stocks = ownership, Bonds = loans, ETFs = baskets", "Low-cost index ETFs beat most active funds", "Time in market beats timing the market", "Start simple, invest consistently, think in decades"] }
    ],
    quiz: [
      { question: "What is an ETF?", options: ["A type of bond", "A basket of stocks you buy as one thing", "A savings account", "A cryptocurrency"], correct: 1 },
      { question: "What's the historical average stock market return?", options: ["2-3%", "7-10%", "15-20%", "25-30%"], correct: 1 },
      { question: "What strategy do experts recommend?", options: ["Buy low, sell high", "Day trading", "Invest consistently over time", "Only invest in what you know"], correct: 2 }
    ]
  },

  "retirement-accounts": {
    id: "pf-3-2",
    title: "Retirement Accounts Explained",
    description: "401(k), IRA, Roth IRA—which accounts to use and in what order.",
    duration: "18 min",
    points: 50,
    category: "Personal Finance",
    nextLesson: "compound-interest-magic",
    prevLesson: "investing-101",
    content: [
      { type: "intro", text: "Retirement accounts offer tax advantages worth hundreds of thousands of dollars over your lifetime." },
      { type: "section", title: "The Main Account Types", text: "**401(k)** — Employer-sponsored. Pre-tax. Often has match (FREE MONEY).\n\n**Traditional IRA** — Pre-tax contributions. Tax-deferred growth.\n\n**Roth IRA** — After-tax contributions. TAX-FREE growth and withdrawals.\n\n**HSA** — Triple tax advantage for medical." },
      { type: "callout", title: "💡 The Optimal Order", text: "1. 401(k) up to employer match\n2. Max out HSA if available\n3. Max out Roth IRA\n4. Max out 401(k)\n5. Taxable brokerage" },
      { type: "summary", title: "Key Takeaways", points: ["Always get the full employer 401(k) match—it's free money", "Roth = pay taxes now, tax-free forever", "Start now, even if it's a small amount"] }
    ],
    quiz: [
      { question: "What should you prioritize first?", options: ["Roth IRA", "401(k) up to employer match", "Taxable brokerage", "Savings account"], correct: 1 },
      { question: "What's special about a Roth IRA?", options: ["Higher contribution limits", "Tax-free growth and withdrawals", "Employer matching", "No income limits"], correct: 1 },
      { question: "What's the 2024 401(k) contribution limit?", options: ["$7,000", "$15,000", "$23,000", "$50,000"], correct: 2 }
    ]
  },

  "compound-interest-magic": {
    id: "pf-3-3",
    title: "The Magic of Compound Interest",
    description: "Why starting early matters more than starting big. See the math.",
    duration: "12 min",
    points: 50,
    category: "Personal Finance",
    nextLesson: "index-fund-strategy",
    prevLesson: "retirement-accounts",
    content: [
      { type: "intro", text: "Einstein allegedly called compound interest the eighth wonder of the world. The math is undeniable—and it will change how you think about time and money." },
      { type: "section", title: "What Is Compound Interest?", text: "**Simple interest:** You earn interest on your original amount only.\n$1,000 at 10% = $100/year forever = $2,000 after 10 years\n\n**Compound interest:** You earn interest on your interest.\n$1,000 at 10% compounded = $2,594 after 10 years\n\nThe difference? $594. And it gets more dramatic over time." },
      { type: "example", title: "📊 The Tale of Two Investors", text: "**Early Emma:** Invests $200/month from age 25-35 (10 years), then stops.\nTotal invested: $24,000\n\n**Late Larry:** Invests $200/month from age 35-65 (30 years).\nTotal invested: $72,000\n\nAt age 65 (assuming 8% return):\n• Emma: $427,000\n• Larry: $298,000\n\nEmma invested 1/3 as much but ended up with MORE." },
      { type: "callout", title: "💡 The Key Insight", text: "Time is the most important factor in building wealth. Starting 10 years earlier is worth more than tripling your contributions later." },
      { type: "section", title: "The Rule of 72", text: "A quick way to estimate how long it takes to double your money:\n\n**72 ÷ Interest Rate = Years to Double**\n\n• At 6%: 72 ÷ 6 = 12 years to double\n• At 8%: 72 ÷ 8 = 9 years to double\n• At 10%: 72 ÷ 10 = 7.2 years to double" },
      { type: "action", title: "🎯 Your Action Item", text: "Use a compound interest calculator to see what your current investments will be worth in 20, 30, 40 years. Let that motivate you to start now." },
      { type: "summary", title: "Key Takeaways", points: ["Compound interest = earning interest on your interest", "Time matters more than amount—start early", "Rule of 72: Divide 72 by return rate to find years to double", "Compound interest works against you with debt"] }
    ],
    quiz: [
      { question: "What's the Rule of 72 used for?", options: ["Calculating taxes", "Estimating years to double your money", "Determining retirement age", "Setting budget percentages"], correct: 1 },
      { question: "In the Emma vs Larry example, who ended up with more money?", options: ["Larry (invested 30 years)", "Emma (invested 10 years early)", "They ended up equal", "Neither—both lost money"], correct: 1 },
      { question: "At 8% return, how long to double your money?", options: ["4 years", "9 years", "15 years", "20 years"], correct: 1 }
    ]
  },

  "index-fund-strategy": {
    id: "pf-3-4",
    title: "The Index Fund Strategy",
    description: "Why most professionals can't beat the market—and how you can match it.",
    duration: "15 min",
    points: 50,
    category: "Personal Finance",
    nextLesson: "tax-optimization",
    prevLesson: "compound-interest-magic",
    content: [
      { type: "intro", text: "Here's a secret Wall Street doesn't want you to know: Most professional fund managers fail to beat a simple index fund." },
      { type: "section", title: "What Is an Index Fund?", text: "An index fund tracks a specific market index—it buys all the stocks in that index automatically.\n\n**Popular indices:**\n• **S&P 500** — 500 largest US companies\n• **Total Stock Market** — Entire US market (~4,000 stocks)\n• **Total World** — US + International markets\n\nInstead of trying to pick winning stocks, you own a piece of everything." },
      { type: "section", title: "Why Index Funds Win", text: "**The data is clear:**\n\nOver 15 years, 92% of actively managed funds FAIL to beat the S&P 500 index.\n\n**Why?**\n• **Fees:** Active funds charge 1-2% annually. Index funds charge 0.03-0.20%.\n• **Trading costs:** More buying/selling = more costs\n• **Human error:** Even experts make emotional decisions\n\n**1% fee difference over 30 years on $100,000 = $200,000+ lost to fees**" },
      { type: "callout", title: "💡 Warren Buffett's Advice", text: "Warren Buffett recommends index funds for most people. He bet $1 million that an S&P 500 index fund would beat hedge funds over 10 years. He won." },
      { type: "section", title: "The Simple Portfolio", text: "You can build a world-class portfolio with just 2-3 funds:\n\n**Option 1: One Fund**\n• VT or VTWAX (Total World Stock)\n\n**Option 2: Three Funds**\n• VTI (Total US Stock) — 60%\n• VXUS (Total International) — 20%\n• BND (Total Bond) — 20%\n\nThat's it. Rebalance once a year. Ignore the news." },
      { type: "action", title: "🎯 Your Action Item", text: "If you have a 401(k), find the lowest-cost index fund option. Switch your contributions to that fund." },
      { type: "summary", title: "Key Takeaways", points: ["92% of active managers fail to beat index funds over 15 years", "Low fees compound into massive savings over decades", "A simple 2-3 fund portfolio is all most people need", "Invest consistently, ignore the noise, wait decades"] }
    ],
    quiz: [
      { question: "What percentage of active managers fail to beat the index over 15 years?", options: ["50%", "75%", "92%", "25%"], correct: 2 },
      { question: "What's the main advantage of index funds?", options: ["Higher returns guaranteed", "Lower fees and costs", "More exciting", "Better customer service"], correct: 1 },
      { question: "How often should you rebalance a simple index portfolio?", options: ["Daily", "Weekly", "Monthly", "Once a year"], correct: 3 }
    ]
  },

  "tax-optimization": {
    id: "pf-4-1",
    title: "Tax Optimization Basics",
    description: "Legal strategies to keep more of what you earn.",
    duration: "20 min",
    points: 50,
    category: "Personal Finance",
    nextLesson: "real-estate-intro",
    prevLesson: "index-fund-strategy",
    content: [
      { type: "intro", text: "It's not about how much you make—it's about how much you keep. Legal tax optimization can save you thousands every year." },
      { type: "section", title: "The Tax-Advantaged Account Hierarchy", text: "**Tier 1: Triple Tax Advantage**\n• **HSA** — Pre-tax in, tax-free growth, tax-free out (for medical)\n\n**Tier 2: Double Tax Advantage**\n• **401(k)/IRA** — Pre-tax in, tax-free growth (taxed on withdrawal)\n• **Roth IRA** — After-tax in, tax-free growth, tax-free out\n\n**Tier 3: Single Tax Advantage**\n• **529 Plans** — Tax-free growth for education" },
      { type: "callout", title: "💡 The HSA Secret", text: "If you have a high-deductible health plan, an HSA is the most powerful account available. Max it out before anything else." },
      { type: "section", title: "Common Deductions People Miss", text: "**Above-the-line (everyone gets these):**\n• HSA contributions\n• Traditional IRA contributions\n• Student loan interest (up to $2,500)\n• Self-employment expenses\n\n**Standard deduction 2024:** $14,600 single / $29,200 married\nOnly itemize if your deductions exceed this." },
      { type: "action", title: "🎯 Your Action Item", text: "Review whether you should itemize or take the standard deduction. If you're close, see if you can bunch deductions this year." },
      { type: "summary", title: "Key Takeaways", points: ["HSA is the most tax-advantaged account—max it if eligible", "Standard deduction 2024: $14,600 single / $29,200 married", "Tax-loss harvesting can offset gains and reduce taxes", "Timing matters—bunch deductions wisely"] }
    ],
    quiz: [
      { question: "What account has triple tax advantage?", options: ["401(k)", "Roth IRA", "HSA", "529 Plan"], correct: 2 },
      { question: "What's the 2024 standard deduction for single filers?", options: ["$7,500", "$10,000", "$14,600", "$20,000"], correct: 2 },
      { question: "How much loss can you deduct against regular income per year?", options: ["$1,000", "$3,000", "$5,000", "Unlimited"], correct: 1 }
    ]
  },

  "real-estate-intro": {
    id: "pf-4-2",
    title: "Real Estate Fundamentals",
    description: "Should you rent or buy? Introduction to real estate as an investment.",
    duration: "25 min",
    points: 50,
    category: "Personal Finance",
    nextLesson: "insurance-essentials",
    prevLesson: "tax-optimization",
    content: [
      { type: "intro", text: "Real estate is how many millionaires built their wealth. But it's not right for everyone." },
      { type: "section", title: "Rent vs. Buy: The Real Math", text: "**The myth:** 'Renting is throwing money away.'\n**The reality:** Owning has hidden costs that often exceed rent.\n\n**True cost of owning:**\n• Mortgage interest (also 'thrown away')\n• Property taxes (1-2% of home value annually)\n• Insurance and maintenance (1% of home value/year)\n• Opportunity cost of down payment" },
      { type: "callout", title: "💡 The 5% Rule", text: "Multiply home price by 5% and divide by 12. If rent is less than this, renting may be better financially.\n\n$400,000 home × 5% ÷ 12 = $1,667/month breakeven" },
      { type: "section", title: "When to Buy", text: "Buy when:\n• You'll stay 5+ years\n• You have 20% down\n• Total housing cost is under 28% of income\n• You actually want the responsibilities of ownership" },
      { type: "action", title: "🎯 Your Action Item", text: "If considering buying, run the 5% rule calculation. If considering rental investing, analyze a property using the 1% rule." },
      { type: "summary", title: "Key Takeaways", points: ["Renting isn't 'throwing money away'—run the real numbers", "Only buy if staying 5+ years with 20% down", "REITs offer passive real estate exposure", "For rentals: 1% rule for filtering, cap rate for analysis"] }
    ],
    quiz: [
      { question: "What's the 5% rule used for?", options: ["Down payment calculation", "Rent vs buy comparison", "Mortgage rate", "Property tax estimate"], correct: 1 },
      { question: "What's the 1% rule for rental properties?", options: ["Put 1% down", "Monthly rent should be 1% of price", "Expect 1% annual return", "Spend 1% on maintenance"], correct: 1 },
      { question: "What are REITs?", options: ["A type of mortgage", "Real Estate Investment Trusts", "Rental agreements", "Tax deductions"], correct: 1 }
    ]
  },

  "insurance-essentials": {
    id: "pf-4-3",
    title: "Insurance Essentials",
    description: "What insurance you actually need and what's a waste of money.",
    duration: "15 min",
    points: 50,
    category: "Personal Finance",
    nextLesson: "separate-finances",
    prevLesson: "real-estate-intro",
    content: [
      { type: "intro", text: "Insurance is about protecting against catastrophic loss, not every possible inconvenience." },
      { type: "section", title: "The Insurance Principle", text: "**Insure against:** Losses you can't afford to cover yourself\n**Self-insure against:** Losses you can handle from savings\n\nThis is why you need health insurance ($500K hospital bill) but not phone insurance ($1,000 replacement)." },
      { type: "section", title: "Insurance You NEED", text: "**Health Insurance** — Non-negotiable\n\n**Auto Insurance** — Liability at minimum\n\n**Renters/Homeowners Insurance** — ~$15/month for renters\n\n**Disability Insurance** — Protects your income (often overlooked!)\n\n**Life Insurance (if dependents)** — Term life only, 10-12x annual income" },
      { type: "callout", title: "💡 The Disability Reality", text: "You're more likely to become disabled than to die before 65. Yet most people have life insurance and skip disability." },
      { type: "action", title: "🎯 Your Action Item", text: "Check if you have disability insurance through your employer. If not, get quotes." },
      { type: "summary", title: "Key Takeaways", points: ["Insure catastrophic losses, self-insure small ones", "Must-haves: Health, auto, renters/home, disability, term life (if dependents)", "Skip: Extended warranties, whole life, phone insurance", "Raise deductibles and shop annually to save"] }
    ],
    quiz: [
      { question: "What's the main purpose of insurance?", options: ["Cover all possible losses", "Protect against catastrophic loss you can't afford", "Make money", "Tax benefits"], correct: 1 },
      { question: "Which insurance is often overlooked but important?", options: ["Phone insurance", "Flight insurance", "Disability insurance", "Extended warranties"], correct: 2 },
      { question: "What type of life insurance is recommended?", options: ["Whole life", "Universal life", "Term life", "Variable life"], correct: 2 }
    ]
  },

  "separate-finances": {
    id: "bf-1-1",
    title: "Separate Personal & Business",
    description: "Why mixing finances is dangerous and how to properly separate them.",
    duration: "12 min",
    points: 25,
    category: "Small Business Finance",
    nextLesson: "business-entity-types",
    prevLesson: "insurance-essentials",
    content: [
      { type: "intro", text: "Using your personal bank account for business creates a mess. Here's why separation matters." },
      { type: "section", title: "Why Separation Matters", text: "**Legal Protection** — Mixing can 'pierce the corporate veil'\n\n**Tax Clarity** — The IRS requires clear records\n\n**Professionalism** — Clients see professional invoices\n\n**Sanity** — No more figuring out which purchase was personal vs business" },
      { type: "callout", title: "💡 The $0 Rule", text: "Zero dollars should flow between personal and business accounts without being documented as salary, owner's draw, or capital contribution." },
      { type: "summary", title: "Key Takeaways", points: ["Mixing finances can pierce your liability protection", "The IRS expects clear separation", "Open dedicated business bank account and credit card", "Document every transfer between personal and business"] }
    ],
    quiz: [
      { question: "What can mixing finances do to your LLC protection?", options: ["Strengthen it", "Pierce the corporate veil", "Nothing", "Make it permanent"], correct: 1 },
      { question: "How should you pay for personal expenses?", options: ["Use business card for convenience", "Transfer to personal first, then pay", "Use cash from register", "Have business pay directly"], correct: 1 },
      { question: "What's the '$0 rule'?", options: ["Keep $0 in checking", "No money flows without documentation", "Never pay yourself", "Keep business at $0 profit"], correct: 1 }
    ]
  },

  "business-entity-types": {
    id: "bf-1-2",
    title: "Business Entity Types",
    description: "LLC, S-Corp, C-Corp, Sole Proprietor—which structure is right for you?",
    duration: "20 min",
    points: 25,
    category: "Small Business Finance",
    nextLesson: "business-banking",
    prevLesson: "separate-finances",
    content: [
      { type: "intro", text: "Your business structure affects your taxes, liability, and paperwork. Choose wrong and you'll overpay or expose yourself to risk." },
      { type: "section", title: "Sole Proprietorship", text: "**What it is:** You and your business are the same legal entity.\n\n**Pros:** No paperwork, simple taxes\n**Cons:** NO liability protection\n\n**Best for:** Testing ideas, very low-risk businesses" },
      { type: "section", title: "LLC", text: "**What it is:** Separate legal entity that protects your personal assets.\n\n**Pros:** Liability protection, flexible taxation\n**Cons:** Annual fees, some paperwork\n\n**Best for:** Most small businesses, freelancers" },
      { type: "callout", title: "💡 The S-Corp Sweet Spot", text: "Once your profit exceeds ~$50K, an S-Corp election can save $5,000+ annually in self-employment taxes." },
      { type: "summary", title: "Key Takeaways", points: ["Sole proprietor = no protection, LLC = protection", "S-Corp election can save big on taxes at $50K+ profit", "Consult a CPA when in doubt"] }
    ],
    quiz: [
      { question: "What's the main benefit of an LLC over sole proprietorship?", options: ["Lower taxes", "Liability protection", "Less paperwork", "No fees"], correct: 1 },
      { question: "When does S-Corp election typically make sense?", options: ["Any revenue level", "Over $50K profit", "Only for corporations", "Never for small business"], correct: 1 },
      { question: "What's 'double taxation' in a C-Corp?", options: ["Paying twice a year", "Corporate tax + personal tax on dividends", "State + federal tax", "A penalty"], correct: 1 }
    ]
  },

  "business-banking": {
    id: "bf-1-3",
    title: "Business Banking Setup",
    description: "Choosing accounts, managing cash, and building business credit.",
    duration: "15 min",
    points: 25,
    category: "Small Business Finance",
    nextLesson: "cash-flow-basics",
    prevLesson: "business-entity-types",
    content: [
      { type: "intro", text: "Your business banking setup is the foundation of your financial operations." },
      { type: "section", title: "Account Structure", text: "**Essential: Operating Checking** — Day-to-day transactions\n\n**Recommended: Tax Savings Account** — Set aside 25-30% for quarterly taxes\n\n**Optional: Profit Account** — Separate your profit before expenses" },
      { type: "callout", title: "💡 The Tax Trap", text: "Many business owners spend their 'profit' then can't pay quarterly taxes. Open a separate tax savings account and auto-transfer 25-30% of every deposit." },
      { type: "summary", title: "Key Takeaways", points: ["Minimum setup: Operating checking + Tax savings account", "Auto-transfer 25-30% of revenue to tax savings", "Start building business credit early—it takes time"] }
    ],
    quiz: [
      { question: "What percentage should you set aside for taxes?", options: ["5-10%", "15-20%", "25-30%", "50%"], correct: 2 },
      { question: "What's the minimum account setup for a business?", options: ["Just checking", "Checking + tax savings", "Checking + savings + investment", "Personal account is fine"], correct: 1 },
      { question: "How do you start building business credit?", options: ["Wait for it to build automatically", "Get a business credit card and pay on time", "Use personal credit only", "Borrow from banks"], correct: 1 }
    ]
  },

  "cash-flow-basics": {
    id: "bf-2-1",
    title: "Cash Flow Basics",
    description: "Revenue vs. profit vs. cash flow—why profitable businesses still fail.",
    duration: "15 min",
    points: 50,
    category: "Small Business Finance",
    nextLesson: "invoice-collections",
    prevLesson: "business-banking",
    content: [
      { type: "intro", text: "More businesses fail from poor cash flow than from lack of profit. You can be profitable on paper and still run out of money." },
      { type: "section", title: "The Three Metrics", text: "**Revenue (Top Line)** — Total money coming in before expenses\n\n**Profit (Bottom Line)** — Revenue minus expenses. What's 'left over' on paper.\n\n**Cash Flow** — Actual money moving in and out. THIS keeps you alive." },
      { type: "callout", title: "💡 The Cash Flow Paradox", text: "A business can show $50,000 profit on paper but have $0 in the bank. How? Timing. You paid suppliers today but customers pay you in 60 days." },
      { type: "section", title: "Cash Flow Best Practices", text: "1. **Invoice immediately** — Same day work is complete\n2. **Shorten payment terms** — Net 15 instead of Net 30\n3. **Offer early payment discounts** — 2/10 net 30\n4. **Build a cash reserve** — 3-6 months operating expenses\n5. **Monitor weekly** — Know your cash position" },
      { type: "action", title: "🎯 Your Action Item", text: "Calculate your cash runway: How many months can you operate with current cash if no new revenue came in?" },
      { type: "summary", title: "Key Takeaways", points: ["Cash flow ≠ profit—you can be profitable and still fail", "Timing is everything: collect fast, pay slower", "Keep 3-6 months expenses in reserve", "Monitor cash weekly, not monthly"] }
    ],
    quiz: [
      { question: "Can a profitable business run out of cash?", options: ["No, profit means you have cash", "Yes, due to timing differences", "Only if they're lying about profit", "Profit and cash are the same"], correct: 1 },
      { question: "What's 'cash runway'?", options: ["How fast money moves", "Months you can survive without revenue", "Total revenue potential", "Bank account balance"], correct: 1 },
      { question: "How often should you monitor cash flow?", options: ["Yearly", "Quarterly", "Monthly", "Weekly"], correct: 3 }
    ]
  },

  "invoice-collections": {
    id: "bf-2-2",
    title: "Invoicing & Collections",
    description: "Get paid faster with better invoicing practices.",
    duration: "12 min",
    points: 50,
    category: "Small Business Finance",
    nextLesson: "bookkeeping-basics",
    prevLesson: "cash-flow-basics",
    content: [
      { type: "intro", text: "You did the work. Now get paid. Poor invoicing habits leave money on the table." },
      { type: "section", title: "Invoicing Best Practices", text: "**Invoice immediately** — Same day work is completed\n\n**Be crystal clear** — Detailed description, clear due date, payment options\n\n**Make payment easy** — Accept cards, ACH, PayPal\n\n**Use professional software** — QuickBooks, FreshBooks, Wave" },
      { type: "callout", title: "💡 Payment Terms Psychology", text: "'Due in 7 days' often performs just as well as 'Due upon receipt' while seeming more reasonable to clients." },
      { type: "section", title: "Getting Paid Faster", text: "• **Early payment discount** — 2/10 Net 30 (2% off if paid in 10 days)\n• **Require deposits** — 50% upfront on large projects\n• **Late fees** — 1.5% per month is standard\n• **Shorter terms** — Net 15 instead of Net 30" },
      { type: "action", title: "🎯 Your Action Item", text: "Review your current invoicing terms. If you're using Net 30, test Net 15 with new clients." },
      { type: "summary", title: "Key Takeaways", points: ["Invoice immediately—same day if possible", "Offer early payment discounts (2/10 Net 30)", "Make payment easy—multiple options", "Have a systematic collection process"] }
    ],
    quiz: [
      { question: "When should you send an invoice?", options: ["End of month", "When you remember", "Same day work is completed", "When client asks"], correct: 2 },
      { question: "What does '2/10 Net 30' mean?", options: ["2% interest after 10 days", "2% discount if paid in 10 days", "Pay $2 in 10-30 days", "2 invoices due"], correct: 1 },
      { question: "What's the first step when an invoice is past due?", options: ["Send to collections", "Call their lawyer", "Friendly reminder email", "Add late fees immediately"], correct: 2 }
    ]
  },

  "bookkeeping-basics": {
    id: "bf-3-1",
    title: "Bookkeeping Basics",
    description: "Chart of accounts, double-entry, and keeping organized records.",
    duration: "20 min",
    points: 50,
    category: "Small Business Finance",
    nextLesson: "financial-statements",
    prevLesson: "invoice-collections",
    content: [
      { type: "intro", text: "Good bookkeeping isn't exciting, but it's the foundation of business finance. Get it wrong and tax time becomes a nightmare." },
      { type: "section", title: "The Five Account Categories", text: "**1. Assets** — What you own (cash, receivables, equipment)\n\n**2. Liabilities** — What you owe (credit cards, loans)\n\n**3. Equity** — Owner's investment and retained earnings\n\n**4. Revenue** — Money you earn\n\n**5. Expenses** — Money you spend" },
      { type: "callout", title: "💡 Don't Memorize, Use Software", text: "You don't need to memorize debit/credit rules. Accounting software like QuickBooks handles it automatically." },
      { type: "section", title: "Bookkeeping Cadence", text: "**Weekly:** Categorize transactions, send invoices\n\n**Monthly:** Reconcile all accounts, review P&L\n\n**Quarterly:** Review year-to-date, pay estimated taxes" },
      { type: "action", title: "🎯 Your Action Item", text: "Set up recurring calendar reminders: Weekly for categorization, monthly for reconciliation, quarterly for tax review." },
      { type: "summary", title: "Key Takeaways", points: ["Five categories: Assets, Liabilities, Equity, Revenue, Expenses", "Use accounting software—don't do it manually", "Monthly reconciliation is non-negotiable", "Keep receipts and scan them digitally"] }
    ],
    quiz: [
      { question: "What are the five main account categories?", options: ["Cash, Credit, Debit, Revenue, Expense", "Assets, Liabilities, Equity, Revenue, Expenses", "Income, Outcome, Balance, Credit, Debit", "Sales, Costs, Profit, Loss, Cash"], correct: 1 },
      { question: "How often should you reconcile accounts?", options: ["Yearly", "Quarterly", "Monthly", "Never"], correct: 2 },
      { question: "What's the best approach to bookkeeping?", options: ["Manual spreadsheets", "Use accounting software", "Wait until tax time", "Hire someone immediately"], correct: 1 }
    ]
  },

  "financial-statements": {
    id: "bf-3-2",
    title: "Reading Financial Statements",
    description: "P&L, Balance Sheet, Cash Flow Statement—what they tell you.",
    duration: "25 min",
    points: 50,
    category: "Small Business Finance",
    nextLesson: "business-tax-basics",
    prevLesson: "bookkeeping-basics",
    content: [
      { type: "intro", text: "Financial statements are the scorecard of your business. Learn to read them and you'll make better decisions." },
      { type: "section", title: "Profit & Loss (Income Statement)", text: "**What it shows:** Revenue minus expenses over a period\n\nRevenue\n- Cost of Goods Sold\n= Gross Profit\n- Operating Expenses\n= Net Profit\n\n**Key question:** Are we profitable?" },
      { type: "section", title: "Balance Sheet", text: "**What it shows:** What you own, owe, and equity at a point in time\n\n**The equation:** Assets = Liabilities + Equity\n\n**Key question:** Can we pay our bills?" },
      { type: "callout", title: "💡 The Relationship", text: "P&L shows profitability. Balance Sheet shows position. Cash Flow shows liquidity. You need all three." },
      { type: "section", title: "Key Ratios", text: "**Gross Margin** = Gross Profit ÷ Revenue\n\n**Net Margin** = Net Profit ÷ Revenue (10-20% is healthy)\n\n**Current Ratio** = Current Assets ÷ Current Liabilities (above 1.5 is comfortable)" },
      { type: "action", title: "🎯 Your Action Item", text: "Pull your P&L and Balance Sheet. Calculate your gross margin, net margin, and current ratio." },
      { type: "summary", title: "Key Takeaways", points: ["P&L = profitability, Balance Sheet = position, Cash Flow = liquidity", "All three together give the complete picture", "Key ratios: Gross margin, net margin, current ratio"] }
    ],
    quiz: [
      { question: "What does the P&L show?", options: ["What you own", "Revenue minus expenses over time", "Cash in and out", "What you owe"], correct: 1 },
      { question: "What's the Balance Sheet equation?", options: ["Revenue - Expenses = Profit", "Assets = Liabilities + Equity", "Cash In - Cash Out = Balance", "Sales - COGS = Margin"], correct: 1 },
      { question: "What does a Current Ratio above 1.5 indicate?", options: ["Too much debt", "Comfortable ability to pay bills", "Unprofitable", "Too much inventory"], correct: 1 }
    ]
  },

  "business-tax-basics": {
    id: "bf-4-1",
    title: "Business Tax Basics",
    description: "Estimated taxes, quarterly payments, and deductions.",
    duration: "20 min",
    points: 75,
    category: "Small Business Finance",
    nextLesson: "tax-deductions-business",
    prevLesson: "financial-statements",
    content: [
      { type: "intro", text: "Business taxes are more complex than employee taxes. Understanding the basics keeps you out of trouble and saves money." },
      { type: "section", title: "How Business Income Is Taxed", text: "**Sole Proprietor / LLC:** Income flows to personal return. You pay:\n• Income tax on profit\n• Self-employment tax (15.3%) on profit\n\n**S-Corporation:** Pay yourself salary + distributions\n• Salary: Income tax + FICA\n• Distributions: Income tax only (no SE tax)\nThis is the S-Corp tax savings!" },
      { type: "section", title: "Quarterly Estimated Taxes", text: "**Due dates:**\n• Q1: April 15\n• Q2: June 15\n• Q3: September 15\n• Q4: January 15\n\n**Safe harbor:** Pay 100% of last year's tax (110% if income over $150K)" },
      { type: "callout", title: "💡 The Tax Savings Account", text: "Every time revenue comes in, transfer 25-30% to a separate tax savings account. When quarterly payments are due, the money is there." },
      { type: "action", title: "🎯 Your Action Item", text: "Calculate your quarterly estimated tax payment. Set up calendar reminders for all four due dates." },
      { type: "summary", title: "Key Takeaways", points: ["Self-employed pay 15.3% SE tax PLUS income tax", "Quarterly taxes due in April, June, September, January", "Set aside 25-30% of revenue for taxes", "S-Corp can reduce SE tax at $50K+ profit"] }
    ],
    quiz: [
      { question: "What is the self-employment tax rate?", options: ["7.65%", "15.3%", "21%", "25%"], correct: 1 },
      { question: "When is Q3 estimated tax payment due?", options: ["July 15", "August 15", "September 15", "October 15"], correct: 2 },
      { question: "What percentage should you set aside for taxes?", options: ["10-15%", "25-30%", "40-50%", "5-10%"], correct: 1 }
    ]
  },

  "tax-deductions-business": {
    id: "bf-4-2",
    title: "Maximizing Business Deductions",
    description: "Home office, vehicles, travel, and more.",
    duration: "18 min",
    points: 75,
    category: "Small Business Finance",
    nextLesson: "pricing-strategy",
    prevLesson: "business-tax-basics",
    content: [
      { type: "intro", text: "Every legitimate deduction reduces your taxable income. Here's what you might be overlooking." },
      { type: "section", title: "Home Office Deduction", text: "**Simplified Method:** $5 per square foot, up to 300 sq ft = $1,500 max\n\n**Regular Method:** Calculate percentage of home used for business. Deduct that % of rent, utilities, insurance, repairs." },
      { type: "section", title: "Vehicle Deductions", text: "**Standard Mileage Rate (2024):** 67 cents per business mile\n\n**Actual Expenses:** Track all costs, deduct business percentage\n\n**Important:** Commuting is NOT deductible. Home office to client IS." },
      { type: "section", title: "Commonly Missed Deductions", text: "• **Business meals:** 50% deductible\n• **Professional development:** Courses, books, conferences\n• **Software & subscriptions**\n• **Health insurance premiums:** 100% for self-employed\n• **Retirement contributions:** SEP-IRA, Solo 401(k)\n• **Internet & phone:** Business percentage" },
      { type: "callout", title: "💡 Documentation Rule", text: "No documentation = no deduction. Keep receipts. Note the business purpose. Use a dedicated business credit card." },
      { type: "action", title: "🎯 Your Action Item", text: "Review this list against your current deductions. Are you tracking mileage? Taking the home office deduction?" },
      { type: "summary", title: "Key Takeaways", points: ["Home office: $5/sq ft simplified or actual expenses", "Vehicle: 67¢/mile standard or actual expenses", "Health insurance is 100% deductible for self-employed", "Document everything—no receipt, no deduction"] }
    ],
    quiz: [
      { question: "What's the 2024 standard mileage rate?", options: ["50 cents/mile", "58 cents/mile", "67 cents/mile", "72 cents/mile"], correct: 2 },
      { question: "What percentage of business meals is deductible?", options: ["25%", "50%", "75%", "100%"], correct: 1 },
      { question: "What's the simplified home office deduction rate?", options: ["$3/sq ft", "$5/sq ft", "$10/sq ft", "Percentage of rent"], correct: 1 }
    ]
  },

  "pricing-strategy": {
    id: "bf-5-1",
    title: "Pricing Strategy",
    description: "How to price for profit, not just revenue.",
    duration: "18 min",
    points: 75,
    category: "Small Business Finance",
    nextLesson: null,
    prevLesson: "tax-deductions-business",
    content: [
      { type: "intro", text: "Underpricing is the most common small business mistake. You work hard, make sales, and still struggle. The problem isn't your work—it's your price." },
      { type: "section", title: "The Underpricing Trap", text: "**Why businesses underprice:**\n• Fear of losing customers\n• Lack of confidence\n• Not knowing true costs\n• Racing to the bottom\n\n**The result:** Working constantly but not profiting" },
      { type: "section", title: "Cost-Plus Pricing", text: "**Formula:**\nPrice = (Direct Costs + Indirect Costs) × (1 + Profit Margin)\n\n**Example:**\nProduct costs $20 to make\nOverhead adds $10\nYou want 30% margin\nPrice = $30 × 1.30 = $39" },
      { type: "section", title: "Value-Based Pricing", text: "**Better approach:** Price based on value to customer, not your costs.\n\nIf you save a business $50,000/year, charging $5,000 is a bargain.\n\n**Questions to ask:**\n• What would they pay someone else?\n• What's the cost of NOT solving this?\n• What's the ROI of your solution?" },
      { type: "callout", title: "💡 The Confidence Test", text: "If you're not occasionally losing deals because of price, you're probably too cheap. Raise prices until 20-30% of prospects push back." },
      { type: "action", title: "🎯 Your Action Item", text: "Calculate your true hourly rate including ALL overhead. If it's not at least 3x what you'd earn as an employee, your prices are too low." },
      { type: "summary", title: "Key Takeaways", points: ["Underpricing kills more businesses than overpricing", "Include ALL costs—most underestimate overhead", "Value-based pricing beats cost-plus for services", "If you never lose deals on price, you're too cheap"] }
    ],
    quiz: [
      { question: "What's the most common pricing mistake?", options: ["Overpricing", "Underpricing", "Complicated pricing", "No pricing"], correct: 1 },
      { question: "What does value-based pricing focus on?", options: ["Your costs", "Competitor prices", "Value to customer", "Industry averages"], correct: 2 },
      { question: "What percentage of prospects should push back on price?", options: ["0%", "20-30%", "50%", "100%"], correct: 1 }
    ]
  }
};

// ===========================================
// MAIN COMPONENT
// ===========================================
export default function FinanceLessonPage({ lesson }: { lesson: LessonData | null }) {
  const { currentUser } = useAuth();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkCompletion() {
      if (currentUser?.uid && lesson) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const completed = userDoc.data()?.completedLessons || [];
            setIsCompleted(completed.includes(lesson.id));
          }
        } catch (error) {
          console.error("Error checking completion:", error);
        }
      }
    }
    checkCompletion();
  }, [currentUser, lesson]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#003B49] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#FF9151] mb-4">Lesson Not Found</h1>
          <Link href="/learn/finance" className="text-[#15C5C1] underline">← Back to Finance Training</Link>
        </div>
      </div>
    );
  }

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleQuizSubmit = async () => {
    setQuizSubmitted(true);
    const allCorrect = lesson.quiz.every((q, i) => quizAnswers[i] === q.correct);
    
    if (allCorrect && currentUser?.uid && !isCompleted) {
      setSaving(true);
      try {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, {
          completedLessons: arrayUnion(lesson.id),
          points: increment(lesson.points)
        });
        setIsCompleted(true);
      } catch (error) {
        console.error("Error saving completion:", error);
      }
      setSaving(false);
    }
  };

  const quizScore = quizSubmitted ? lesson.quiz.filter((q, i) => quizAnswers[i] === q.correct).length : 0;

  return (
    <>
      <Head>
        <title>{lesson.title} | Finance Training | RewmoAI</title>
        <meta name="description" content={lesson.description} />
      </Head>

      <div className="min-h-screen bg-[#003B49]">
        <div className="border-b border-white/10 bg-[#002530]">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <Link href="/learn/finance" className="text-[#15C5C1] hover:text-white text-sm flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back to Finance Training
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm text-[#B6E7EB] mb-2">
              <span className="px-2 py-1 bg-[#15C5C1]/20 rounded">{lesson.category}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {lesson.duration}</span>
              <span className="flex items-center gap-1 text-[#FF9151]"><Award className="w-4 h-4" /> +{lesson.points} pts</span>
              {isCompleted && <span className="flex items-center gap-1 text-green-400"><CheckCircle className="w-4 h-4" /> Completed</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{lesson.title}</h1>
            <p className="text-lg text-[#B6E7EB]">{lesson.description}</p>
          </div>

          <div className="space-y-6 mb-12">
            {lesson.content.map((block, index) => <ContentBlockComponent key={index} block={block} />)}
          </div>

          {!showQuiz ? (
            <div className="bg-[#072b33] rounded-2xl p-8 border border-[#15C5C1]/20 text-center">
              <BookOpen className="w-12 h-12 text-[#15C5C1] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Test Your Knowledge?</h2>
              <p className="text-[#B6E7EB] mb-6">Complete the quiz to earn {lesson.points} points.</p>
              <button onClick={() => setShowQuiz(true)} className="px-8 py-3 bg-[#15C5C1] text-[#003B49] font-bold rounded-xl hover:bg-[#1ad4d0] transition">
                Start Quiz
              </button>
            </div>
          ) : (
            <div className="bg-[#072b33] rounded-2xl p-8 border border-[#15C5C1]/20">
              <h2 className="text-2xl font-bold text-white mb-6">📝 Quiz</h2>
              <div className="space-y-6">
                {lesson.quiz.map((q, qIndex) => (
                  <div key={qIndex} className="bg-[#003B49] rounded-xl p-6">
                    <p className="text-white font-medium mb-4">{qIndex + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, oIndex) => {
                        const isSelected = quizAnswers[qIndex] === oIndex;
                        const isCorrect = q.correct === oIndex;
                        const showResult = quizSubmitted;
                        return (
                          <button key={oIndex} onClick={() => !quizSubmitted && handleQuizAnswer(qIndex, oIndex)} disabled={quizSubmitted}
                            className={`w-full text-left p-3 rounded-lg border transition ${showResult ? isCorrect ? "bg-green-500/20 border-green-500 text-green-400" : isSelected ? "bg-red-500/20 border-red-500 text-red-400" : "border-white/10 text-slate-400" : isSelected ? "bg-[#15C5C1]/20 border-[#15C5C1] text-white" : "border-white/10 text-slate-300 hover:border-white/30"}`}>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {!quizSubmitted ? (
                <button onClick={handleQuizSubmit} disabled={quizAnswers.filter(a => a !== undefined).length !== lesson.quiz.length}
                  className="mt-6 w-full py-3 bg-[#FF9151] text-[#003B49] font-bold rounded-xl hover:bg-[#FFA36C] transition disabled:opacity-50">
                  Submit Quiz
                </button>
              ) : (
                <div className="mt-6 text-center">
                  <div className={`text-2xl font-bold mb-2 ${quizScore === lesson.quiz.length ? 'text-green-400' : 'text-yellow-400'}`}>
                    {quizScore}/{lesson.quiz.length} Correct
                  </div>
                  {quizScore === lesson.quiz.length ? (
                    <p className="text-green-400">🎉 Perfect! You earned +{lesson.points} points!</p>
                  ) : (
                    <button onClick={() => { setQuizSubmitted(false); setQuizAnswers([]); }}
                      className="px-6 py-2 bg-[#15C5C1]/20 text-[#15C5C1] rounded-lg hover:bg-[#15C5C1]/30 transition">
                      Try Again
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/10">
            {lesson.prevLesson ? (
              <Link href={`/learn/finance/${lesson.prevLesson}`} className="flex items-center gap-2 text-[#B6E7EB] hover:text-white">
                <ChevronLeft className="w-5 h-5" /> Previous Lesson
              </Link>
            ) : <div />}
            {lesson.nextLesson && (
              <Link href={`/learn/finance/${lesson.nextLesson}`} className="flex items-center gap-2 px-6 py-2 bg-[#15C5C1] text-[#003B49] font-bold rounded-lg hover:bg-[#1ad4d0] transition">
                Next Lesson <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ContentBlockComponent({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "intro":
      return <p className="text-xl text-[#B6E7EB] italic border-l-4 border-[#FF9151] pl-4">{block.text}</p>;
    case "section":
      return (
        <div>
          {block.title && <h2 className="text-xl font-bold text-[#15C5C1] mb-3">{block.title}</h2>}
          <div className="text-[#B6E7EB] whitespace-pre-line leading-relaxed">
            {block.text?.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white">{part}</strong> : part)}
          </div>
        </div>
      );
    case "callout":
      return (
        <div className="bg-[#15C5C1]/10 border border-[#15C5C1]/30 rounded-xl p-6">
          {block.title && <h3 className="font-bold text-[#15C5C1] mb-2">{block.title}</h3>}
          <p className="text-white">{block.text}</p>
        </div>
      );
    case "action":
      return (
        <div className="bg-[#FF9151]/10 border border-[#FF9151]/30 rounded-xl p-6">
          {block.title && <h3 className="font-bold text-[#FF9151] mb-2">{block.title}</h3>}
          <p className="text-white">{block.text}</p>
        </div>
      );
    case "example":
      return (
        <div className="bg-[#072b33] border border-white/10 rounded-xl p-6">
          {block.title && <h3 className="font-bold text-white mb-2">{block.title}</h3>}
          <p className="text-[#B6E7EB] whitespace-pre-line">{block.text}</p>
        </div>
      );
    case "summary":
      return (
        <div className="bg-[#003B49] border border-[#15C5C1]/30 rounded-xl p-6">
          {block.title && <h3 className="font-bold text-[#15C5C1] mb-3">{block.title}</h3>}
          <ul className="space-y-2">
            {block.points?.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-white">
                <CheckCircle className="w-5 h-5 text-[#15C5C1] flex-shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      );
    default:
      return null;
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(LESSON_CONTENT).map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const lesson = LESSON_CONTENT[slug] || null;
  return { props: { lesson } };
};
