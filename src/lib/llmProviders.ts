// src/lib/llmProviders.ts
// LLM Provider Configuration with Transparency Metadata

export type LLMProviderId = 'openai' | 'anthropic' | 'grok' | 'mistral';

export interface LLMProvider {
  id: LLMProviderId;
  name: string;
  model: string;
  company: string;
  headquarters: string;
  country: string;
  countryFlag: string;
  foundedYear: number;
  keyInvestors: string[];
  dataJurisdiction: string;
  biasProfile: string;
  biasDescription: string;
  censorshipLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  privacyLevel: 'Standard' | 'Strong' | 'GDPR Protected' | 'Compromised';
  bestFor: string[];
  considerations: string[];
  promptStoragePolicy: string;
  governmentAccessRisk: string;
  available: boolean;
  requiresPro: boolean;
  costTier: '$' | '$$' | '$$$';
  responseStyle: string;
  religiousTolerance: 'Respectful' | 'Cautious' | 'Neutral' | 'Restricted';
  politicalHandling: string;
}

export const LLM_PROVIDERS: Record<LLMProviderId, LLMProvider> = {
  openai: {
    id: 'openai',
    name: 'GPT-4o',
    model: 'gpt-4o',
    company: 'OpenAI',
    headquarters: 'San Francisco, CA',
    country: 'United States',
    countryFlag: '🇺🇸',
    foundedYear: 2015,
    keyInvestors: ['Microsoft ($13B+)', 'Khosla Ventures', 'Reid Hoffman'],
    dataJurisdiction: 'US Law',
    biasProfile: 'Progressive lean',
    biasDescription: 'Documented asymmetric handling of political content. May add unsolicited counterpoints to traditional/conservative viewpoints.',
    censorshipLevel: 'Moderate',
    privacyLevel: 'Standard',
    bestFor: ['General tasks', 'Coding', 'Creative writing', 'Analysis'],
    considerations: [
      'Documented political bias in outputs',
      'May decline or heavily caveat religious content',
      'Training data used to improve models (opt-out available)',
      'Microsoft has significant influence'
    ],
    promptStoragePolicy: 'Prompts stored for 30 days. May be used for model improvement unless opted out via API settings.',
    governmentAccessRisk: 'Subject to US legal process (subpoenas, FISA court orders)',
    available: true,
    requiresPro: false,
    costTier: '$$$',
    responseStyle: 'Polished, tends toward verbose explanations',
    religiousTolerance: 'Cautious',
    politicalHandling: 'Often adds "balance" to conservative viewpoints unprompted'
  },

  anthropic: {
    id: 'anthropic',
    name: 'Claude',
    model: 'claude-sonnet-4-20250514',
    company: 'Anthropic',
    headquarters: 'San Francisco, CA',
    country: 'United States',
    countryFlag: '🇺🇸',
    foundedYear: 2021,
    keyInvestors: ['Google ($2B+)', 'Spark Capital', 'Salesforce'],
    dataJurisdiction: 'US Law',
    biasProfile: 'Cautious, balanced',
    biasDescription: 'Constitutional AI approach. More likely to engage thoughtfully with multiple perspectives but may be overly cautious on edge cases.',
    censorshipLevel: 'Moderate',
    privacyLevel: 'Strong',
    bestFor: ['Nuanced reasoning', 'Long documents', 'Thoughtful analysis', 'Learning'],
    considerations: [
      'May decline edge cases out of caution',
      'Generally respectful of religious content',
      'Strong privacy practices',
      'Founded by ex-OpenAI researchers focused on safety'
    ],
    promptStoragePolicy: 'Prompts not used for training by default. Strong data retention policies.',
    governmentAccessRisk: 'Subject to US legal process (subpoenas, FISA court orders)',
    available: true,
    requiresPro: true,
    costTier: '$$',
    responseStyle: 'Thoughtful, nuanced, tends to acknowledge complexity',
    religiousTolerance: 'Respectful',
    politicalHandling: 'Generally presents multiple perspectives without strong lean'
  },

  grok: {
    id: 'grok',
    name: 'Grok',
    model: 'grok-beta',
    company: 'xAI',
    headquarters: 'Austin, TX',
    country: 'United States',
    countryFlag: '🇺🇸',
    foundedYear: 2023,
    keyInvestors: ['Elon Musk (Founder)', 'Private investors'],
    dataJurisdiction: 'US Law',
    biasProfile: 'Minimal filtering',
    biasDescription: 'Designed for "maximum truth-seeking" with fewer guardrails. More willing to engage with controversial topics directly.',
    censorshipLevel: 'Low',
    privacyLevel: 'Standard',
    bestFor: ['Unfiltered responses', 'Real-time information', 'Controversial topics', 'Direct answers'],
    considerations: [
      'Fewer safety guardrails than competitors',
      'Newer, less battle-tested',
      'Access to real-time X (Twitter) data',
      'May be more willing to engage with edge cases'
    ],
    promptStoragePolicy: 'Integrated with X platform. Data policies aligned with X/Twitter terms.',
    governmentAccessRisk: 'Subject to US legal process (subpoenas, FISA court orders)',
    available: true,
    requiresPro: true,
    costTier: '$$',
    responseStyle: 'Direct, sometimes irreverent, less hedging',
    religiousTolerance: 'Neutral',
    politicalHandling: 'More willing to engage without adding unsolicited counterpoints'
  },

  mistral: {
    id: 'mistral',
    name: 'Mistral Large',
    model: 'mistral-large-latest',
    company: 'Mistral AI',
    headquarters: 'Paris',
    country: 'France',
    countryFlag: '🇫🇷',
    foundedYear: 2023,
    keyInvestors: ['Andreessen Horowitz', 'Lightspeed', 'EU investors'],
    dataJurisdiction: 'EU Law (GDPR)',
    biasProfile: 'More neutral',
    biasDescription: 'European perspective. GDPR-compliant with strong privacy focus. Less politically charged than US counterparts.',
    censorshipLevel: 'Low',
    privacyLevel: 'GDPR Protected',
    bestFor: ['Privacy-conscious users', 'European compliance', 'Neutral responses', 'Efficiency'],
    considerations: [
      'GDPR provides stronger privacy protections',
      'European cultural perspective in training',
      'Smaller training data than US giants',
      'Strong open-source commitment'
    ],
    promptStoragePolicy: 'GDPR compliant. Strong data protection. EU "right to be forgotten" applies.',
    governmentAccessRisk: 'EU legal process only. GDPR limits government access significantly.',
    available: true,
    requiresPro: true,
    costTier: '$',
    responseStyle: 'Efficient, direct, less verbose',
    religiousTolerance: 'Neutral',
    politicalHandling: 'Generally neutral, European perspective'
  }
};

