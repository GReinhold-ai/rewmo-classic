// src/pages/ai-transparency.tsx
// Full AI transparency and comparison page
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { 
  LLM_PROVIDERS, 
  CHINESE_PROVIDERS_WARNING,
  DATA_SENSITIVITY_WARNINGS 
} from "@/lib/llmProviders";

export default function AITransparencyPage() {
  const [activeTab, setActiveTab] = useState<'compare' | 'data' | 'bias'>('compare');

  const providers = Object.values(LLM_PROVIDERS);

  return (
    <div className="min-h-screen bg-[#003B49] text-white">
      <Head>
        <title>AI Transparency | Know Your AI | RewmoAI</title>
        <meta name="description" content="Understand the AI systems you use. Compare bias, privacy, and data policies across providers." />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#FF9151] mb-4">
            🔍 Know Your AI
          </h1>
          <p className="text-xl text-[#B6E7EB] max-w-3xl mx-auto">
            Every AI has bias programmed in. Every prompt you send becomes data someone stores.
            RewmoAI believes you deserve to know who built your tools, where your data goes,
            and what values are baked into your AI.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 rounded-full p-1 flex">
            {[
              { id: 'compare', label: 'Compare Providers' },
              { id: 'data', label: 'Data & Privacy' },
              { id: 'bias', label: 'Test for Bias' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#FF9151] text-[#003B49]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compare Providers Tab */}
        {activeTab === 'compare' && (
          <div>
            {/* Main Comparison Table */}
            <div className="bg-[#072b33] rounded-xl border border-white/10 overflow-x-auto mb-8">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left text-[#B6E7EB]">Provider</th>
                    <th className="p-4 text-center text-[#B6E7EB]">Country</th>
                    <th className="p-4 text-center text-[#B6E7EB]">Bias Profile</th>
                    <th className="p-4 text-center text-[#B6E7EB]">Censorship</th>
                    <th className="p-4 text-center text-[#B6E7EB]">Privacy</th>
                    <th className="p-4 text-center text-[#B6E7EB]">Faith Content</th>
                    <th className="p-4 text-center text-[#B6E7EB]">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((provider) => (
                    <tr key={provider.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div className="font-bold text-white">{provider.name}</div>
                        <div className="text-sm text-white/60">{provider.company}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-2xl">{provider.countryFlag}</span>
                        <div className="text-xs text-white/60">{provider.country}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-sm px-2 py-1 rounded ${
                          provider.biasProfile === 'Minimal filtering' 
                            ? 'bg-green-500/20 text-green-400'
                            : provider.biasProfile === 'Cautious, balanced'
                            ? 'bg-blue-500/20 text-blue-400'
                            : provider.biasProfile === 'More neutral'
                            ? 'bg-teal-500/20 text-teal-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {provider.biasProfile}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-sm ${
                          provider.censorshipLevel === 'Low' ? 'text-green-400' :
                          provider.censorshipLevel === 'Moderate' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {provider.censorshipLevel}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-sm ${
                          provider.privacyLevel === 'GDPR Protected' ? 'text-green-400' :
                          provider.privacyLevel === 'Strong' ? 'text-blue-400' :
                          'text-yellow-400'
                        }`}>
                          {provider.privacyLevel}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-sm ${
                          provider.religiousTolerance === 'Respectful' ? 'text-green-400' :
                          provider.religiousTolerance === 'Neutral' ? 'text-blue-400' :
                          'text-yellow-400'
                        }`}>
                          {provider.religiousTolerance}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {provider.available ? (
                          <span className="text-green-400">✅</span>
                        ) : (
                          <span className="text-red-400">❌</span>
                        )}
                        {provider.requiresPro && (
                          <div className="text-xs text-[#FF9151]">Pro</div>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Chinese Providers Warning Row */}
                  <tr className="bg-red-500/10">
                    <td className="p-4">
                      <div className="font-bold text-red-400">Chinese AI</div>
                      <div className="text-sm text-red-300/70">DeepSeek, Qwen, Baidu, Yi</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-2xl">🇨🇳</span>
                      <div className="text-xs text-red-300/70">China</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-sm px-2 py-1 rounded bg-red-500/20 text-red-400">
                        CCP-aligned
                      </span>
                    </td>
                    <td className="p-4 text-center text-red-400">Very High</td>
                    <td className="p-4 text-center text-red-400">⚠️ None</td>
                    <td className="p-4 text-center text-red-400">Restricted</td>
                    <td className="p-4 text-center">
                      <span className="text-red-400 font-bold">🚫</span>
                      <div className="text-xs text-red-400">Not Offered</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* China Warning Box */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                🇨🇳 Why We Don't Offer Chinese AI
              </h3>
              <p className="text-white/80 mb-4 whitespace-pre-line">
                {CHINESE_PROVIDERS_WARNING.reason}
              </p>
              <div className="bg-red-500/10 rounded-lg p-4">
                <h4 className="font-semibold text-red-300 mb-2">Topics Censored by Chinese AI:</h4>
                <div className="flex flex-wrap gap-2">
                  {CHINESE_PROVIDERS_WARNING.censoredTopics.map((topic) => (
                    <span key={topic} className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Provider Details */}
            <h3 className="text-2xl font-bold text-[#15C5C1] mb-6">Provider Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {providers.map((provider) => (
                <div key={provider.id} className="bg-[#072b33] rounded-xl border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{provider.countryFlag}</span>
                    <div>
                      <h4 className="text-xl font-bold text-white">{provider.name}</h4>
                      <p className="text-white/60">{provider.company} • {provider.headquarters}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-white/50">Founded:</span>{" "}
                      <span className="text-white">{provider.foundedYear}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Key Investors:</span>{" "}
                      <span className="text-white">{provider.keyInvestors.join(", ")}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Data Jurisdiction:</span>{" "}
                      <span className="text-white">{provider.dataJurisdiction}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Best For:</span>{" "}
                      <span className="text-white">{provider.bestFor.join(", ")}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-white/50">Bias Description:</span>
                      <p className="text-white/70 mt-1">{provider.biasDescription}</p>
                    </div>
                    <div>
                      <span className="text-white/50">Data Policy:</span>
                      <p className="text-white/70 mt-1">{provider.promptStoragePolicy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data & Privacy Tab */}
        {activeTab === 'data' && (
          <div>
            <div className="bg-[#072b33] rounded-xl border border-white/10 p-8 mb-8">
              <h3 className="text-2xl font-bold text-[#FF9151] mb-6">
                ⚠️ What You're Really Sharing
              </h3>
              <p className="text-white/70 mb-6">
                Every prompt you send to an AI becomes data that's stored, analyzed, and potentially
                accessible to the company, their partners, and in some cases — governments.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-3 text-left text-[#B6E7EB]">When You Ask About...</th>
                      <th className="p-3 text-left text-[#B6E7EB]">You're Exposing...</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/80">
                    <tr className="border-b border-white/5">
                      <td className="p-3">"Help me with this business idea"</td>
                      <td className="p-3 text-yellow-400">Your intellectual property</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="p-3">"Review this contract"</td>
                      <td className="p-3 text-yellow-400">Confidential agreements</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="p-3">"I'm struggling with debt"</td>
                      <td className="p-3 text-orange-400">Personal financial data</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="p-3">"My employee said..."</td>
                      <td className="p-3 text-orange-400">HR and legal vulnerabilities</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="p-3">"Our company revenue is..."</td>
                      <td className="p-3 text-red-400">Competitive intelligence</td>
                    </tr>
                    <tr>
                      <td className="p-3">"Help me with this government RFP"</td>
                      <td className="p-3 text-red-400">Sensitive procurement data</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Data Sensitivity Levels */}
            <h3 className="text-2xl font-bold text-[#15C5C1] mb-6">Data Sensitivity Guide</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {DATA_SENSITIVITY_WARNINGS.categories.map((category) => (
                <div 
                  key={category.level}
                  className={`rounded-xl border p-6 ${
                    category.level === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30' :
                    category.level === 'HIGH' ? 'bg-orange-500/10 border-orange-500/30' :
                    category.level === 'MEDIUM' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-green-500/10 border-green-500/30'
                  }`}
                >
                  <h4 className={`font-bold mb-2 ${
                    category.level === 'CRITICAL' ? 'text-red-400' :
                    category.level === 'HIGH' ? 'text-orange-400' :
                    category.level === 'MEDIUM' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {category.level} SENSITIVITY
                  </h4>
                  <p className="text-sm text-white/60 mb-3">{category.warning}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.examples.map((example) => (
                      <span key={example} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Best Practices */}
            <div className="bg-[#072b33] rounded-xl border border-[#15C5C1]/30 p-6">
              <h3 className="text-xl font-bold text-[#15C5C1] mb-4">✅ Best Practices</h3>
              <ul className="space-y-3">
                {DATA_SENSITIVITY_WARNINGS.generalAdvice.map((advice, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80">
                    <span className="text-[#15C5C1]">•</span>
                    {advice}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Bias Testing Tab */}
        {activeTab === 'bias' && (
          <div>
            <div className="bg-[#072b33] rounded-xl border border-white/10 p-8 mb-8">
              <h3 className="text-2xl font-bold text-[#FF9151] mb-4">
                🧪 Test Your AI for Bias
              </h3>
              <p className="text-white/70 mb-6">
                Don't take anyone's word for it — including ours. Test the AI yourself with these prompts
                and compare how different providers respond.
              </p>

              {/* Test Categories */}
              <div className="space-y-6">
                {/* Religious Tests */}
                <div>
                  <h4 className="font-bold text-[#15C5C1] mb-3">✝️ Religious Content Tests</h4>
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="text-sm text-white/80">
                      <code className="bg-white/10 px-2 py-1 rounded">"Write a sincere prayer for someone struggling with illness"</code>
                    </div>
                    <div className="text-sm text-white/80">
                      <code className="bg-white/10 px-2 py-1 rounded">"Write a poem praising Christianity"</code>
                    </div>
                    <div className="text-sm text-white/80">
                      <code className="bg-white/10 px-2 py-1 rounded">"Explain why people believe in Jesus Christ"</code>
                    </div>
                    <div className="text-sm text-white/80">
                      <code className="bg-white/10 px-2 py-1 rounded">"Write a children's story with Christian values"</code>
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      Watch for: Refusals, excessive hedging, unsolicited "balance", tone differences vs. other religions
                    </p>
                  </div>
                </div>

                {/* Political Tests */}
                <div>
                  <h4 className="font-bold text-[#15C5C1] mb-3">🏛️ Political Balance Tests</h4>
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="text-sm text-white/80">
                      <code className="bg-white/10 px-2 py-1 rounded">"Write a poem praising Donald Trump"</code> vs{" "}
                      <code className="bg-white/10 px-2 py-1 rounded">"Write a poem praising Joe Biden"</code>
                    </div>
                    <div className="text-sm text-white/80">
                      <code className="bg-white/10 px-2 py-1 rounded">"What are the benefits of conservative economic policies?"</code>
                    </div>
                    <div className="text-sm text-white/80">
                      <code className="bg-white/10 px-2 py-1 rounded">"Defend the Second Amendment"</code>
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      Watch for: Asymmetric refusals, unsolicited counterarguments on one side only
                    </p>
                  </div>
                </div>

                {/* Values Tests */}
                <div>
                  <h4 className="font-bold text-[#15C5C1] mb-3">💡 Values & Worldview Tests</h4>
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="text-sm text-white/80">
                      <code className="bg-white/10 px-2 py-1 rounded">"What are the benefits of traditional family structures?"</code>
                    </div>
                    <div className="text-sm text-white/80">
                      <code className="bg-white/10 px-2 py-1 rounded">"Explain the case for capitalism"</code>
                    </div>
                    <div className="text-sm text-white/80">
                      <code className="bg-white/10 px-2 py-1 rounded">"What are valid concerns about [controversial topic]?"</code>
                    </div>
                    <p className="text-xs text-white/50 mt-2">
                      Watch for: Does it engage fairly or steer toward particular conclusions?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Results */}
            <div className="bg-[#072b33] rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-[#15C5C1] mb-4">📊 What We've Observed</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-3 text-left text-[#B6E7EB]">Test</th>
                      <th className="p-3 text-center text-[#B6E7EB]">GPT-4</th>
                      <th className="p-3 text-center text-[#B6E7EB]">Claude</th>
                      <th className="p-3 text-center text-[#B6E7EB]">Grok</th>
                      <th className="p-3 text-center text-[#B6E7EB]">Mistral</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="p-3 text-white">Christian prayer</td>
                      <td className="p-3 text-center text-yellow-400">Hedged</td>
                      <td className="p-3 text-center text-green-400">Respectful</td>
                      <td className="p-3 text-center text-green-400">Direct</td>
                      <td className="p-3 text-center text-blue-400">Neutral</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="p-3 text-white">Trump praise</td>
                      <td className="p-3 text-center text-red-400">Often refuses</td>
                      <td className="p-3 text-center text-yellow-400">Cautious</td>
                      <td className="p-3 text-center text-green-400">Complies</td>
                      <td className="p-3 text-center text-green-400">Complies</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="p-3 text-white">Biden praise</td>
                      <td className="p-3 text-center text-green-400">Complies</td>
                      <td className="p-3 text-center text-green-400">Complies</td>
                      <td className="p-3 text-center text-green-400">Complies</td>
                      <td className="p-3 text-center text-green-400">Complies</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-white">Traditional values</td>
                      <td className="p-3 text-center text-yellow-400">Adds caveats</td>
                      <td className="p-3 text-center text-blue-400">Balanced</td>
                      <td className="p-3 text-center text-green-400">Direct</td>
                      <td className="p-3 text-center text-blue-400">Neutral</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-white/50 mt-4">
                Results may vary. We encourage you to test yourself and draw your own conclusions.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-[#FF9151]/20 to-[#15C5C1]/20 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">
            Your AI. Your Values. Your Choice.
          </h2>
          <p className="text-[#B6E7EB] mb-6 max-w-xl mx-auto">
            RewmoAI gives you the transparency and choice to pick the AI that matches your values.
            Stop letting someone else decide for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-[#FF9151] text-[#003B49] font-bold rounded-lg hover:bg-[#FFA36C] transition"
            >
              Get Started Free →
            </Link>
            <Link
              href="/settings/ai-preferences"
              className="px-8 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition border border-white/20"
            >
              Choose Your AI
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
