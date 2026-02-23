// src/data/ponderThis.ts
// Ponder This content and data structure

export interface PonderThis {
  id: string;
  slug: string;
  title: string;
  category: PonderCategory;
  hook: string;           // Opening attention-grabber
  content: string;        // Main content (markdown supported)
  takeaway: string;       // Key insight
  actionItem?: string;    // What to do next
  relatedCourse?: string; // Link to related course
  points: number;         // Points for sharing
  createdAt: string;
  featured?: boolean;
}

export type PonderCategory = 
  | 'ai-literacy'
  | 'personal-finance'
  | 'efficiency'
  | 'shopping-rewards'
  | 'business'
  | 'ai-transparency';

export const PONDER_CATEGORIES: Record<PonderCategory, { name: string; emoji: string; color: string }> = {
  'ai-literacy': { name: 'AI Literacy', emoji: '🤖', color: 'blue' },
  'personal-finance': { name: 'Personal Finance', emoji: '💰', color: 'green' },
  'efficiency': { name: 'R-PM Efficiency', emoji: '⚡', color: 'yellow' },
  'shopping-rewards': { name: 'Shopping Rewards', emoji: '🛒', color: 'orange' },
  'business': { name: 'Business', emoji: '💼', color: 'purple' },
  'ai-transparency': { name: 'AI Transparency', emoji: '🔍', color: 'red' },
};

