// COMPLETE LESSON_CONTENT for src/pages/learn/finance/[slug].tsx
// Replace the existing LESSON_CONTENT object with this expanded version

const LESSON_CONTENT: Record<string, LessonData> = {
  // =============================================
  // PERSONAL FINANCE - FINANCIAL FOUNDATIONS
  // =============================================
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
      {
        type: "intro",
        text: "$5 seems like nothing. A coffee. A snack. Forgettable. But what if that $5 could change your life?"
      },
      {
        type: "section",
        title: "The Math That Changes Everything",
        text: `$5 a day is:
• **$150 a month**
• **$1,825 a year**
• **$18,250 over a decade**

But here's where it gets interesting. Invested at a 7% average return, that $5/day becomes **$25,000+ in 10 years**.

Over 30 years? **$185,000+**.

From five dollars. Every day.`
      },
      {
        type: "section",
        title: "The Hidden Wealth Leak",
        text: `Most people don't feel poor because of big expenses. They feel poor because of hundreds of small ones that add up invisibly.

The daily coffee. The subscription you forgot about. The convenience store snack. The "it's only $5" purchases.

None of these feel significant in the moment. But they compound—against you.`
      },
      {
        type: "callout",
        title: "💡 Key Insight",
        text: "The same compound interest that can make you wealthy works against you when you spend instead of save. Every $5 spent is $25+ lost over time."
      },
      {
        type: "section",
        title: "The Fix: Awareness, Not Deprivation",
        text: `The solution isn't dramatic sacrifice. It's awareness.

When you see where the $5 goes, you can redirect it. Not deprivation—redirection.

**Try this:** For one week, note every purchase under $10. Add it up at the end. That number is your hidden wealth leak.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Track every purchase under $10 for the next 7 days. Use your phone's notes app or a simple spreadsheet. At the end of the week, calculate your total. That's your potential monthly savings × 12 for annual impact."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "$5/day = $1,825/year = $25,000+ in 10 years (invested)",
          "Small expenses compound against you invisibly",
          "Awareness beats deprivation—see where money goes",
          "Redirect, don't restrict"
        ]
      }
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
      {
        type: "intro",
        text: "Budgeting doesn't have to be complicated. The 50/30/20 rule gives you a simple framework that actually works."
      },
      {
        type: "section",
        title: "The 50/30/20 Breakdown",
        text: `**50% — Needs**
Housing, utilities, groceries, insurance, minimum debt payments, transportation to work. Things you literally cannot live without.

**30% — Wants**
Dining out, entertainment, hobbies, vacations, upgrades, subscriptions. Nice to have, not need to have.

**20% — Savings & Debt**
Emergency fund, retirement, investments, extra debt payments. Future you.`
      },
      {
        type: "callout",
        title: "💡 Why This Works",
        text: "The 50/30/20 rule works because it's simple enough to actually follow. No tracking every penny. No guilt about enjoying life. Just three buckets."
      },
      {
        type: "section",
        title: "How to Apply It",
        text: `1. **Calculate your after-tax income** (what hits your bank account)
2. **Multiply by the percentages:**
   - Needs: Income × 0.50
   - Wants: Income × 0.30
   - Savings: Income × 0.20
3. **Compare to your actual spending**
4. **Adjust where needed**`
      },
      {
        type: "example",
        title: "📊 Example: $4,000/month take-home",
        text: `• Needs (50%): $2,000 — rent, utilities, groceries, car payment
• Wants (30%): $1,200 — dining, entertainment, shopping
• Savings (20%): $800 — retirement, emergency fund, investments`
      },
      {
        type: "section",
        title: "What If Your Needs Exceed 50%?",
        text: `This is common, especially in high cost-of-living areas. Options:

1. **Increase income** — side gig, raise, new job
2. **Reduce housing costs** — roommate, different area, negotiate rent
3. **Temporarily adjust ratios** — 60/20/20 while you work on it
4. **Eliminate car payment** — this is often the hidden budget killer`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Calculate your personal 50/30/20 numbers using your actual take-home pay. Then look at last month's spending. Where do you actually stand? No judgment—just awareness."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "50% Needs, 30% Wants, 20% Savings",
          "Simple beats complicated for budgeting",
          "If needs exceed 50%, focus on housing and transportation",
          "Adjust ratios temporarily if needed, but always save something"
        ]
      }
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
      {
        type: "intro",
        text: "Most people have no idea where their money goes. They make decent income but feel broke. The problem isn't earning—it's awareness."
      },
      {
        type: "section",
        title: "Why Tracking Matters",
        text: `You can't fix what you can't see. Tracking your spending reveals:

• **Forgotten subscriptions** you're still paying for
• **Lifestyle creep** that happened gradually
• **Emotional spending** patterns you didn't notice
• **Categories** where you spend way more than you thought

Most people are shocked when they first track. "I spent HOW MUCH on food delivery?"`
      },
      {
        type: "section",
        title: "Three Ways to Track",
        text: `**Method 1: The App Approach**
Use Mint, YNAB, Copilot, or your bank's built-in tools. Automatic categorization. Least effort.

**Method 2: The Spreadsheet**
Download transactions monthly. Categorize yourself. More control, more awareness.

**Method 3: The Envelope System**
Cash in physical envelopes for each category. When it's gone, it's gone. Most restrictive but most effective for overspenders.`
      },
      {
        type: "callout",
        title: "💡 The Best Method",
        text: "The best tracking method is the one you'll actually use. A simple system you follow beats a complex system you abandon."
      },
      {
        type: "section",
        title: "What to Track",
        text: `Start with these categories:

• **Housing** — rent/mortgage, utilities, insurance
• **Transportation** — car payment, gas, insurance, maintenance
• **Food** — groceries AND dining out (separate these!)
• **Subscriptions** — streaming, gym, apps, memberships
• **Shopping** — clothes, Amazon, random purchases
• **Entertainment** — events, hobbies, drinks
• **Debt payments** — credit cards, loans`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Pick ONE tracking method and commit to it for 30 days. At month end, categorize everything and calculate your actual 50/30/20 split. Compare to your target."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "You can't improve what you don't measure",
          "Most people are shocked by their actual spending",
          "Choose a tracking method you'll actually stick with",
          "Separate groceries from dining out—they're very different"
        ]
      }
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
      {
        type: "intro",
        text: "An emergency fund is the foundation of financial security. Without one, every unexpected expense becomes a crisis."
      },
      {
        type: "section",
        title: "Why You Need One",
        text: `Life happens:
• Car breaks down: $500-2,000
• Medical emergency: $1,000+
• Job loss: Months of expenses
• Home repair: $500-5,000

Without savings, these become debt. With an emergency fund, they become inconveniences.

**The stress difference is enormous.** Financial security isn't about being rich—it's about being prepared.`
      },
      {
        type: "section",
        title: "How Much Do You Need?",
        text: `**Starter Goal: $1,000**
This handles most small emergencies and breaks the paycheck-to-paycheck cycle.

**Standard Goal: 3-6 months of expenses**
If you spend $3,000/month, aim for $9,000-18,000.

**Enhanced Goal: 6-12 months**
For self-employed, single income households, or unstable industries.`
      },
      {
        type: "callout",
        title: "💡 Key Insight",
        text: "Start with $1,000. It's achievable and changes your psychology immediately. You stop panicking about small problems."
      },
      {
        type: "section",
        title: "How to Build It Fast",
        text: `**1. Open a separate savings account**
Out of sight, out of mind. Different bank is even better.

**2. Automate transfers**
$50/week = $2,600/year. Set it and forget it.

**3. Windfall rule**
Tax refunds, bonuses, gifts—50% goes to emergency fund until it's full.

**4. Temporary cuts**
Pause subscriptions for 3 months. That's $50-200/month toward your fund.`
      },
      {
        type: "section",
        title: "Where to Keep It",
        text: `**High-yield savings account** — Currently earning 4-5% APY

NOT in:
• Checking (too easy to spend)
• Investments (too volatile)
• CDs (not accessible enough)
• Cash at home (no interest, tempting)`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Open a high-yield savings account today (Ally, Marcus, Discover all work). Set up an automatic weekly transfer of whatever you can afford—even $25/week is $1,300/year."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Start with $1,000, then build to 3-6 months expenses",
          "Keep it in a separate high-yield savings account",
          "Automate your contributions",
          "An emergency fund turns crises into inconveniences"
        ]
      }
    ],
    quiz: [
      { question: "What's a good starter emergency fund goal?", options: ["$100", "$500", "$1,000", "$10,000"], correct: 2 },
      { question: "Where should you keep your emergency fund?", options: ["Checking account", "Under your mattress", "High-yield savings account", "Stock market"], correct: 2 },
      { question: "How much should a full emergency fund cover?", options: ["1 month expenses", "3-6 months expenses", "1 year salary", "All your debt"], correct: 1 }
    ]
  },

  // =============================================
  // PERSONAL FINANCE - CONQUERING DEBT
  // =============================================
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
      {
        type: "intro",
        text: "Math says pay highest interest first. Psychology says something different. Here's how to choose the debt payoff strategy that you'll actually stick with."
      },
      {
        type: "section",
        title: "The Avalanche Method (Math Optimal)",
        text: `**How it works:**
1. List debts by interest rate (highest first)
2. Pay minimums on everything
3. Throw all extra money at the highest interest debt
4. When it's paid, move to the next highest

**Pros:** Saves the most money in interest
**Cons:** Can take longer to see progress if your highest rate debt is also your largest`
      },
      {
        type: "section",
        title: "The Snowball Method (Psychology Optimal)",
        text: `**How it works:**
1. List debts by balance (smallest first)
2. Pay minimums on everything
3. Throw all extra money at the smallest balance
4. When it's paid, move to the next smallest

**Pros:** Quick wins build momentum
**Cons:** May pay more in total interest`
      },
      {
        type: "callout",
        title: "💡 The Truth About Debt Payoff",
        text: "Studies show the snowball method has higher success rates. Why? Because personal finance is 80% behavior, 20% math. Quick wins create motivation that math can't."
      },
      {
        type: "example",
        title: "📊 Example: Same debt, different approaches",
        text: `You have:
• Credit Card A: $5,000 at 22% APR
• Credit Card B: $1,000 at 18% APR
• Car Loan: $8,000 at 6% APR

**Avalanche:** Pay Card A first (highest rate)
**Snowball:** Pay Card B first (smallest balance)

Snowball gives you a win in ~3 months. Avalanche might take 12+ months for first payoff.`
      },
      {
        type: "section",
        title: "Which Should You Choose?",
        text: `**Choose Avalanche if:**
• You're highly disciplined
• Interest rate differences are large
• You're motivated by math/optimization

**Choose Snowball if:**
• You need motivation from quick wins
• You've failed at debt payoff before
• The psychological boost matters to you

**Pro tip:** The best method is the one you'll actually follow through on.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "List all your debts with balance and interest rate. Order them both ways (by rate and by balance). Pick the method that excites you more—that's your answer."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Avalanche = highest interest first (saves money)",
          "Snowball = smallest balance first (builds momentum)",
          "Snowball has higher success rates in studies",
          "The best method is the one you'll actually stick with"
        ]
      }
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
      {
        type: "intro",
        text: "Your credit score affects your mortgage rate, car loan, apartment approval, insurance premiums, and sometimes even job offers. Here's how it actually works."
      },
      {
        type: "section",
        title: "The Five Factors",
        text: `**1. Payment History (35%)**
Pay on time. Every time. One late payment can drop your score 100+ points.

**2. Credit Utilization (30%)**
How much of your available credit you're using. Keep it under 30%, ideally under 10%.

**3. Length of Credit History (15%)**
Older accounts help. Don't close your oldest card.

**4. Credit Mix (10%)**
Having different types (cards, loans, mortgage) helps slightly.

**5. New Credit (10%)**
Too many applications in a short time hurts.`
      },
      {
        type: "callout",
        title: "💡 The 65% Rule",
        text: "Payment history + utilization = 65% of your score. Focus here first. Pay on time and keep balances low."
      },
      {
        type: "section",
        title: "Quick Score Boosters",
        text: `**1. Pay down credit card balances**
Getting from 50% to 10% utilization can add 50+ points fast.

**2. Become an authorized user**
Ask a family member with good credit to add you to their card.

**3. Request credit limit increases**
Higher limits = lower utilization (if you don't spend more).

**4. Dispute errors**
Check your report at annualcreditreport.com. Errors are common.

**5. Keep old accounts open**
Even if you don't use them, they help your average age.`
      },
      {
        type: "section",
        title: "Score Ranges",
        text: `• **800-850:** Exceptional — Best rates available
• **740-799:** Very Good — Qualify for most products
• **670-739:** Good — Decent rates
• **580-669:** Fair — Subprime rates, limited options
• **300-579:** Poor — Difficulty getting approved`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Check your credit score for free (Credit Karma, your bank, or annualcreditreport.com). Calculate your utilization rate (total balances ÷ total limits). If over 30%, make a plan to pay down."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Payment history (35%) and utilization (30%) matter most",
          "Keep utilization under 30%, ideally under 10%",
          "Don't close old accounts—length of history helps",
          "Check your report annually for errors"
        ]
      }
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
    description: "Not all debt is created equal. Learn which debt can build wealth and which destroys it.",
    duration: "10 min",
    points: 25,
    category: "Personal Finance",
    nextLesson: "investing-101",
    prevLesson: "credit-score-demystified",
    content: [
      {
        type: "intro",
        text: "Your parents might have said 'all debt is bad.' They were wrong. Some debt builds wealth. Some destroys it. Knowing the difference changes everything."
      },
      {
        type: "section",
        title: "Good Debt Characteristics",
        text: `Good debt:
• **Finances appreciating assets** — things that grow in value
• **Has low interest rates** — typically under 7%
• **Provides leverage** — lets you buy more than you could with cash
• **Is tax-advantaged** — interest may be deductible

Examples: Mortgage (real estate appreciates), student loans (increases earning potential), business loans (generates income)`
      },
      {
        type: "section",
        title: "Bad Debt Characteristics",
        text: `Bad debt:
• **Finances depreciating assets** — things that lose value
• **Has high interest rates** — 15%+ APR
• **Funds consumption** — stuff you use up
• **Creates no future value**

Examples: Credit card debt for shopping, car loans on luxury vehicles, personal loans for vacations`
      },
      {
        type: "callout",
        title: "💡 The Key Question",
        text: "Ask yourself: Will this debt help me earn more money or own something that grows in value? If no, it's probably bad debt."
      },
      {
        type: "section",
        title: "The Gray Area",
        text: `Some debt is situational:

**Car loans:**
• Bad if it's a luxury car you can't afford
• Acceptable if it's reliable transportation that enables work

**Student loans:**
• Good if the degree significantly increases earning potential
• Bad if for a degree with poor job prospects and high cost

**0% financing:**
• Can be smart if you have the cash and invest instead
• Dangerous if you're using it to buy things you can't afford`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "List all your current debts. Label each as 'good' or 'bad' based on these criteria. Prioritize eliminating the bad debt first."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Good debt finances appreciating assets at low rates",
          "Bad debt finances consumption at high rates",
          "Ask: Does this help me earn more or own something valuable?",
          "Prioritize eliminating bad debt aggressively"
        ]
      }
    ],
    quiz: [
      { question: "Which is typically considered 'good debt'?", options: ["Credit card balance", "Vacation loan", "Mortgage", "Payday loan"], correct: 2 },
      { question: "What makes debt 'bad'?", options: ["Any interest rate", "Financing depreciating assets at high rates", "Being over $1,000", "Taking more than a year to pay"], correct: 1 },
      { question: "A car loan is:", options: ["Always good debt", "Always bad debt", "Depends on the situation", "Not really debt"], correct: 2 }
    ]
  },

  // =============================================
  // PERSONAL FINANCE - INVESTING BASICS (PRO)
  // =============================================
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
      {
        type: "intro",
        text: "Investing isn't gambling. It isn't complicated. And it isn't just for the wealthy. Here's what you actually need to know to start building wealth."
      },
      {
        type: "section",
        title: "The Core Investment Types",
        text: `**Stocks (Equities)**
You own a tiny piece of a company. When the company does well, your share becomes more valuable. Higher risk, higher potential return.

**Bonds (Fixed Income)**
You lend money to a company or government. They pay you back with interest. Lower risk, lower return.

**ETFs (Exchange-Traded Funds)**
A basket of stocks or bonds you can buy as one thing. Like buying the whole fruit basket instead of individual apples.

**Mutual Funds**
Similar to ETFs but traded differently. Often actively managed (someone picks the stocks). Usually higher fees.`
      },
      {
        type: "callout",
        title: "💡 The Simple Truth",
        text: "For most people, low-cost index ETFs are the answer. They're diversified, cheap, and historically outperform most actively managed funds."
      },
      {
        type: "section",
        title: "Risk vs. Return",
        text: `The fundamental rule: **Higher potential returns = Higher risk**

• **Savings account:** ~4-5% return, essentially no risk
• **Bonds:** ~5-7% return, low risk
• **Stock market (diversified):** ~7-10% historical return, moderate risk
• **Individual stocks:** Can be 20%+ or -50%, high risk
• **Crypto/speculation:** Unlimited upside and downside, extreme risk

Your mix depends on your timeline and risk tolerance.`
      },
      {
        type: "section",
        title: "Time in Market vs. Timing the Market",
        text: `"Time in the market beats timing the market."

People who try to buy low and sell high usually fail. Studies show:
• Missing just the 10 best days over 20 years cuts returns in half
• Most gains come from a handful of days you can't predict
• Staying invested through downturns is what builds wealth

**The strategy:** Invest consistently, ignore the noise, wait decades.`
      },
      {
        type: "section",
        title: "Getting Started",
        text: `**1. Open a brokerage account**
Fidelity, Schwab, and Vanguard are all excellent. No minimums needed.

**2. Start with one simple ETF**
VTI (total US market) or VT (total world market) are popular starting points.

**3. Set up automatic investments**
$50-100/month invested consistently beats trying to time perfect entries.

**4. Don't check it constantly**
Checking daily leads to emotional decisions. Monthly or quarterly is enough.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Open a brokerage account if you don't have one. Fidelity, Schwab, or Vanguard all work. You don't need to invest yet—just get the account ready."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Stocks = ownership, Bonds = loans, ETFs = baskets of investments",
          "Low-cost index ETFs beat most actively managed funds",
          "Time in market beats timing the market",
          "Start simple, invest consistently, think in decades"
        ]
      }
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
      {
        type: "intro",
        text: "Retirement accounts are the most powerful wealth-building tools available. They offer tax advantages that can be worth hundreds of thousands of dollars over your lifetime."
      },
      {
        type: "section",
        title: "The Main Account Types",
        text: `**401(k) / 403(b)**
Employer-sponsored. Pre-tax contributions. Often includes employer match (FREE MONEY). 2024 limit: $23,000.

**Traditional IRA**
Individual account. Pre-tax contributions. Tax-deferred growth. 2024 limit: $7,000.

**Roth IRA**
Individual account. After-tax contributions. TAX-FREE growth and withdrawals. 2024 limit: $7,000.

**HSA (Health Savings Account)**
Triple tax advantage. Pre-tax in, tax-free growth, tax-free out for medical. 2024 limit: $4,150 individual.`
      },
      {
        type: "callout",
        title: "💡 Traditional vs. Roth",
        text: "Traditional = tax break now, pay taxes later. Roth = pay taxes now, never pay taxes on growth. If you think your tax rate will be higher in retirement, choose Roth."
      },
      {
        type: "section",
        title: "The Optimal Order",
        text: `**Step 1:** 401(k) up to employer match (it's free money!)
**Step 2:** Max out HSA if available ($4,150)
**Step 3:** Max out Roth IRA ($7,000)
**Step 4:** Max out 401(k) ($23,000 total)
**Step 5:** Taxable brokerage account

This order maximizes tax advantages and employer contributions.`
      },
      {
        type: "example",
        title: "📊 Example: The Power of Employer Match",
        text: `Your employer matches 50% of contributions up to 6% of salary.
Salary: $60,000

If you contribute 6% ($3,600), employer adds $1,800.
That's an instant 50% return before any market gains!

If you only contribute 3%, you're leaving $900/year on the table.`
      },
      {
        type: "section",
        title: "Common Mistakes",
        text: `• **Not getting the full employer match** — This is literally free money
• **Only using pre-tax accounts** — Roth gives tax diversification
• **Cashing out when changing jobs** — Roll over to IRA instead
• **Being too conservative when young** — Time heals volatility
• **Not starting because "it's not enough"** — $100/month becomes significant over 30 years`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Check if your employer offers 401(k) matching. If so, make sure you're contributing at least enough to get the full match. If not, open a Roth IRA."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Always get the full employer 401(k) match—it's free money",
          "Roth = pay taxes now, tax-free forever; Traditional = tax break now, pay later",
          "Follow the optimal order: Match → HSA → Roth IRA → Max 401(k)",
          "Start now, even if it's a small amount"
        ]
      }
    ],
    quiz: [
      { question: "What should you prioritize first?", options: ["Roth IRA", "401(k) up to employer match", "Taxable brokerage", "Savings account"], correct: 1 },
      { question: "What's special about a Roth IRA?", options: ["Higher contribution limits", "Tax-free growth and withdrawals", "Employer matching", "No income limits"], correct: 1 },
      { question: "What's the 2024 401(k) contribution limit?", options: ["$7,000", "$15,000", "$23,000", "$50,000"], correct: 2 }
    ]
  },

  // =============================================
  // SMALL BUSINESS - FOUNDATIONS
  // =============================================
  "separate-finances": {
    id: "bf-1-1",
    title: "Separate Personal & Business",
    description: "Why mixing finances is dangerous and how to properly separate them.",
    duration: "12 min",
    points: 25,
    category: "Small Business Finance",
    nextLesson: "business-entity-types",
    prevLesson: null,
    content: [
      {
        type: "intro",
        text: "Using your personal bank account for business is like mixing oil and water—it creates a mess. Here's why separation matters and how to do it right."
      },
      {
        type: "section",
        title: "Why Separation Matters",
        text: `**Legal Protection**
Mixing finances can 'pierce the corporate veil'—making YOU personally liable for business debts even if you have an LLC.

**Tax Clarity**
The IRS requires clear records. Mixed accounts = audit nightmare.

**Professionalism**
Clients see 'Gary's Personal Account' on invoices? Not a good look.

**Sanity**
Ever tried to figure out which Amazon purchase was personal vs. business at tax time? Never again.`
      },
      {
        type: "callout",
        title: "💡 The $0 Rule",
        text: "Zero dollars should flow between personal and business accounts without being documented as either salary, owner's draw, or capital contribution."
      },
      {
        type: "section",
        title: "How to Separate",
        text: `**Step 1: Open a business checking account**
Most banks offer free or low-cost business accounts. Shop around.

**Step 2: Get a business credit card**
Even if it's just for building business credit. Keep it separate.

**Step 3: Pay yourself consistently**
Decide on a method: salary (W-2) or owner's draw. Document it.

**Step 4: Never pay personal expenses from business**
Need to buy groceries? Transfer money to personal first. Then buy.

**Step 5: Use accounting software**
QuickBooks, Wave, or Xero. Connect your business accounts only.`
      },
      {
        type: "section",
        title: "Common Mistakes",
        text: `• **Using personal card for 'just one business expense'** — Track it if you must, but avoid it
• **Depositing business income into personal checking** — Opens liability issues
• **Not documenting owner draws** — IRS wants records
• **Co-mingling PayPal/Venmo** — Create separate business versions
• **Lending money to your business without documenting it** — It's either a loan or capital contribution—pick one`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Open a dedicated business checking account this week. Many banks offer free accounts for small businesses. Transfer any business funds currently in your personal account."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Mixing finances can pierce your liability protection",
          "The IRS expects clear separation for tax purposes",
          "Open dedicated business bank account and credit card",
          "Document every transfer between personal and business"
        ]
      }
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
      {
        type: "intro",
        text: "Your business structure affects your taxes, liability, and paperwork. Choose wrong and you'll overpay or expose yourself to risk. Here's how to choose right."
      },
      {
        type: "section",
        title: "Sole Proprietorship",
        text: `**What it is:** You and your business are the same legal entity. Default if you do nothing.

**Pros:**
• No paperwork to start
• Simple taxes (Schedule C)
• Full control

**Cons:**
• NO liability protection
• Looks less professional
• Self-employment tax on all profit

**Best for:** Testing a business idea, very low-risk businesses, side hustles under $10K`
      },
      {
        type: "section",
        title: "LLC (Limited Liability Company)",
        text: `**What it is:** Separate legal entity that protects your personal assets.

**Pros:**
• Liability protection
• Flexible taxation (can elect S-Corp status)
• Credibility

**Cons:**
• Annual fees in most states ($50-800)
• Some paperwork
• Still pay self-employment tax (unless S-Corp election)

**Best for:** Most small businesses, freelancers, consultants`
      },
      {
        type: "section",
        title: "S-Corporation",
        text: `**What it is:** Tax election (not entity type). Can apply to LLC or Corporation.

**Pros:**
• Potentially huge tax savings on self-employment tax
• Pass-through taxation (no double tax)

**Cons:**
• Must pay yourself 'reasonable salary'
• Payroll requirements
• More complex bookkeeping

**Best for:** Businesses with $50K+ net profit. The tax savings outweigh the complexity.`
      },
      {
        type: "callout",
        title: "💡 The S-Corp Sweet Spot",
        text: "Once your profit exceeds ~$50K, an S-Corp election can save $5,000+ annually in self-employment taxes. Worth exploring with a CPA."
      },
      {
        type: "section",
        title: "C-Corporation",
        text: `**What it is:** Separate legal entity with its own tax return.

**Pros:**
• Best for raising investment
• Unlimited shareholders
• Certain fringe benefits

**Cons:**
• Double taxation (corporate + personal)
• Most complex/expensive
• Extensive recordkeeping

**Best for:** Businesses seeking venture capital or planning to go public. Overkill for most small businesses.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "If you're a sole proprietor making real money, research forming an LLC in your state. If making $50K+ profit, schedule a call with a CPA about S-Corp election."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Sole proprietor = no protection, LLC = protection",
          "S-Corp election can save big on taxes at $50K+ profit",
          "C-Corp is usually overkill for small businesses",
          "Consult a CPA when in doubt—it's worth it"
        ]
      }
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
      {
        type: "intro",
        text: "Your business banking setup is the foundation of your financial operations. Get it right from the start and everything else becomes easier."
      },
      {
        type: "section",
        title: "Choosing a Business Bank",
        text: `**Consider:**
• **Fees** — Monthly fees, transaction fees, wire fees
• **Minimums** — Required balance to avoid fees
• **Features** — Online banking, mobile deposit, integrations
• **Locations** — Do you need branches or is online-only fine?

**Popular options:**
• **Traditional:** Chase, Bank of America, local credit unions
• **Online:** Mercury, Novo, Bluevine (often free, great for startups)
• **Premium:** SVB, First Republic (for funded startups)`
      },
      {
        type: "section",
        title: "Account Structure",
        text: `**Essential: Operating Checking**
Day-to-day transactions. Revenue in, expenses out.

**Recommended: Tax Savings Account**
Set aside 25-30% of profit for quarterly taxes. Don't touch it.

**Optional: Profit Account**
Separate your profit before expenses (Profit First method).

**Optional: Payroll Account**
If you have employees, dedicated payroll account keeps things clean.`
      },
      {
        type: "callout",
        title: "💡 The Tax Trap",
        text: "Many business owners spend their 'profit' then can't pay quarterly taxes. Open a separate tax savings account and auto-transfer 25-30% of every deposit."
      },
      {
        type: "section",
        title: "Building Business Credit",
        text: `**Why it matters:**
• Better loan terms when you need financing
• Higher credit limits
• Separation from personal credit

**How to build it:**
1. Get a business credit card (secured if needed)
2. Register with Dun & Bradstreet (get a DUNS number)
3. Pay bills on time (especially those that report)
4. Establish trade credit with vendors
5. Keep utilization low`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Open your business checking and a separate tax savings account. Set up an automatic transfer of 25% of deposits to the tax account."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Choose a bank based on fees, features, and your actual needs",
          "Minimum setup: Operating checking + Tax savings account",
          "Auto-transfer 25-30% of revenue to tax savings",
          "Start building business credit early—it takes time"
        ]
      }
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
      {
        type: "intro",
        text: "More businesses fail from poor cash flow than from lack of profit. You can be profitable on paper and still run out of money. Here's why and how to prevent it."
      },
      {
        type: "section",
        title: "The Three Metrics",
        text: `**Revenue (Top Line)**
Total money coming in before any expenses. $100K revenue ≠ $100K in your pocket.

**Profit (Bottom Line)**
Revenue minus expenses. What's 'left over' on paper.

**Cash Flow**
Actual money moving in and out of your accounts. THIS is what keeps you alive.`
      },
      {
        type: "callout",
        title: "💡 The Cash Flow Paradox",
        text: "A business can show $50,000 profit on paper but have $0 in the bank. How? Timing. You paid suppliers today but customers pay you in 60 days."
      },
      {
        type: "section",
        title: "Why Profitable Businesses Fail",
        text: `**Timing Mismatch:**
You pay expenses immediately. Customers pay you in 30-90 days.

**Growth Requires Cash:**
More sales = more inventory/staff = more cash needed before you get paid.

**Seasonal Variations:**
Three months of slow sales can drain reserves.

**Surprise Expenses:**
Equipment breaks. Taxes come due. Clients pay late.`
      },
      {
        type: "section",
        title: "Cash Flow Best Practices",
        text: `**1. Invoice immediately**
Don't wait. Invoice the day work is complete.

**2. Shorten payment terms**
Net 15 instead of Net 30 if you can.

**3. Offer early payment discounts**
2% discount for paying in 10 days (2/10 net 30).

**4. Build a cash reserve**
3-6 months of operating expenses.

**5. Monitor weekly**
Know your cash position every week, not just at month end.

**6. Negotiate supplier terms**
If you pay net 30, try to get net 45 or 60.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Calculate your cash runway: How many months can you operate with current cash if no new revenue came in? If less than 3 months, prioritize building reserves."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Cash flow ≠ profit—you can be profitable and still fail",
          "Timing is everything: collect fast, pay slower",
          "Keep 3-6 months expenses in reserve",
          "Monitor cash weekly, not monthly"
        ]
      }
    ],
    quiz: [
      { question: "Can a profitable business run out of cash?", options: ["No, profit means you have cash", "Yes, due to timing differences", "Only if they're lying about profit", "Profit and cash are the same thing"], correct: 1 },
      { question: "What's 'cash runway'?", options: ["How fast money moves", "Months you can survive without revenue", "Total revenue potential", "Bank account balance"], correct: 1 },
      { question: "How often should you monitor cash flow?", options: ["Yearly", "Quarterly", "Monthly", "Weekly"], correct: 3 }
    ]
  }
};
