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
  // ADDITIONAL LESSON_CONTENT - Add these to the existing LESSON_CONTENT object
// These are the remaining lessons not yet created

  // =============================================
  // PERSONAL FINANCE - INVESTING (continued)
  // =============================================
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
      {
        type: "intro",
        text: "Einstein allegedly called compound interest the eighth wonder of the world. Whether he said it or not, the math is undeniable—and it will change how you think about time and money."
      },
      {
        type: "section",
        title: "What Is Compound Interest?",
        text: `**Simple interest:** You earn interest on your original amount only.
$1,000 at 10% = $100/year forever = $2,000 after 10 years

**Compound interest:** You earn interest on your interest.
$1,000 at 10% compounded = $2,594 after 10 years

The difference? $594. And it gets more dramatic over time.`
      },
      {
        type: "example",
        title: "📊 The Tale of Two Investors",
        text: `**Early Emma:** Invests $200/month from age 25-35 (10 years), then stops.
Total invested: $24,000

**Late Larry:** Invests $200/month from age 35-65 (30 years).
Total invested: $72,000

At age 65 (assuming 8% return):
• Emma: $427,000
• Larry: $298,000

Emma invested 1/3 as much but ended up with MORE. That's compound interest.`
      },
      {
        type: "callout",
        title: "💡 The Key Insight",
        text: "Time is the most important factor in building wealth. Starting 10 years earlier is worth more than tripling your contributions later."
      },
      {
        type: "section",
        title: "The Rule of 72",
        text: `A quick way to estimate how long it takes to double your money:

**72 ÷ Interest Rate = Years to Double**

• At 6%: 72 ÷ 6 = 12 years to double
• At 8%: 72 ÷ 8 = 9 years to double
• At 10%: 72 ÷ 10 = 7.2 years to double
• At 12%: 72 ÷ 12 = 6 years to double

$10,000 at 8% becomes $20,000 in 9 years, $40,000 in 18 years, $80,000 in 27 years.`
      },
      {
        type: "section",
        title: "Compound Interest Works Against You Too",
        text: `Credit card debt compounds against you:

$5,000 at 20% APR, paying minimums:
• Takes 25+ years to pay off
• You'll pay $8,000+ in interest
• Total cost: $13,000+ for a $5,000 purchase

**The lesson:** Make compound interest work FOR you (investments) not AGAINST you (debt).`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Use a compound interest calculator to see what your current investments will be worth in 20, 30, 40 years. Then calculate what they'd be worth if you started 5 years earlier. Let that motivate you."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Compound interest = earning interest on your interest",
          "Time matters more than amount—start early",
          "Rule of 72: Divide 72 by return rate to find years to double",
          "Compound interest works against you with debt—pay it off fast"
        ]
      }
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
      {
        type: "intro",
        text: "Here's a secret Wall Street doesn't want you to know: Most professional fund managers fail to beat a simple index fund. You can match the market's performance with almost zero effort."
      },
      {
        type: "section",
        title: "What Is an Index Fund?",
        text: `An index fund tracks a specific market index—it buys all the stocks in that index automatically.

**Popular indices:**
• **S&P 500** — 500 largest US companies
• **Total Stock Market** — Entire US market (~4,000 stocks)
• **Total World** — US + International markets

Instead of trying to pick winning stocks, you own a piece of everything.`
      },
      {
        type: "section",
        title: "Why Index Funds Win",
        text: `**The data is clear:**

Over 15 years, 92% of actively managed funds FAIL to beat the S&P 500 index.

**Why?**
• **Fees:** Active funds charge 1-2% annually. Index funds charge 0.03-0.20%.
• **Trading costs:** More buying/selling = more costs
• **Human error:** Even experts make emotional decisions
• **Math:** It's a zero-sum game—for every winner, there's a loser

**1% fee difference over 30 years on $100,000 = $200,000+ lost to fees**`
      },
      {
        type: "callout",
        title: "💡 Warren Buffett's Advice",
        text: "Warren Buffett, one of the greatest investors ever, recommends index funds for most people. He even bet $1 million that an S&P 500 index fund would beat hedge funds over 10 years. He won."
      },
      {
        type: "section",
        title: "The Simple Portfolio",
        text: `You can build a world-class portfolio with just 2-3 funds:

**Option 1: One Fund**
• VT or VTWAX (Total World Stock) — Own the entire global market

**Option 2: Two Funds**
• VTI (Total US Stock) — 80%
• VXUS (Total International) — 20%

**Option 3: Three Funds (Classic)**
• VTI (Total US Stock) — 60%
• VXUS (Total International) — 20%
• BND (Total Bond) — 20%

That's it. Rebalance once a year. Ignore the news.`
      },
      {
        type: "section",
        title: "How to Start",
        text: `**1. Open a brokerage account**
Fidelity, Vanguard, or Schwab—all offer zero-commission trading.

**2. Choose your fund(s)**
Start with VTI or VT if you want simplicity.

**3. Set up automatic investing**
$100/week or whatever you can afford. Consistency beats timing.

**4. Don't touch it**
Seriously. Don't check daily. Don't panic sell in downturns. Just wait.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "If you have a 401(k), find the lowest-cost index fund option (look for 'S&P 500 Index' or 'Total Market Index'). Switch your contributions to that fund."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "92% of active managers fail to beat index funds over 15 years",
          "Low fees compound into massive savings over decades",
          "A simple 2-3 fund portfolio is all most people need",
          "Invest consistently, ignore the noise, wait decades"
        ]
      }
    ],
    quiz: [
      { question: "What percentage of active managers fail to beat the index over 15 years?", options: ["50%", "75%", "92%", "25%"], correct: 2 },
      { question: "What's the main advantage of index funds?", options: ["Higher returns guaranteed", "Lower fees and costs", "More exciting", "Better customer service"], correct: 1 },
      { question: "How often should you rebalance a simple index portfolio?", options: ["Daily", "Weekly", "Monthly", "Once a year"], correct: 3 }
    ]
  },

  // =============================================
  // PERSONAL FINANCE - ADVANCED STRATEGIES
  // =============================================
  "tax-optimization": {
    id: "pf-4-1",
    title: "Tax Optimization Basics",
    description: "Legal strategies to keep more of what you earn. Tax-advantaged accounts and deductions.",
    duration: "20 min",
    points: 50,
    category: "Personal Finance",
    nextLesson: "real-estate-intro",
    prevLesson: "index-fund-strategy",
    content: [
      {
        type: "intro",
        text: "It's not about how much you make—it's about how much you keep. Legal tax optimization can save you thousands every year without any shady tricks."
      },
      {
        type: "section",
        title: "The Tax-Advantaged Account Hierarchy",
        text: `**Tier 1: Triple Tax Advantage**
• **HSA** — Pre-tax in, tax-free growth, tax-free out (for medical)

**Tier 2: Double Tax Advantage**
• **401(k)/IRA** — Pre-tax in, tax-free growth (taxed on withdrawal)
• **Roth IRA** — After-tax in, tax-free growth, tax-free out

**Tier 3: Single Tax Advantage**
• **529 Plans** — Tax-free growth for education
• **Taxable Brokerage** — Only long-term capital gains taxed (lower rate)`
      },
      {
        type: "callout",
        title: "💡 The HSA Secret",
        text: "If you have a high-deductible health plan, an HSA is the most powerful account available. Max it out before anything else. You can invest the balance and let it grow for decades."
      },
      {
        type: "section",
        title: "Common Deductions People Miss",
        text: `**If you itemize:**
• State and local taxes (SALT) — up to $10,000
• Mortgage interest
• Charitable donations
• Medical expenses over 7.5% of income

**Above-the-line (everyone gets these):**
• HSA contributions
• Traditional IRA contributions
• Student loan interest (up to $2,500)
• Self-employment expenses

**Standard deduction 2024:** $14,600 single / $29,200 married
Only itemize if your deductions exceed this.`
      },
      {
        type: "section",
        title: "Tax-Loss Harvesting",
        text: `If investments lose value, you can sell them to 'harvest' the loss:

• **Offset gains:** Losses cancel out capital gains
• **Deduct against income:** Up to $3,000/year against regular income
• **Carry forward:** Unused losses carry to future years

**Example:** You have $5,000 in gains and $3,000 in losses.
You only pay tax on $2,000 net gain.

**Warning:** Watch the 'wash sale' rule—can't buy the same investment within 30 days.`
      },
      {
        type: "section",
        title: "Timing Strategies",
        text: `**Bunch deductions:**
If you're close to the standard deduction threshold, 'bunch' donations or medical expenses into one year to exceed it.

**Roth conversions:**
In low-income years, convert Traditional to Roth at lower tax rates.

**Defer income:**
If expecting lower income next year, defer bonuses or self-employment income.

**Accelerate deductions:**
Prepay state taxes or property taxes before year-end if itemizing.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Review whether you should itemize or take the standard deduction. If you're close, see if you can bunch deductions this year to exceed the threshold."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "HSA is the most tax-advantaged account—max it if eligible",
          "Standard deduction 2024: $14,600 single / $29,200 married",
          "Tax-loss harvesting can offset gains and reduce taxes",
          "Timing matters—bunch deductions, time Roth conversions wisely"
        ]
      }
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
      {
        type: "intro",
        text: "Real estate is how many millionaires built their wealth. But it's not right for everyone. Here's how to think about real estate as both shelter and investment."
      },
      {
        type: "section",
        title: "Rent vs. Buy: The Real Math",
        text: `**The myth:** 'Renting is throwing money away.'
**The reality:** Owning has hidden costs that often exceed rent.

**True cost of owning:**
• Mortgage payment (interest is 'thrown away' too)
• Property taxes (1-2% of home value annually)
• Insurance
• Maintenance (budget 1% of home value/year)
• HOA fees
• Opportunity cost (down payment could be invested)

**The 5% Rule:**
Multiply home price by 5% and divide by 12. If rent is less than this, renting may be better financially.

$400,000 home × 5% ÷ 12 = $1,667/month breakeven`
      },
      {
        type: "callout",
        title: "💡 When to Buy",
        text: "Buy when: You'll stay 5+ years, you have 20% down, your total housing cost is under 28% of income, and you actually want the responsibilities of ownership."
      },
      {
        type: "section",
        title: "Real Estate as Investment",
        text: `**Ways to invest in real estate:**

**1. Primary residence**
Live in it. Build equity. Modest returns typically.

**2. Rental properties**
Buy property, rent it out. Cash flow + appreciation. Requires active management.

**3. House hacking**
Buy multi-unit, live in one, rent others. Others pay your mortgage.

**4. REITs**
Real Estate Investment Trusts. Buy shares like stocks. Passive, liquid, diversified.

**5. Real estate crowdfunding**
Fundrise, Arrived, etc. Invest small amounts in properties online.`
      },
      {
        type: "section",
        title: "The Numbers That Matter",
        text: `**For rental properties:**

**Cap Rate** = Net Operating Income ÷ Property Price
• Measures return without financing
• 5-10% is typical, higher = riskier areas

**Cash-on-Cash Return** = Annual Cash Flow ÷ Cash Invested
• Your actual return on money invested
• 8-12% is solid

**The 1% Rule** (quick filter)
Monthly rent should be at least 1% of purchase price.
$200,000 property should rent for $2,000+/month.

Not a guarantee of good investment, but filters out bad ones.`
      },
      {
        type: "section",
        title: "Common Mistakes",
        text: `• **Buying too much house** — Just because you qualify doesn't mean you should
• **Ignoring hidden costs** — Budget 1% for maintenance annually
• **Not running the numbers** — 'It's a good deal' isn't analysis
• **Emotional buying** — Fall in love after the inspection, not before
• **Skipping inspections** — Never. Ever.
• **Timing the market** — Buy when it makes sense for YOUR life`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "If considering buying, run the 5% rule calculation. If considering rental investing, analyze a property using the 1% rule and calculate the cap rate."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Renting isn't 'throwing money away'—run the real numbers",
          "Only buy if staying 5+ years with 20% down",
          "REITs offer passive real estate exposure without landlord hassles",
          "For rentals: 1% rule for filtering, cap rate for analysis"
        ]
      }
    ],
    quiz: [
      { question: "What's the 5% rule used for?", options: ["Down payment calculation", "Rent vs buy comparison", "Mortgage rate", "Property tax estimate"], correct: 1 },
      { question: "What's the 1% rule for rental properties?", options: ["Put 1% down", "Monthly rent should be 1% of price", "Expect 1% annual return", "Spend 1% on maintenance"], correct: 1 },
      { question: "What are REITs?", options: ["A type of mortgage", "Real Estate Investment Trusts (passive investing)", "Rental agreements", "Tax deductions"], correct: 1 }
    ]
  },

  "insurance-essentials": {
    id: "pf-4-3",
    title: "Insurance Essentials",
    description: "What insurance you actually need and what's a waste of money.",
    duration: "15 min",
    points: 50,
    category: "Personal Finance",
    nextLesson: null,
    prevLesson: "real-estate-intro",
    content: [
      {
        type: "intro",
        text: "Insurance is about protecting against catastrophic loss, not every possible inconvenience. Here's how to get the coverage you need without overpaying."
      },
      {
        type: "section",
        title: "The Insurance Principle",
        text: `**Insure against:** Losses you can't afford to cover yourself
**Self-insure against:** Losses you can handle from savings

**Rule of thumb:** If the loss would devastate your finances, insure it. If it would be annoying but manageable, don't.

This is why you need health insurance ($500K hospital bill) but not phone insurance ($1,000 replacement).`
      },
      {
        type: "section",
        title: "Insurance You NEED",
        text: `**Health Insurance**
A serious illness without insurance = bankruptcy. Non-negotiable.

**Auto Insurance**
Liability at minimum (required by law). Comprehensive/collision if you can't afford to replace your car.

**Homeowners/Renters Insurance**
Protects your stuff and provides liability coverage. Renters insurance is ~$15/month—no excuse.

**Disability Insurance**
Your ability to earn is your biggest asset. 60-70% of income replacement. Often available through employer.

**Life Insurance (if dependents)**
Term life only. 10-12x annual income. Only if someone depends on your income.`
      },
      {
        type: "callout",
        title: "💡 The Disability Reality",
        text: "You're more likely to become disabled than to die before 65. Yet most people have life insurance and skip disability. Disability insurance protects your most valuable asset: your income."
      },
      {
        type: "section",
        title: "Insurance You Probably DON'T Need",
        text: `**Extended warranties**
High markup, rarely used. Save the money instead.

**Phone/electronics insurance**
Better to self-insure with a small emergency fund.

**Whole life/universal life insurance**
Expensive, complicated, usually worse than 'buy term and invest the difference.'

**Credit card insurance**
Overpriced for the coverage provided.

**Flight insurance**
Your odds of dying are 1 in 11 million. Your credit card may already cover trip issues.

**Pet insurance (usually)**
Do the math—most people pay more in premiums than they get in claims.`
      },
      {
        type: "section",
        title: "Saving on Insurance",
        text: `**Raise deductibles**
Higher deductible = lower premium. Keep the savings in emergency fund.

**Bundle policies**
Same company for home + auto = 10-25% discount.

**Shop annually**
Loyalty doesn't pay. Get quotes every year.

**Improve credit**
In most states, better credit = lower insurance rates.

**Ask about discounts**
Good driver, safety features, non-smoker, alumni associations, professional groups.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Check if you have disability insurance through your employer. If not, get quotes. Also, raise your auto deductible to $1,000 if you have emergency savings—pocket the premium savings."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Insure catastrophic losses, self-insure small ones",
          "Must-haves: Health, auto, renters/home, disability (if working), term life (if dependents)",
          "Skip: Extended warranties, whole life, phone insurance",
          "Raise deductibles and shop annually to save"
        ]
      }
    ],
    quiz: [
      { question: "What's the main purpose of insurance?", options: ["Cover all possible losses", "Protect against catastrophic loss you can't afford", "Make money", "Tax benefits"], correct: 1 },
      { question: "Which insurance is often overlooked but important?", options: ["Phone insurance", "Flight insurance", "Disability insurance", "Extended warranties"], correct: 2 },
      { question: "What type of life insurance is recommended?", options: ["Whole life", "Universal life", "Term life", "Variable life"], correct: 2 }
    ]
  },

  // =============================================
  // SMALL BUSINESS - CASH FLOW (continued)
  // =============================================
  "invoice-collections": {
    id: "bf-2-2",
    title: "Invoicing & Collections",
    description: "Get paid faster with better invoicing practices and collection strategies.",
    duration: "12 min",
    points: 50,
    category: "Small Business Finance",
    nextLesson: "cash-flow-forecasting",
    prevLesson: "cash-flow-basics",
    content: [
      {
        type: "intro",
        text: "You did the work. Now get paid. Poor invoicing habits leave money on the table and create cash flow nightmares. Here's how to invoice like a pro."
      },
      {
        type: "section",
        title: "Invoicing Best Practices",
        text: `**Invoice immediately**
Same day work is completed. Every day you wait is a day added to your payment timeline.

**Be crystal clear**
• Detailed description of work/products
• Clear due date (not just 'Net 30')
• Multiple payment options
• Your contact info for questions

**Make payment easy**
Accept credit cards, ACH, PayPal. The easier to pay, the faster they pay.

**Use professional software**
QuickBooks, FreshBooks, Wave—they track, remind, and look professional.`
      },
      {
        type: "callout",
        title: "💡 Payment Terms Psychology",
        text: "'Due upon receipt' gets paid faster than 'Net 30'. But 'Due in 7 days' often performs just as well as 'Due upon receipt' while seeming more reasonable to clients."
      },
      {
        type: "section",
        title: "Getting Paid Faster",
        text: `**Offer early payment discount**
2/10 Net 30 = 2% discount if paid in 10 days. Many large companies have policies to take these.

**Require deposits**
50% upfront on large projects. Protects you AND qualifies serious clients.

**Late fees**
1.5% per month is standard. More importantly, it incentivizes on-time payment.

**Autopay agreements**
For retainer clients, set up automatic billing.

**Shorter terms**
Net 15 instead of Net 30. Just ask—many clients won't care.`
      },
      {
        type: "section",
        title: "Collection Process",
        text: `**Day 1 past due:** Friendly reminder email
"Just a reminder that invoice #123 was due yesterday. Let me know if you have questions!"

**Day 7:** Phone call + email
"Following up on the overdue invoice. Is there an issue I can help resolve?"

**Day 14:** Formal notice
"This invoice is now 14 days past due. Please remit payment within 7 days to avoid late fees."

**Day 30:** Final notice + late fees
"Final notice. Late fees have been applied. Payment required within 5 business days."

**Day 45+:** Consider collections agency or small claims court
Document everything. The threat of collections often works.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Review your current invoicing terms. If you're using Net 30, test Net 15 with new clients. Set up automatic payment reminders in your invoicing software."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Invoice immediately—same day if possible",
          "Offer early payment discounts (2/10 Net 30)",
          "Make payment easy—multiple options",
          "Have a systematic collection process with escalating urgency"
        ]
      }
    ],
    quiz: [
      { question: "When should you send an invoice?", options: ["End of month", "When you remember", "Same day work is completed", "When client asks"], correct: 2 },
      { question: "What does '2/10 Net 30' mean?", options: ["2% interest after 10 days", "2% discount if paid in 10 days, otherwise due in 30", "Pay $2 in 10-30 days", "2 invoices due in 10-30 days"], correct: 1 },
      { question: "What's the first step when an invoice is past due?", options: ["Send to collections", "Call their lawyer", "Friendly reminder email", "Add late fees immediately"], correct: 2 }
    ]
  },

  "cash-flow-forecasting": {
    id: "bf-2-3",
    title: "Cash Flow Forecasting",
    description: "Predict your cash position and avoid nasty surprises.",
    duration: "18 min",
    points: 50,
    category: "Small Business Finance",
    nextLesson: "bookkeeping-basics",
    prevLesson: "invoice-collections",
    content: [
      {
        type: "intro",
        text: "If you don't know what your cash position will be in 30 days, you're flying blind. Cash flow forecasting lets you see problems before they become emergencies."
      },
      {
        type: "section",
        title: "The 13-Week Cash Flow Forecast",
        text: `The most useful forecasting timeframe for small businesses:

**Week-by-week for 13 weeks:**
• Starting cash balance
• Expected cash inflows
• Expected cash outflows
• Ending cash balance

This gives you a quarter of visibility—enough to see and fix problems.`
      },
      {
        type: "section",
        title: "Building Your Forecast",
        text: `**Cash Inflows:**
• Customer payments (based on invoice due dates + typical delays)
• Recurring revenue (subscriptions, retainers)
• Loan proceeds
• Other income

**Cash Outflows:**
• Payroll (your biggest expense usually)
• Rent and utilities
• Vendor payments (raw materials, inventory)
• Loan payments
• Tax payments (quarterly estimated taxes!)
• Insurance
• Software subscriptions
• Owner draws

**Be conservative:** Assume customers pay late. Assume expenses hit on time.`
      },
      {
        type: "example",
        title: "📊 Simple Forecast Example",
        text: `Week 1:
• Starting cash: $50,000
• Inflows: $30,000 (customer payments)
• Outflows: $35,000 (payroll $25K + rent $5K + vendors $5K)
• Ending cash: $45,000

Week 2:
• Starting cash: $45,000
• Inflows: $15,000
• Outflows: $20,000
• Ending cash: $40,000

...continue for 13 weeks. Look for any week where ending cash goes negative.`
      },
      {
        type: "callout",
        title: "💡 The Early Warning System",
        text: "If your forecast shows cash going negative in 6 weeks, you have time to act: collect faster, delay expenses, line up financing. Discovered at week 5? You're in crisis mode."
      },
      {
        type: "section",
        title: "Acting on Your Forecast",
        text: `**If forecast shows shortfall:**
• Accelerate collections (call late payers)
• Delay non-essential expenses
• Negotiate extended payment terms with vendors
• Consider line of credit (get it BEFORE you need it)
• Adjust owner draws temporarily

**If forecast shows surplus:**
• Build cash reserve
• Pay down debt
• Consider reinvestment
• Take owner distribution

**Update weekly:** Actuals will differ from forecast. Adjust and re-forecast.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Create a simple 13-week cash flow forecast in a spreadsheet. Start with today's cash balance, list expected inflows and outflows by week. Identify any weeks that look tight."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "13-week rolling forecast is ideal for small businesses",
          "Be conservative: assume customers pay late, expenses hit on time",
          "Update weekly with actuals vs. forecast",
          "Early warning = time to act before crisis"
        ]
      }
    ],
    quiz: [
      { question: "What's the recommended forecasting timeframe?", options: ["1 week", "13 weeks", "1 year", "5 years"], correct: 1 },
      { question: "How should you treat timing in a conservative forecast?", options: ["Assume everything on time", "Assume customers pay late, expenses on time", "Assume everything early", "Ignore timing"], correct: 1 },
      { question: "What should you do if forecast shows a shortfall?", options: ["Panic", "Ignore it—forecasts are wrong anyway", "Accelerate collections and delay expenses", "Close the business"], correct: 2 }
    ]
  },

  // =============================================
  // SMALL BUSINESS - BOOKKEEPING
  // =============================================
  "bookkeeping-basics": {
    id: "bf-3-1",
    title: "Bookkeeping Basics",
    description: "Chart of accounts, double-entry, and keeping organized records.",
    duration: "20 min",
    points: 50,
    category: "Small Business Finance",
    nextLesson: "financial-statements",
    prevLesson: "cash-flow-forecasting",
    content: [
      {
        type: "intro",
        text: "Good bookkeeping isn't exciting, but it's the foundation of business finance. Get this right and everything else becomes easier. Get it wrong and tax time becomes a nightmare."
      },
      {
        type: "section",
        title: "The Chart of Accounts",
        text: `Your chart of accounts is like a filing system for money. Every transaction goes somewhere.

**Five main categories:**

**1. Assets** — What you own
• Cash, accounts receivable, inventory, equipment

**2. Liabilities** — What you owe
• Credit cards, loans, accounts payable

**3. Equity** — Owner's investment and retained earnings
• Owner's capital, retained earnings

**4. Revenue** — Money you earn
• Sales, service income, interest income

**5. Expenses** — Money you spend
• Rent, payroll, supplies, marketing`
      },
      {
        type: "section",
        title: "Double-Entry Basics",
        text: `Every transaction affects two accounts. This is double-entry bookkeeping.

**Examples:**

You buy $500 of supplies with cash:
• Supplies expense increases $500 (debit)
• Cash decreases $500 (credit)

Customer pays $1,000 invoice:
• Cash increases $1,000 (debit)
• Accounts receivable decreases $1,000 (credit)

You take out a $10,000 loan:
• Cash increases $10,000 (debit)
• Loans payable increases $10,000 (credit)

**The rule:** Debits must equal credits. Always.`
      },
      {
        type: "callout",
        title: "💡 Don't Memorize, Use Software",
        text: "You don't need to memorize debit/credit rules. Accounting software like QuickBooks handles it automatically. But understanding the concept helps you catch errors."
      },
      {
        type: "section",
        title: "Bookkeeping Cadence",
        text: `**Daily:**
• Record cash transactions (if cash-heavy business)

**Weekly:**
• Categorize bank and credit card transactions
• Send invoices
• Review accounts receivable

**Monthly:**
• Reconcile all accounts
• Review P&L and balance sheet
• Send overdue payment reminders
• Pay bills

**Quarterly:**
• Review year-to-date performance
• Pay estimated taxes
• Adjust forecasts`
      },
      {
        type: "section",
        title: "Common Mistakes",
        text: `• **Mixing personal and business** — Separate accounts!
• **Waiting until tax time** — Reconcile monthly
• **No receipt organization** — Scan and file digitally
• **Wrong categories** — Meals aren't 'supplies'
• **Ignoring reconciliation** — Match bank to books monthly
• **Cash transactions forgotten** — Record everything`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Set up recurring calendar reminders: Weekly for transaction categorization, monthly for reconciliation, quarterly for estimated tax review."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Five categories: Assets, Liabilities, Equity, Revenue, Expenses",
          "Double-entry: Every transaction affects two accounts",
          "Use accounting software—don't do it manually",
          "Monthly reconciliation is non-negotiable"
        ]
      }
    ],
    quiz: [
      { question: "What are the five main account categories?", options: ["Cash, Credit, Debit, Revenue, Expense", "Assets, Liabilities, Equity, Revenue, Expenses", "Income, Outcome, Balance, Credit, Debit", "Sales, Costs, Profit, Loss, Cash"], correct: 1 },
      { question: "In double-entry bookkeeping, what must always be equal?", options: ["Assets and liabilities", "Revenue and expenses", "Debits and credits", "Cash in and cash out"], correct: 2 },
      { question: "How often should you reconcile accounts?", options: ["Yearly", "Quarterly", "Monthly", "Never—software does it"], correct: 2 }
    ]
  },

  "financial-statements": {
    id: "bf-3-2",
    title: "Reading Financial Statements",
    description: "P&L, Balance Sheet, Cash Flow Statement—what they tell you about your business.",
    duration: "25 min",
    points: 50,
    category: "Small Business Finance",
    nextLesson: "accounting-software",
    prevLesson: "bookkeeping-basics",
    content: [
      {
        type: "intro",
        text: "Financial statements are the scorecard of your business. Learn to read them and you'll make better decisions. Here's what each one tells you."
      },
      {
        type: "section",
        title: "Profit & Loss Statement (Income Statement)",
        text: `**What it shows:** Revenue minus expenses over a period of time

**Structure:**
Revenue (Sales)
- Cost of Goods Sold (COGS)
= Gross Profit
- Operating Expenses
= Operating Income
- Interest & Taxes
= Net Profit

**Key questions it answers:**
• Are we profitable?
• What's our gross margin?
• Where are we spending too much?
• How do we compare to last year/month?`
      },
      {
        type: "section",
        title: "Balance Sheet",
        text: `**What it shows:** What you own, owe, and equity at a specific point in time

**The equation:** Assets = Liabilities + Equity

**Structure:**
ASSETS
• Current assets (cash, receivables, inventory)
• Fixed assets (equipment, property)

LIABILITIES
• Current liabilities (payables, short-term debt)
• Long-term liabilities (loans)

EQUITY
• Owner's investment + retained earnings

**Key questions it answers:**
• Can we pay our bills? (Current ratio)
• How much debt do we have?
• What's the business actually worth?`
      },
      {
        type: "section",
        title: "Cash Flow Statement",
        text: `**What it shows:** Where cash came from and where it went

**Three sections:**

**Operating Activities**
Cash from actual business operations. Should be positive.

**Investing Activities**
Buying/selling equipment, investments. Often negative (investing in growth).

**Financing Activities**
Loans, owner investments, distributions. Variable.

**Key question:** Where is the cash actually coming from and going to?`
      },
      {
        type: "callout",
        title: "💡 The Relationship",
        text: "P&L shows profitability. Balance Sheet shows financial position. Cash Flow shows liquidity. You need all three to see the full picture. A profitable company can have no cash. A cash-rich company can be unprofitable."
      },
      {
        type: "section",
        title: "Key Ratios to Know",
        text: `**Gross Margin** = Gross Profit ÷ Revenue
How much you keep after direct costs. Higher is better.

**Net Margin** = Net Profit ÷ Revenue
How much you keep after ALL costs. 10-20% is healthy for most businesses.

**Current Ratio** = Current Assets ÷ Current Liabilities
Can you pay short-term bills? Above 1.5 is comfortable.

**Quick Ratio** = (Current Assets - Inventory) ÷ Current Liabilities
Like current ratio but excludes inventory. Above 1 is good.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Pull your P&L and Balance Sheet from your accounting software. Calculate your gross margin, net margin, and current ratio. How do they look?"
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "P&L = profitability over time, Balance Sheet = snapshot of position",
          "Cash Flow Statement shows where money actually moves",
          "All three together give the complete picture",
          "Key ratios: Gross margin, net margin, current ratio"
        ]
      }
    ],
    quiz: [
      { question: "What does the P&L (Income Statement) show?", options: ["What you own", "Revenue minus expenses over time", "Cash in and out", "What you owe"], correct: 1 },
      { question: "What's the Balance Sheet equation?", options: ["Revenue - Expenses = Profit", "Assets = Liabilities + Equity", "Cash In - Cash Out = Balance", "Sales - COGS = Margin"], correct: 1 },
      { question: "What does a Current Ratio above 1.5 indicate?", options: ["Too much debt", "Comfortable ability to pay short-term bills", "Unprofitable", "Too much inventory"], correct: 1 }
    ]
  },

  "accounting-software": {
    id: "bf-3-3",
    title: "Choosing Accounting Software",
    description: "QuickBooks vs. Xero vs. Wave—find the right fit for your business.",
    duration: "12 min",
    points: 50,
    category: "Small Business Finance",
    nextLesson: "business-tax-basics",
    prevLesson: "financial-statements",
    content: [
      {
        type: "intro",
        text: "The right accounting software saves hours every month and reduces errors. The wrong choice creates frustration. Here's how to choose."
      },
      {
        type: "section",
        title: "The Big Three",
        text: `**QuickBooks Online**
• Most popular in the US
• Most accountants know it
• Best integrations with other tools
• $30-200/month depending on tier
• Best for: US-based businesses who want maximum compatibility

**Xero**
• Popular internationally
• Beautiful interface
• Unlimited users on all plans
• $15-78/month
• Best for: Businesses with multiple team members, international

**Wave**
• Free for accounting features
• Good for basic needs
• Paid add-ons for payroll, payments
• Best for: Freelancers, side hustles, very small businesses`
      },
      {
        type: "section",
        title: "Features to Consider",
        text: `**Must-haves:**
• Bank/credit card connections
• Invoicing
• Expense tracking
• Basic reporting (P&L, Balance Sheet)
• Mobile app

**Nice-to-haves:**
• Inventory tracking
• Time tracking
• Project profitability
• Multi-currency
• Payroll integration`
      },
      {
        type: "callout",
        title: "💡 Ask Your Accountant First",
        text: "Before choosing, ask your accountant what they prefer. Working in software they know saves you money on their bill and reduces errors."
      },
      {
        type: "section",
        title: "Other Options",
        text: `**FreshBooks** — Great for service businesses, beautiful invoicing. $17-60/month.

**Zoho Books** — Budget-friendly with CRM integration. $15-60/month.

**Bench** — Done-for-you bookkeeping service, not just software. $299+/month.

**Pilot** — Higher-end bookkeeping service for startups. $500+/month.

**Spreadsheets** — Only if you truly have minimal transactions. Otherwise, don't.`
      },
      {
        type: "section",
        title: "Making the Switch",
        text: `**If you're starting fresh:**
Choose based on needs and budget. QuickBooks is the safe default.

**If switching from another system:**
• Wait until end of fiscal year if possible
• Export all historical data
• Get accountant help for clean transition
• Run parallel for a month

**Setup tips:**
• Connect bank/credit cards immediately
• Set up chart of accounts properly (or use defaults)
• Create invoice templates
• Set up recurring transactions`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "If you're using spreadsheets, sign up for free trials of QuickBooks and Wave. Test both for a week. Pick one and commit to it."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "QuickBooks is the safe default—most accountants know it",
          "Wave is free and good enough for simple businesses",
          "Ask your accountant before choosing",
          "Connect bank accounts and set up properly from day one"
        ]
      }
    ],
    quiz: [
      { question: "Which accounting software is free?", options: ["QuickBooks", "Xero", "Wave", "FreshBooks"], correct: 2 },
      { question: "What should you do before choosing accounting software?", options: ["Pick the cheapest", "Ask your accountant", "Use spreadsheets first", "Wait until you have more revenue"], correct: 1 },
      { question: "What's the first thing to do after setting up accounting software?", options: ["Create invoices", "Connect bank accounts", "Design logo", "Hire an accountant"], correct: 1 }
    ]
  },

  // =============================================
  // SMALL BUSINESS - TAXES
  // =============================================
  "business-tax-basics": {
    id: "bf-4-1",
    title: "Business Tax Basics",
    description: "Estimated taxes, quarterly payments, and common deductions.",
    duration: "20 min",
    points: 75,
    category: "Small Business Finance",
    nextLesson: "tax-deductions",
    prevLesson: "accounting-software",
    content: [
      {
        type: "intro",
        text: "Business taxes are more complex than employee taxes, but understanding the basics keeps you out of trouble and saves money. Here's what every business owner needs to know."
      },
      {
        type: "section",
        title: "How Business Income Is Taxed",
        text: `**Sole Proprietor / Single-Member LLC:**
Business income flows to your personal return (Schedule C). You pay:
• Income tax on profit
• Self-employment tax (15.3%) on profit

**S-Corporation:**
Pay yourself a 'reasonable salary' (W-2 wages). Remaining profit is distributions.
• W-2 wages: Income tax + FICA
• Distributions: Income tax only (no self-employment tax)
• This is the S-Corp tax savings

**C-Corporation:**
Corporation pays corporate tax (21%). Dividends taxed again on your personal return.
• 'Double taxation'—usually not ideal for small business`
      },
      {
        type: "section",
        title: "Quarterly Estimated Taxes",
        text: `**No employer withholding = you must pay quarterly**

Due dates:
• Q1: April 15
• Q2: June 15
• Q3: September 15
• Q4: January 15 (following year)

**How much?**
Estimate your annual tax liability, divide by 4.

**Safe harbor:** Pay either:
• 100% of last year's tax (110% if income over $150K)
• Or 90% of current year's tax

Miss payments = penalties and interest. Set up reminders!`
      },
      {
        type: "callout",
        title: "💡 The Tax Savings Account",
        text: "Every time revenue comes in, transfer 25-30% to a separate tax savings account. When quarterly payments are due, the money is there. No scrambling."
      },
      {
        type: "section",
        title: "Self-Employment Tax",
        text: `As an employee, you pay 7.65% FICA, employer pays 7.65%.

As self-employed, YOU pay both halves = 15.3%

On $100,000 profit, that's $15,300 in self-employment tax PLUS income tax.

**This is why S-Corp election matters at higher income.** By taking reasonable salary and distributions, you only pay FICA on salary portion.`
      },
      {
        type: "section",
        title: "Record Keeping Requirements",
        text: `The IRS requires you to keep:

• **Receipts** for business expenses
• **Mileage logs** if claiming vehicle deduction
• **Bank/credit card statements**
• **Invoices and contracts**
• **Payroll records** (7 years)

Keep records for **at least 3 years** (7 years for some items).

Digital is fine—scan and organize. Use apps like Dext or Expensify.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Calculate your quarterly estimated tax payment. Set up calendar reminders for all four quarterly due dates. Open a separate tax savings account if you haven't already."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Self-employed pay 15.3% self-employment tax PLUS income tax",
          "Quarterly estimated taxes due in April, June, September, January",
          "Set aside 25-30% of revenue for taxes",
          "Keep receipts and records for at least 3 years"
        ]
      }
    ],
    quiz: [
      { question: "What is the self-employment tax rate?", options: ["7.65%", "15.3%", "21%", "25%"], correct: 1 },
      { question: "When is Q3 estimated tax payment due?", options: ["July 15", "August 15", "September 15", "October 15"], correct: 2 },
      { question: "How long should you keep tax records?", options: ["1 year", "At least 3 years", "Only until you file", "Forever"], correct: 1 }
    ]
  },

  "tax-deductions": {
    id: "bf-4-2",
    title: "Maximizing Deductions",
    description: "Legal deductions you might be missing: home office, vehicles, travel, and more.",
    duration: "18 min",
    points: 75,
    category: "Small Business Finance",
    nextLesson: "hiring-contractors",
    prevLesson: "business-tax-basics",
    content: [
      {
        type: "intro",
        text: "Every legitimate business deduction reduces your taxable income. Miss deductions and you overpay taxes. Here's what you might be overlooking."
      },
      {
        type: "section",
        title: "Home Office Deduction",
        text: `**Requirements:**
• Used regularly and exclusively for business
• Your principal place of business OR where you meet clients

**Two methods:**

**Simplified Method:**
$5 per square foot, up to 300 sq ft max = $1,500 max deduction

**Regular Method:**
Calculate percentage of home used for business. Deduct that percentage of:
• Rent or mortgage interest
• Utilities
• Insurance
• Repairs

A 200 sq ft office in a 2,000 sq ft home = 10% of eligible expenses.`
      },
      {
        type: "section",
        title: "Vehicle Deductions",
        text: `**Two methods:**

**Standard Mileage Rate (2024):**
67 cents per business mile. Keep a mileage log!

**Actual Expenses:**
Track all vehicle costs (gas, insurance, repairs, depreciation). Deduct business percentage.

**Commuting is NOT deductible.** But trips from your home office to client sites ARE.

**Must choose one method** and generally stick with it.

**Best practice:** Use an app like MileIQ to auto-track mileage.`
      },
      {
        type: "section",
        title: "Commonly Missed Deductions",
        text: `**Business meals:** 50% deductible when discussing business (keep notes on receipt: who, what discussed)

**Professional development:** Courses, books, conferences related to business

**Software & subscriptions:** Business tools, cloud services, professional memberships

**Health insurance premiums:** Self-employed can deduct 100% for themselves and family

**Retirement contributions:** SEP-IRA, Solo 401(k)—reduce taxes AND build wealth

**Bank fees & interest:** Business account fees, business loan interest

**Professional services:** Accountant, lawyer, bookkeeper, consultants

**Internet & phone:** Business percentage of your bills`
      },
      {
        type: "callout",
        title: "💡 The Documentation Rule",
        text: "No documentation = no deduction (if audited). Keep receipts. Note the business purpose. Use a dedicated business credit card to simplify tracking."
      },
      {
        type: "section",
        title: "Deductions to Be Careful With",
        text: `**Red flags that trigger audits:**
• Large vehicle deductions on Schedule C
• High meal/entertainment relative to revenue
• Home office on Schedule C with no other office
• Large cash charitable donations

**Not saying don't take them—just document well.**

**Never deduct:**
• Personal expenses (even partially)
• Fines or penalties
• Political contributions
• Most commuting`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Review this list against your current deductions. Are you tracking mileage? Taking the home office deduction? Deducting health insurance premiums? Pick one you're missing and start tracking it."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Home office: Simplified ($5/sq ft) or regular method (% of expenses)",
          "Vehicle: Standard mileage (67¢/mile) or actual expenses—keep logs",
          "Self-employed health insurance is 100% deductible",
          "Document everything—no receipt, no deduction"
        ]
      }
    ],
    quiz: [
      { question: "What's the 2024 standard mileage rate?", options: ["50 cents/mile", "58 cents/mile", "67 cents/mile", "72 cents/mile"], correct: 2 },
      { question: "What percentage of business meals is deductible?", options: ["25%", "50%", "75%", "100%"], correct: 1 },
      { question: "What's the simplified home office deduction rate?", options: ["$3/sq ft", "$5/sq ft", "$10/sq ft", "Percentage of rent"], correct: 1 }
    ]
  },

  "hiring-contractors": {
    id: "bf-4-3",
    title: "Hiring & Payroll Taxes",
    description: "W-2 vs 1099, payroll taxes, and the true cost of employees.",
    duration: "22 min",
    points: 75,
    category: "Small Business Finance",
    nextLesson: "funding-options",
    prevLesson: "tax-deductions",
    content: [
      {
        type: "intro",
        text: "Hiring is exciting until you realize the tax complexity involved. Misclassify workers or mess up payroll taxes and the penalties are brutal. Here's how to do it right."
      },
      {
        type: "section",
        title: "W-2 Employee vs 1099 Contractor",
        text: `**The IRS looks at three categories:**

**Behavioral Control:**
• Do you control how they work? → Employee
• Do you only control the result? → Contractor

**Financial Control:**
• Do you provide tools/equipment? → Employee
• Do they have significant investment? → Contractor

**Relationship Type:**
• Ongoing relationship with benefits? → Employee
• Project-based with written contract? → Contractor

**When in doubt:** The IRS tends to classify as employee. When REALLY in doubt, file Form SS-8 to let IRS decide.`
      },
      {
        type: "callout",
        title: "💡 Misclassification Penalties",
        text: "Treating an employee as a 1099 contractor to avoid taxes? Penalties include back taxes, 100% of withheld amounts, plus fines. It's not worth the risk."
      },
      {
        type: "section",
        title: "The True Cost of an Employee",
        text: `**$50,000 salary actually costs $55,000-65,000+**

**Employer payroll taxes:**
• Social Security: 6.2%
• Medicare: 1.45%
• Federal unemployment (FUTA): ~$420/year
• State unemployment (SUTA): 1-5%+

**Other costs:**
• Workers' comp insurance
• Health insurance contribution
• Retirement match (if offered)
• Paid time off
• Payroll processing fees
• HR/management time

**Rule of thumb:** Budget 20-30% above salary for true cost.`
      },
      {
        type: "section",
        title: "Payroll Tax Responsibilities",
        text: `**You must:**
• Withhold income tax from employee wages
• Withhold employee's share of FICA (7.65%)
• Pay employer's share of FICA (7.65%)
• Deposit taxes (semi-weekly or monthly)
• File Form 941 quarterly
• File W-2s and W-3 annually
• Pay federal and state unemployment

**Deposit deadlines are strict.** Late deposits = immediate penalties.

**Use payroll software:** Gusto, ADP, Paychex, or QuickBooks Payroll. Don't DIY payroll taxes.`
      },
      {
        type: "section",
        title: "Working with Contractors",
        text: `**Requirements:**
• Written contract defining scope, payment terms
• Get W-9 before paying them
• Send 1099-NEC if you pay $600+ in a year
• No withholding—they handle their own taxes

**Best practices:**
• Clear deliverables and deadlines in contract
• Don't treat them like employees (no set hours, required meetings)
• Pay by project or milestone, not hourly
• Have them invoice you

**1099 deadline:** January 31 (to contractor and IRS)`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "If you have contractors, ensure you have W-9s on file for all of them. If hiring your first employee, sign up for a payroll service before their start date."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "W-2 vs 1099 is about control, not convenience—classify correctly",
          "True employee cost is 20-30% above salary",
          "Use payroll software—DIY payroll is asking for penalties",
          "Get W-9s from contractors, send 1099s by January 31"
        ]
      }
    ],
    quiz: [
      { question: "What determines employee vs contractor status?", options: ["What they prefer", "Control over how work is done", "How much you pay them", "Whether you like them"], correct: 1 },
      { question: "How much above salary should you budget for true employee cost?", options: ["5-10%", "20-30%", "50%", "100%"], correct: 1 },
      { question: "When are 1099-NECs due?", options: ["December 31", "January 31", "April 15", "When you get around to it"], correct: 1 }
    ]
  },

  // =============================================
  // SMALL BUSINESS - FUNDING & GROWTH
  // =============================================
  "funding-options": {
    id: "bf-5-1",
    title: "Funding Options Explained",
    description: "Bootstrapping, loans, lines of credit, investors—pros and cons of each.",
    duration: "20 min",
    points: 75,
    category: "Small Business Finance",
    nextLesson: "business-credit",
    prevLesson: "hiring-contractors",
    content: [
      {
        type: "intro",
        text: "Every business needs capital at some point. The source you choose affects your control, risk, and stress level. Here's how to think about funding options."
      },
      {
        type: "section",
        title: "Bootstrapping",
        text: `**What it is:** Funding growth from revenue and personal savings

**Pros:**
• 100% ownership retained
• No debt or interest
• Forces profitability discipline
• No outside pressure

**Cons:**
• Slower growth
• Personal financial risk
• May miss market windows
• Stressful during lean times

**Best for:** Service businesses, lifestyle businesses, founders who value control`
      },
      {
        type: "section",
        title: "Bank Loans & SBA Loans",
        text: `**Traditional Bank Loan:**
• Requires strong credit, collateral, 2+ years in business
• Lower interest rates (7-10%)
• Fixed payments
• Hard to get for new businesses

**SBA Loans:**
• Government-backed, easier to qualify
• Lower down payments
• 7(a) program most common
• Still requires good credit and documentation
• 6-9 month application process

**Best for:** Established businesses with assets and good credit`
      },
      {
        type: "section",
        title: "Lines of Credit",
        text: `**What it is:** Flexible borrowing up to a limit—use what you need, pay interest only on what you use

**Pros:**
• Flexibility for cash flow gaps
• Only pay interest on drawn amount
• Reusable as you pay down

**Cons:**
• Variable interest rates
• Can be reduced or cancelled
• Annual fees sometimes

**Best for:** Managing cash flow fluctuations, seasonal businesses

**Get it BEFORE you need it.** Banks don't lend to desperate businesses.`
      },
      {
        type: "section",
        title: "Equity Investment",
        text: `**Angel Investors:**
• Wealthy individuals investing $25K-500K
• Often want involvement/mentorship
• More flexible terms than VCs

**Venture Capital:**
• Professional investors managing funds
• Typically $500K-$50M+
• Want high growth, exit potential
• Will push for aggressive scaling

**Crowdfunding:**
• Kickstarter, Indiegogo (product pre-sales)
• Republic, Wefunder (equity crowdfunding)
• Good for consumer products with broad appeal

**Equity investment means giving up ownership and control.** Only worth it if you need it for explosive growth.`
      },
      {
        type: "callout",
        title: "💡 Funding Philosophy",
        text: "The best funding is revenue from customers. The second best is low-interest debt you can handle. Equity should be a last resort for most businesses—you're selling a piece of your company forever."
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Identify your next funding need. If it's cash flow smoothing, apply for a line of credit now while you don't need it. If it's growth capital, calculate exactly how much you need and what you'd use it for."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Bootstrap if possible—revenue is the best funding",
          "Debt (loans, lines of credit) means keeping ownership but taking risk",
          "Equity means giving up ownership permanently",
          "Get lines of credit before you need them"
        ]
      }
    ],
    quiz: [
      { question: "What's the main advantage of bootstrapping?", options: ["Faster growth", "Keep 100% ownership", "Less work", "More prestige"], correct: 1 },
      { question: "When should you apply for a line of credit?", options: ["When you desperately need cash", "Before you need it", "After you're profitable", "Never—avoid all debt"], correct: 1 },
      { question: "What does equity investment require you to give up?", options: ["Nothing", "Ownership stake in your company", "Just interest payments", "Your business name"], correct: 1 }
    ]
  },

  "business-credit": {
    id: "bf-5-2",
    title: "Building Business Credit",
    description: "Establish and grow your business credit score for better financing options.",
    duration: "15 min",
    points: 75,
    category: "Small Business Finance",
    nextLesson: "pricing-strategy",
    prevLesson: "funding-options",
    content: [
      {
        type: "intro",
        text: "Business credit is separate from personal credit. Building it opens doors to better financing terms and protects your personal credit. Here's how to establish and grow it."
      },
      {
        type: "section",
        title: "Business vs Personal Credit",
        text: `**Personal Credit:**
• Tied to your SSN
• FICO score 300-850
• Based on personal debts

**Business Credit:**
• Tied to your EIN
• Multiple scoring systems (Dun & Bradstreet, Experian Business, Equifax Business)
• Based on business payment history

**Why separate them?**
• Larger credit limits without personal guarantee
• Business issues don't tank personal score
• More professional for larger contracts`
      },
      {
        type: "section",
        title: "Step 1: Establish Your Business Identity",
        text: `**Before you can build business credit:**

1. **Get an EIN** — Free from IRS.gov
2. **Form a legal entity** — LLC or corporation
3. **Open a business bank account** — Establishes financial identity
4. **Get a business phone number** — Listed in directories
5. **Create a business address** — Can use UPS Store, not PO Box
6. **Register with Dun & Bradstreet** — Get a DUNS number (free)`
      },
      {
        type: "section",
        title: "Step 2: Build Credit History",
        text: `**Start with 'net 30' vendor accounts:**
These report to business credit bureaus.

• Uline (office/shipping supplies)
• Grainger (industrial supplies)
• Quill (office supplies)
• Strategic Network Solutions

Buy something, pay on time (or early), repeat.

**Then get a business credit card:**
• Start with secured if needed
• Capital One Spark, Chase Ink, Amex Blue Business
• Pay in full every month
• Request credit limit increases

**Finally, establish trade lines:**
• Negotiate payment terms with regular vendors
• Ask them to report positive payment history`
      },
      {
        type: "callout",
        title: "💡 The Payment Timing Trick",
        text: "D&B tracks how early you pay. Paying 'on time' gives you a score of 80. Paying early pushes you toward 100. Set up payments for a few days before due date."
      },
      {
        type: "section",
        title: "Monitor and Protect",
        text: `**Check your business credit:**
• Nav.com (free monitoring)
• D&B (direct)
• Experian Business

**Keep it healthy:**
• Pay everything early or on time
• Keep utilization low
• Dispute any errors immediately
• Don't apply for too much credit at once

**Timeline:** Building solid business credit takes 1-2 years of consistent activity.`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Get your DUNS number from Dun & Bradstreet (free at dnb.com). Then open one net-30 vendor account and make a small purchase to start building history."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Business credit is separate from personal—build both",
          "Start with DUNS number and vendor net-30 accounts",
          "Pay early for best D&B scores",
          "Takes 1-2 years to establish strong business credit"
        ]
      }
    ],
    quiz: [
      { question: "What's a DUNS number?", options: ["Tax ID", "Business credit identifier from D&B", "Bank account number", "License number"], correct: 1 },
      { question: "What's a 'net 30' account?", options: ["30% discount", "Account that reports to bureaus with 30-day payment terms", "30-day free trial", "30 credit limit"], correct: 1 },
      { question: "How long does it take to build solid business credit?", options: ["30 days", "6 months", "1-2 years", "10 years"], correct: 2 }
    ]
  },

  "pricing-strategy": {
    id: "bf-5-3",
    title: "Pricing Strategy",
    description: "How to price your products and services for profit, not just revenue.",
    duration: "18 min",
    points: 75,
    category: "Small Business Finance",
    nextLesson: null,
    prevLesson: "business-credit",
    content: [
      {
        type: "intro",
        text: "Underpricing is the most common small business mistake. You work hard, make sales, and still struggle. The problem isn't your work—it's your price. Here's how to fix it."
      },
      {
        type: "section",
        title: "The Underpricing Trap",
        text: `**Why businesses underprice:**
• Fear of losing customers
• Lack of confidence
• Not knowing true costs
• Racing to the bottom with competitors
• Imposter syndrome

**The result:**
• Working constantly but not profiting
• Can't afford to hire help
• No room for marketing or growth
• Burnout

**Reality:** You can't save your way to profitability. You must charge what you're worth.`
      },
      {
        type: "section",
        title: "Cost-Plus Pricing",
        text: `**Calculate your true costs:**

**Direct costs:**
Materials, labor, shipping, packaging

**Indirect costs (allocated):**
Rent, utilities, software, insurance, your time

**Desired profit margin:**
What do you actually want to make?

**Formula:**
Price = (Direct Costs + Allocated Indirect Costs) × (1 + Profit Margin)

**Example:**
Product costs $20 to make and fulfill
Your time and overhead adds $10
You want 30% margin
Price = $30 × 1.30 = $39`
      },
      {
        type: "section",
        title: "Value-Based Pricing",
        text: `**Better approach:** Price based on value to customer, not your costs.

**What's the outcome worth to them?**

If you save a business $50,000/year, charging $5,000 is a bargain.
If you plan a wedding that creates lifelong memories, $10,000 is reasonable.
If you fix a urgent problem, premium pricing is justified.

**Questions to ask:**
• What would they pay someone else?
• What's the cost of NOT solving this?
• What's the ROI of your solution?
• What do competitors charge?`
      },
      {
        type: "callout",
        title: "💡 The Confidence Test",
        text: "If you're not occasionally losing deals because of price, you're probably too cheap. Raise prices until 20-30% of prospects push back. That's the market telling you where value sits."
      },
      {
        type: "section",
        title: "Raising Prices",
        text: `**When to raise:**
• You're at capacity and can't take more work
• You haven't raised in over a year
• Costs have increased
• You've gained expertise/credentials

**How to raise:**
• New customers: Just set new prices
• Existing customers: Give 30-60 day notice, explain value
• Grandfather loyal clients if needed (temporarily)

**What happens when you raise prices:**
• Some customers leave (often the difficult ones)
• Remaining customers value you more
• You make more money with less stress
• You attract better customers`
      },
      {
        type: "action",
        title: "🎯 Your Action Item",
        text: "Calculate your true hourly rate including ALL overhead. If it's not at least 3x what you'd earn as an employee, your prices are too low. Plan a price increase."
      },
      {
        type: "summary",
        title: "Key Takeaways",
        points: [
          "Underpricing kills more businesses than overpricing",
          "Include ALL costs—most people underestimate overhead",
          "Value-based pricing beats cost-plus for services",
          "If you never lose deals on price, you're too cheap"
        ]
      }
    ],
    quiz: [
      { question: "What's the most common small business pricing mistake?", options: ["Overpricing", "Underpricing", "Complicated pricing", "No pricing"], correct: 1 },
      { question: "What does value-based pricing focus on?", options: ["Your costs", "Competitor prices", "Value/outcome for customer", "Industry averages"], correct: 2 },
      { question: "What percentage of prospects should push back on price?", options: ["0%—never lose a deal", "20-30%", "50%", "100%"], correct: 1 }
    ]
  }

};
