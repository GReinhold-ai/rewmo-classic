interface Tier {
    name: string;
    minDays: number;
    maxDays: number;
    multiplier: number;
    color: string;
  }
  
  const TIERS: Tier[] = [
    { name: 'Silver', minDays: 0, maxDays: 89, multiplier: 1, color: 'bg-gray-400' },
    { name: 'Gold', minDays: 90, maxDays: 179, multiplier: 1.25, color: 'bg-yellow-400' },
    { name: 'Platinum', minDays: 180, maxDays: 364, multiplier: 1.5, color: 'bg-blue-400' },
    { name: 'Diamond', minDays: 365, maxDays: Infinity, multiplier: 2.0, color: 'bg-purple-500' },
  ];
  
  export default function TierProgress({ daysActive = 110 }: { daysActive: number }) {
    const currentTier = TIERS.find(t => daysActive >= t.minDays && daysActive <= t.maxDays)!;
    const nextTier = TIERS.find(t => t.minDays > currentTier.minDays) || currentTier;
    const daysToNext = Math.max(0, nextTier.minDays - daysActive);
    const progress = Math.min(100, (daysActive - currentTier.minDays) / (nextTier.minDays - currentTier.minDays) * 100);
  
    return (
      <div className="mt-6 p-4 rounded-lg bg-white dark:bg-gray-800 shadow">
        <h3 className="text-lg font-semibold mb-2">Membership Tier: {currentTier.name}</h3>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className={`${currentTier.color} h-4 transition-all`} style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {daysToNext === 0 ? `You're at the top tier!` : `${daysToNext} days to reach ${nextTier.name} tier (${nextTier.multiplier}x rewards)`}.
        </p>
      </div>
    );
  }
  