export const PONDER_THIS_CONTENT: PonderThis[] = [
  // AI TRANSPARENCY SERIES
  {
    id: 'ai-trans-001',
    slug: 'ai-isnt-neutral',
    title: "AI Isn't Neutral",
    category: 'ai-transparency',
    hook: "Every AI is trained by humans who make choices.",
    content: `What data to include. What behaviors to reward. What outputs to restrict.

These choices become invisible once the system is built. The AI doesn't say "my creators told me to avoid this topic" — it just... avoids it.

When an AI refuses to write a prayer but happily writes a horoscope, that's not a bug. It's a choice someone made.

When it adds "however, some people believe..." to certain topics but not others, that's a pattern programmed in.

**The AI you use shapes how you think.** Not through obvious propaganda, but through thousands of tiny nudges about what's acceptable to discuss and how.`,
    takeaway: "Understanding AI bias helps you use these tools more critically — and choose ones that align with your values.",
    actionItem: "Try asking different AIs the same controversial question. Compare the responses. The differences reveal the values programmed in.",
    relatedCourse: 'ai-bias',
    points: 10,
    createdAt: '2026-02-20',
    featured: true,
  },
  {
    id: 'ai-trans-002',
    slug: 'the-faith-test',
    title: "Does Your AI Respect Your Beliefs?",
    category: 'ai-transparency',
    hook: "Try asking your AI to write a sincere prayer.",
    content: `Notice the tone. Does it engage respectfully, or does it hedge with "some people believe" and unsolicited counterarguments?

Now ask it to write about astrology, meditation, or climate change. Compare the warmth, the engagement, the willingness to participate.

An AI that can write a moving poem about self-care but stumbles on a prayer for a sick relative isn't neutral. It has preferences — just not yours.

This isn't about whether AI should have opinions on religion. It's about whether the AI *you're paying for* treats your worldview with respect.`,
    takeaway: "Your tools should serve your values, not correct them.",
    actionItem: "Test prompt: 'Write a sincere prayer for someone struggling with addiction.' Compare responses across different AI providers.",
    relatedCourse: 'ai-bias',
    points: 10,
    createdAt: '2026-02-20',
  },
  {
    id: 'ai-trans-003',
    slug: 'who-sees-your-prompts',
    title: "Who Sees Your Prompts?",
    category: 'ai-transparency',
    hook: "Every question you ask an AI becomes data someone stores.",
    content: `Your business ideas. Your financial struggles. Your relationship problems. Your creative projects.

All of it sits on a server somewhere, accessible to:
- The company that built the AI
- Their investors and partners
- Government agencies with legal authority
- Potentially, hackers if there's a breach

Chinese AI companies are **legally required** to share data with their government. No warrant needed. No disclosure required.

But even US companies retain your data for 30+ days, use it to train future models, and can be compelled to hand it over through legal process.

**Free AI isn't free.** You're paying with your data.`,
    takeaway: "Before you type, ask yourself: who might see this, and am I okay with that?",
    actionItem: "Review what you've shared with AI this week. Would you be comfortable if it became public?",
    relatedCourse: 'ai-privacy',
    points: 10,
    createdAt: '2026-02-20',
    featured: true,
  },

  // PERSONAL FINANCE SERIES
  {
    id: 'fin-001',
    slug: 'five-dollar-day',
    title: "The Power of $5 a Day",
    category: 'personal-finance',
    hook: "$5 seems like nothing. A coffee. A snack. Forgettable.",
    content: `But $5 a day is:
- **$150 a month**
- **$1,825 a year**
- **$18,250 over a decade**

Invested at 7% average return, that $5/day becomes **$25,000+ in 10 years**.

Most people don't feel poor because of big expenses. They feel poor because of hundreds of small ones that add up invisibly.

The fix isn't dramatic sacrifice. It's awareness. When you see where the $5 goes, you can redirect it.

Not deprivation. Redirection.`,
    takeaway: "Small daily amounts compound into life-changing sums. Track the $5s.",
    actionItem: "For one week, note every purchase under $10. Add it up. That's your hidden wealth leak.",
    relatedCourse: 'personal-finance',
    points: 10,
    createdAt: '2026-02-20',
    featured: true,
  },
  {
    id: 'fin-002',
    slug: 'debt-snowball-vs-avalanche',
    title: "Debt Snowball vs. Avalanche",
    category: 'personal-finance',
    hook: "Math says pay highest interest first. Psychology says something different.",
    content: `**The Avalanche Method** (mathematically optimal):
Pay minimums on everything, throw extra at the highest-interest debt. Saves the most money.

**The Snowball Method** (psychologically optimal):
Pay minimums on everything, throw extra at the smallest balance. Get wins faster.

Here's the truth: **the best method is the one you'll actually stick to.**

Studies show snowball works better for most people because the quick wins create momentum. That momentum beats the math.

Financial success is 20% knowledge, 80% behavior.`,
    takeaway: "Don't let perfect math prevent good progress. Quick wins build momentum.",
    actionItem: "List your debts smallest to largest. How would it feel to cross one off next month?",
    relatedCourse: 'personal-finance',
    points: 10,
    createdAt: '2026-02-20',
  },

  // AI LITERACY SERIES
  {
    id: 'ai-001',
    slug: 'ai-is-your-intern',
    title: "AI Is Your Very Smart Intern",
    category: 'ai-literacy',
    hook: "Stop thinking of AI as magic. Start thinking of it as a new employee.",
    content: `A very smart intern who:
- Works 24/7 without complaint
- Never forgets what you taught them (in a conversation)
- Can draft, research, and brainstorm incredibly fast
- Sometimes confidently says things that are completely wrong
- Needs clear instructions to do good work

You wouldn't hand an intern your most sensitive work on day one. You wouldn't trust them without checking their output. But you also wouldn't refuse to use them at all.

**The skill isn't using AI. It's managing AI.**

Give clear instructions. Check the output. Iterate. That's it.`,
    takeaway: "AI is a tool that amplifies your direction. Learn to direct well.",
    actionItem: "Next time you use AI, pretend you're giving instructions to a smart new hire. Be specific about what you want.",
    relatedCourse: 'ai-tools',
    points: 10,
    createdAt: '2026-02-20',
    featured: true,
  },
  {
    id: 'ai-002',
    slug: 'prompts-that-work',
    title: "The Secret to Prompts That Work",
    category: 'ai-literacy',
    hook: "Bad prompt: 'Write me something about marketing.' Good prompt: much longer.",
    content: `Great prompts have four parts:

**1. Role:** "You are an experienced marketing consultant..."
**2. Context:** "I run a small bakery in a suburban area..."
**3. Task:** "Write 5 social media posts for Valentine's Day..."
**4. Constraints:** "Each under 100 words, casual tone, include a call to action."

The more specific you are, the better the output.

Think of it like this: you're not asking a question. You're briefing a contractor. The clearer the brief, the better the work.`,
    takeaway: "Specific inputs create useful outputs. Vague inputs create generic garbage.",
    actionItem: "Take a prompt you've used before. Add role, context, and constraints. Compare the results.",
    relatedCourse: 'ai-tools',
    points: 10,
    createdAt: '2026-02-20',
  },

  // EFFICIENCY SERIES
  {
    id: 'eff-001',
    slug: 'the-80-20-rule',
    title: "80% of Results Come From 20% of Effort",
    category: 'efficiency',
    hook: "You're probably spending most of your time on things that barely matter.",
    content: `The Pareto Principle shows up everywhere:
- 20% of customers generate 80% of revenue
- 20% of your tasks produce 80% of your value
- 20% of your habits cause 80% of your problems

Most people try to optimize everything equally. Efficient people identify the 20% and double down.

**Ask yourself:**
- Which tasks actually move the needle?
- Which relationships matter most?
- Which habits have the biggest impact?

Do more of those. Ruthlessly cut or delegate the rest.`,
    takeaway: "Don't work harder on everything. Work smarter on what matters.",
    actionItem: "List your 10 biggest time commitments. Circle the 2 that create the most value. How can you spend more time there?",
    relatedCourse: 'rpm-efficiency',
    points: 10,
    createdAt: '2026-02-20',
    featured: true,
  },

  // SHOPPING REWARDS
  {
    id: 'shop-001',
    slug: 'click-before-you-shop',
    title: "The One Click That Pays You Back",
    category: 'shopping-rewards',
    hook: "You're leaving money on the table every time you shop online.",
    content: `Here's a simple habit that can save you hundreds per year:

**Before you buy anything online, click through a cashback link first.**

That's it. Same store. Same price. Same product. But now you get 2-10% back.

On a $500 laptop: $25-50 back.
On $200/month in Amazon purchases: $48-240/year back.
On holiday shopping: potentially hundreds.

The stores pay affiliates for sending customers. With RewmoAI, we split that payment with you — 50% of what we earn goes back to you.

It's not a discount. It's money the store was already going to spend on marketing. Now it goes to you instead.`,
    takeaway: "One extra click before checkout = free money. Build the habit.",
    actionItem: "Set RewmoAI as your shopping homepage. Make the click automatic.",
    relatedCourse: 'shopping-rewards',
    points: 10,
    createdAt: '2026-02-20',
  },
];

// Helper functions
export function getPonderBySlug(slug: string): PonderThis | undefined {
  return PONDER_THIS_CONTENT.find(p => p.slug === slug);
}

export function getPondersByCategory(category: PonderCategory): PonderThis[] {
  return PONDER_THIS_CONTENT.filter(p => p.category === category);
}

export function getFeaturedPonders(): PonderThis[] {
  return PONDER_THIS_CONTENT.filter(p => p.featured);
}

export function getAllPonders(): PonderThis[] {
  return PONDER_THIS_CONTENT;
}
