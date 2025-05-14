import { useEffect, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '@/lib/firebase';

export default function RedeemModal({ onClose }: { onClose: () => void }) {
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleConfirmRedeem = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert('You must be logged in to redeem.');
      return;
    }

    if (!selectedReward) {
      alert('Please select a reward to redeem.');
      return;
    }

    try {
      setIsRedeeming(true);

      const functions = getFunctions();
      const redeemPoints = httpsCallable(functions, 'logRewardRedemption');

      await redeemPoints({
        userId,
        rewardType: selectedReward,
        pointsUsed: 2000,
      });

      alert(`🎉 Successfully redeemed ${selectedReward}!`);
    } catch (error: any) {
      console.error('Redemption failed:', error);
      alert('Failed to redeem. Please try again.');
    } finally {
      setIsRedeeming(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Redeem Your Points
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
          Choose your reward and confirm to redeem 2,000 points.
        </p>

        <ul className="space-y-2 mb-4">
          {['✈️ $20 Flight Credit', '🛍️ $20 Amazon Gift Card', '🏠 $20 Rent Offset'].map((reward) => (
            <li
              key={reward}
              onClick={() => !isRedeeming && setSelectedReward(reward)}
              className={`p-3 rounded cursor-pointer ${
                selectedReward === reward
                  ? 'bg-blue-100 dark:bg-blue-700 text-blue-800'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              } ${isRedeeming ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {reward}
            </li>
          ))}
        </ul>

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={isRedeeming}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            onClick={handleConfirmRedeem}
            disabled={!selectedReward || isRedeeming}
          >
            {isRedeeming ? 'Redeeming...' : 'Confirm Redeem'}
          </button>
        </div>
      </div>
    </div>
  );
}
