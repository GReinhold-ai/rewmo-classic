// src/components/RewardCard.tsx

import React from "react";

type RewardCardProps = {
  title: string;
  description: string;
  points: number;
  type?: string;
  onRedeem?: () => void; // Optional callback for redeeming
};

const RewardCard: React.FC<RewardCardProps> = ({
  title,
  description,
  points,
  type,
  onRedeem,
}) => {
  return (
    <div className="rounded-2xl shadow-md bg-white p-5 mb-4 w-full max-w-sm mx-auto flex flex-col gap-2 border border-orange-100">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-orange-600">{title}</h3>
        {type && (
          <span className="text-xs bg-orange-100 text-orange-500 px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
            {type}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-700">{description}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="font-semibold text-orange-600">{points} pts</span>
        {onRedeem && (
          <button
            onClick={onRedeem}
            className="bg-orange-500 text-white text-xs px-4 py-1 rounded-lg shadow hover:bg-orange-600 transition"
          >
            Redeem
          </button>
        )}
      </div>
    </div>
  );
};

export default RewardCard;
