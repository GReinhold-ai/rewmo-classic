interface RewardCardProps {
  title: string;
  image: string;
  asin: string;
  userId: string;
  tierBonus?: number;
}

export default function RewardCard({ title, image, asin, userId, tierBonus = 0 }: RewardCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-all text-center">
      <img src={image} alt={title} className="h-36 object-contain mb-2 rounded" />
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>

      {tierBonus > 0 && (
        <div className="text-xs text-green-700 bg-green-100 dark:bg-green-800/50 px-2 py-1 rounded-full mb-2">
          +{tierBonus.toFixed(1)}% Bonus
        </div>
      )}

      <a
        href={`https://www.amazon.com/dp/${asin}?tag=rewmoai-20&ascsubtag=${userId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-full text-sm font-semibold"
      >
        Buy on Amazon
      </a>
    </div>
  );
}
