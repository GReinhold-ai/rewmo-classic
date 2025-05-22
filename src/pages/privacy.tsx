// src/pages/privacy.tsx

import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4 text-gray-900 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Privacy Policy</h1>

      <p className="text-sm text-gray-500 mb-8">Last updated: June 2025</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Introduction</h2>
      <p>
        Welcome to RewMoAI (“we”, “us”, “our”). This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our website and app.
      </p>
      <p>
        We are committed to protecting your privacy and using your data only to provide and improve our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Information We Collect</h2>
      <ul className="list-disc pl-6">
        <li>Personal information: Name, email, phone (if provided)</li>
        <li>Financial preferences: Answers to onboarding, reward/shopping choices</li>
        <li>Usage data: Pages visited, features used, referrals, points earned</li>
        <li>Device & technical info: Browser, IP address, cookies</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Use Your Information</h2>
      <ul className="list-disc pl-6">
        <li>To operate and improve RewMoAI</li>
        <li>To personalize your financial experience and rewards</li>
        <li>To provide AI-powered financial suggestions and insights</li>
        <li>To process referrals, rewards, and affiliate commissions</li>
        <li>To communicate important updates and offers</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Affiliate Marketing Disclosure</h2>
      <p>
        RewMoAI participates in affiliate marketing programs, including the Amazon Associates Program and others (e.g., Walmart, Target). When you click a partner link and make a purchase, we may earn a commission at no extra cost to you.
        <br />
        <strong>As an Amazon Associate, RewMoAI earns from qualifying purchases.</strong>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Sharing & Security</h2>
      <ul className="list-disc pl-6">
        <li>We do <strong>not</strong> sell or rent your personal information to third parties.</li>
        <li>We may share anonymized usage data with partners to improve our offerings.</li>
        <li>Data is stored securely with industry-standard encryption and access controls.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Cookies & Tracking</h2>
      <p>
        We use cookies and similar technologies to keep you logged in, analyze site/app usage, and improve user experience. You can control cookies via your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Children’s Privacy</h2>
      <p>
        RewMoAI is not intended for children under 18. We do not knowingly collect information from minors.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Your Choices</h2>
      <ul className="list-disc pl-6">
        <li>You can update or delete your profile information at any time.</li>
        <li>You may opt out of marketing emails at any time.</li>
        <li>For questions or data requests, contact us at <a href="mailto:privacy@rewmo.ai" className="text-orange-600 underline">privacy@rewmo.ai</a>.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Updates</h2>
      <p>
        We may update this policy periodically. We will notify you of any material changes by email or in-app notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">10. Contact Us</h2>
      <p>
        Email us at <a href="mailto:privacy@rewmo.ai" className="text-orange-600 underline">privacy@rewmo.ai</a> or write to: RewMoAI Privacy Team, [Your Business Address]
      </p>
    </main>
  );
}
