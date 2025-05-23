// src/pages/terms.tsx

import React from "react";
import BottomTabBar from "@/components/BottomTabBar"; 

export default function TermsOfService() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4 text-gray-900 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 2025</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
      <p>
        By accessing or using RewMoAI, you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Use of Service</h2>
      <ul className="list-disc pl-6">
        <li>You must be at least 18 years old.</li>
        <li>You agree to provide accurate information and keep your account secure.</li>
        <li>You are responsible for all activity under your account.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Rewards & Affiliate Programs</h2>
      <ul className="list-disc pl-6">
        <li>Rewards are earned by completing eligible actions (shopping, referrals, etc.) as described in the app.</li>
        <li>Some rewards are funded through affiliate programs (Amazon, Walmart, Target, etc.).</li>
        <li><strong>As an Amazon Associate, RewMoAI earns from qualifying purchases.</strong></li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. No Financial Advice</h2>
      <p>
        RewMoAI provides AI-driven financial insights for informational purposes only. We do not provide investment, legal, or tax advice. You are responsible for your financial decisions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Affiliate Disclosure</h2>
      <p>
        Some links in our app are affiliate links. We may receive commissions for purchases made through these links. All affiliate relationships are disclosed in accordance with FTC guidelines.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Intellectual Property</h2>
      <ul className="list-disc pl-6">
        <li>All content, logos, and code are the property of RewMoAI or its licensors.</li>
        <li>Do not copy, modify, or distribute our materials without permission.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, RewMoAI is not liable for any indirect, incidental, or consequential damages arising from your use of our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Termination</h2>
      <p>
        We may suspend or terminate your account if you violate these terms or abuse the service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Governing Law</h2>
      <p>
        These terms are governed by the laws of the State of [Your State], United States.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">10. Changes to Terms</h2>
      <p>
        We may update these Terms of Service from time to time. Significant changes will be communicated via email or in-app notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">11. Contact Us</h2>
      <p>
        Email <a href="mailto:support@rewmo.ai" className="text-orange-600 underline">support@rewmo.ai</a> or write to: RewMoAI Legal Team, [Your Business Address]
      </p>
    </main>
    <BottomTabBar />
  );
}
