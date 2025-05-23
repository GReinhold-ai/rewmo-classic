import React from "react";
import clsx from "clsx";

type RewardCardProps = {
  title: string;
  description: string;
  icon?: string; // Accept emoji or SVG string/component
  onClick?: () => void;
  comingSoon?: boolean;
};

const RewardCard: React.FC<RewardCardProps> = ({
  title,
  description,
  icon,
  onClick,
  comingSoon = false,
}) => {
  return (
    <button
      type="button"
      onClick={comingSoon ? undefined : onClick}
      disabled={comingSoon}
      className={clsx(
        "w-full rounded-xl shadow-md text-left flex flex-col items-start p-4 md:p-6 transition-all duration-200",
        comingSoon
          ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
          : "bg-white text-gray-900 hover:bg-orange-50 border border-transparent hover:shadow-lg active:shadow-inner cursor-pointer"
      )}
      aria-label={comingSoon ? `${title} (Coming Soon)` : title}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="flex flex-row items-center gap-2 mb-1">
        <span className="font-semibold text-lg">{title}</span>
        {comingSoon && (
          <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs font-bold">
            Coming Soon
          </span>
        )}
      </div>
      <p className={clsx("text-sm", comingSoon ? "text-gray-400" : "text-gray-700")}>
        {description}
      </p>
    </button>
  );
};

export default RewardCard;
