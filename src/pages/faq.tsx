import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const faqData: FAQSection[] = [
  {
    title: "Rewards & Shopping",
    items: [
      {
        question: "How do I earn cashback?",
        answer: "Shop through RewmoAI at our partner retailers. Simply click on a retailer from our Shopping page, make your purchase, and cashback is automatically tracked to your account. No extra steps required!"
      },
      {
        question: "Which retailers are included?",
        answer: "We partner with 30+ top retailers including Amazon, Walmart, Target, Nordstrom, Sephora, Best Buy, and many more. Visit our Shopping page to see the full list of available retailers."
      },
      {
        question: "When can I withdraw my rewards?",
        answer: "Your activity accrues points during our beta period. Withdrawals will open after official launch, according to program terms. We'll notify you via email when withdrawals become available."
      },
      {
        question: "How do I track my earnings?",
        answer: "Log into your RewmoAI account and visit the Rewards page. You'll see your total earnings, pending rewards, and complete transaction history."
      },
      {
        question: "How long does it take for rewards to appear?",
        answer: "Most rewards appear within 24-48 hours of your purchase. Some retailers may take up to 7 days to report transactions. Rewards become confirmed after the retailer's return period ends (typically 30-60 days)."
      }
    ]
  },
  {
    title: "Account",
    items: [
      {
        question: "Is RewmoAI free to join?",
        answer: "Yes! Creating a RewmoAI account is completely free. You can start earning cashback rewards and accessing our training courses immediately after signing up."
      },
      {
        question: "How do I create an account?",
        answer: "Click the 'Account' button in the top navigation, then select 'Sign Up'. You can register with your email address or sign in with Google. It takes less than a minute!"
      },
      {
        question: "How do I reset my password?",
        answer: "On the login page, click 'Forgot Password'. Enter your email address and we'll send you a link to reset your password. Check your spam folder if you don't see it within a few minutes."
      },
      {
        question: "Can I use RewmoAI on my phone?",
        answer: "Yes! RewmoAI works great on mobile browsers. Simply visit rewmo.ai on your phone and log in to access all features including shopping, training, and rewards tracking."
      }
    ]
  },
  {
    title: "Training & Lean Lab",
    items: [
      {
        question: "What training courses are available?",
        answer: (
          <>
            We offer short, hands-on modules across three tracks:
            <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
              <li><strong>GenAI</strong> — practical prompts, workflows, and AI tools</li>
              <li><strong>R-PM (Lean Lab)</strong> — map routines, reduce waste, and improve flow</li>
              <li><strong>Finance</strong> — foundations, investing basics, and valuation intros</li>
            </ul>
          </>
        )
      },
      {
        question: "Are the courses free?",
        answer: "Yes! All training courses on RewmoAI are completely free. We believe everyone should have access to quality education in AI, process improvement, and personal finance."
      },
      {
        question: "Do I earn rewards for completing training?",
        answer: "Currently, rewards are earned through shopping and referrals. However, completing training helps you build skills that can improve your financial decisions and business processes—which is its own reward!"
      },
      {
        question: "How long are the training modules?",
        answer: "Our modules are designed to be short and practical—most can be completed in 5-15 minutes. Learn at your own pace and apply what you learn immediately."
      }
    ]
  },
  {
    title: "General",
    items: [
      {
        question: "What is RewmoAI?",
        answer: "RewmoAI is an AI-powered rewards platform that helps you earn cashback on everyday purchases while learning valuable skills. We combine shopping rewards from top retailers, AI-powered financial tools, and free training courses in one platform."
      },
      {
        question: "How does RewmoAI make money?",
        answer: "RewmoAI participates in affiliate marketing programs, including the Amazon Associates Program and others. When you click a partner link and make a purchase, we may earn a commission at no extra cost to you. We share a portion of this with you as cashback rewards."
      },
      {
        question: "How do I contact support?",
        answer: (
          <>
            Have a question or need help? Reach out to us at{' '}
            <a href="mailto:support@rewmo.ai" className="text-[#f97316] hover:underline">
              support@rewmo.ai
            </a>
            {' '}or connect with us on{' '}
            <a href="https://www.linkedin.com/company/rewmoai" target="_blank" rel="noopener noreferrer" className="text-[#f97316] hover:underline">
              LinkedIn
            </a>
            . We typically respond within 24 hours.
          </>
        )
      },
      {
        question: "Is my information secure?",
        answer: (
          <>
            Yes! We take privacy and security seriously. Your data is protected using industry-standard encryption and secure authentication through Firebase. We never sell your personal information. Read our full{' '}
            <Link href="/privacy" className="text-[#f97316] hover:underline">
              Privacy Policy
            </Link>
            {' '}for details.
          </>
        )
      }
    ]
  }
];

const FAQAccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onClick: () => void }> = ({ 
  item, 
  isOpen, 
  onClick 
}) => {
  return (
    <div className="border-b border-gray-700">
      <button
        className="w-full py-4 px-2 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
        onClick={onClick}
      >
        <span className="text-white font-medium pr-4">{item.question}</span>
        <span className="text-[#f97316] text-2xl flex-shrink-0">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 px-2 text-gray-300 leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
};

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (sectionIndex: number, itemIndex: number) => {
    const key = `${sectionIndex}-${itemIndex}`;
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(key)) {
      newOpenItems.delete(key);
    } else {
      newOpenItems.add(key);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <>
      <Head>
        <title>FAQ - RewmoAI</title>
        <meta name="description" content="Frequently asked questions about RewmoAI - rewards, shopping, training, and more." />
      </Head>

      <div className="min-h-screen bg-[#0a3d3d] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#f97316] mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-300 text-lg">
              Everything you need to know about RewmoAI
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqData.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white/5 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  {section.title}
                </h2>
                <div className="space-y-0">
                  {section.items.map((item, itemIndex) => (
                    <FAQAccordionItem
                      key={itemIndex}
                      item={item}
                      isOpen={openItems.has(`${sectionIndex}-${itemIndex}`)}
                      onClick={() => toggleItem(sectionIndex, itemIndex)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-white/5 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-300 mb-4">
              We're here to help! Reach out to our support team.
            </p>
            <a
              href="mailto:support@rewmo.ai"
              className="inline-block bg-[#f97316] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#ea580c] transition-colors"
            >
              Contact Support
            </a>
          </div>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-[#f97316] transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/privacy" className="text-gray-400 hover:text-[#f97316] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/reward-rules" className="text-gray-400 hover:text-[#f97316] transition-colors">
              Reward Rules
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/about" className="text-gray-400 hover:text-[#f97316] transition-colors">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
