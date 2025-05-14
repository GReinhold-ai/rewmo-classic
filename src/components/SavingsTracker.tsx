import React from 'react';

type Tier = {
  name: string;
  daysRequired: number;
  bonus: string;
};

const tiers: Tier[] = [
  { name: 'Bronze', daysRequired: 90, bonus: '1x' },
  { name: 'Silver', daysRequired: 180, bonus: '1.25x' },
  { name: 'Gold', daysRequired: 365, bonus: '1.5x' },
  { name: 'Platinum', daysRequired: 730, bonus: '2x' },
  { name: 'Diamond', daysRequired: 1825, bonus: '3x' },
];

export default function SavingsTracker({ daysSaved = 0 }: { daysSaved: number }) {
  const currentTierIndex = tiers.findIndex(t => daysSaved < t.daysRequired);
  const currentTier = tiers[Math.max(currentTierIndex - 1, 0)];
  const nextTier = tiers[currentTierIndex];

  const progress = nextTier
    ? ((daysSaved - currentTier.daysRequired) / (nextTier.daysRequired - currentTier.daysRequired)) * 100
    : 100;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">📈 Savings Progress</h2>

      <div className="flex justify-between text-xs text-gray-500 mb-2">
        {tiers.map((tier) => (
          <div key={tier.name} className="w-1/5 text-center">{tier.name}</div>
        ))}
      </div>

      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="absolute left-0 top-0 h-full bg-orange-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-gray-700">
        Current Tier: <strong>{currentTier.name}</strong> | Bonus: <strong>{currentTier.bonus}</strong>
        {nextTier && (
          <> – {nextTier.daysRequired - daysSaved} days to {nextTier.name} Tier</>
        )}
      </p>
    </div>
  );
}