// Chinese providers - NOT offered but documented for transparency
export const CHINESE_PROVIDERS_WARNING = {
  providers: ['DeepSeek', 'Qwen (Alibaba)', 'Baidu ERNIE', 'Yi (01.AI)'],
  country: 'China',
  countryFlag: '🇨🇳',
  warning: 'NOT AVAILABLE ON REWMOAI',
  reason: `China's National Intelligence Law (2017) requires all Chinese companies to:
• Support, assist, and cooperate with state intelligence work
• Hand over data when requested by the government
• Keep such requests secret

This means your prompts—business ideas, personal information, financial data—are legally accessible to the Chinese government without your knowledge or consent.

RewmoAI does not offer Chinese AI providers to protect your data privacy and security.`,
  dataRisk: 'CRITICAL: Full government access by law',
  censorshipLevel: 'Very High',
  censoredTopics: ['Taiwan', 'Tiananmen Square', 'Tibet', 'Xinjiang', 'CCP criticism', 'Democracy movements']
};

// Helper functions
export function getAvailableProviders(isPro: boolean): LLMProvider[] {
  return Object.values(LLM_PROVIDERS).filter(
    provider => provider.available && (isPro || !provider.requiresPro)
  );
}

export function getProviderById(id: LLMProviderId): LLMProvider | undefined {
  return LLM_PROVIDERS[id];
}

export function getDefaultProvider(isPro: boolean): LLMProvider {
  return isPro ? LLM_PROVIDERS.anthropic : LLM_PROVIDERS.openai;
}

// Data sensitivity warnings
export const DATA_SENSITIVITY_WARNINGS = {
  categories: [
    {
      level: 'CRITICAL',
      color: 'red',
      examples: ['Passwords', 'API keys', 'SSNs', 'Medical records', 'Attorney-client communications'],
      warning: 'NEVER share with any AI'
    },
    {
      level: 'HIGH',
      color: 'orange',
      examples: ['Trade secrets', 'Unreleased financials', 'Employee PII', 'Customer data', 'Government RFPs'],
      warning: 'Consider jurisdiction and storage policies'
    },
    {
      level: 'MEDIUM',
      color: 'yellow',
      examples: ['Business strategies', 'Internal processes', 'Competitive analysis', 'Pricing plans'],
      warning: 'Anonymize when possible'
    },
    {
      level: 'LOW',
      color: 'green',
      examples: ['Public information', 'General questions', 'Learning content', 'Creative writing'],
      warning: 'Generally safe with any provider'
    }
  ],
  generalAdvice: [
    'Assume every prompt is stored permanently',
    'Anonymize company names and specific financials',
    'Never share credentials or access tokens',
    'Consider who can legally access data in that jurisdiction',
    'Use self-hosted options for highly sensitive work'
  ]
};
