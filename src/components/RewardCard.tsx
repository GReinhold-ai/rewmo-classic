// src/components/RewardCard.tsx
import React from "react";

interface RewardCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  comingSoon?: boolean;
}

const RewardCard: React.FC<RewardCardProps> = ({
  title,
  description,
  icon,
  onClick,
  comingSoon = false,
}) => {
  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[200px] transition transform hover:scale-105 cursor-pointer ${comingSoon ? "opacity-60 pointer-events-none" : ""}`}
      onClick={comingSoon ? undefined : onClick}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h2 className="text-lg font-semibold text-black text-center mb-1">{title}</h2>
      <p className="text-gray-700 text-center mb-2">{description}</p>
      {comingSoon && (
        <span className="absolute top-2 right-2 bg-orange-400 text-white text-xs px-2 py-1 rounded">
          Coming Soon
        </span>
      )}
    </div>
  );
};

export default RewardCard;
