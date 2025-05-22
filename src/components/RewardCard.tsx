import React, { useState } from "react";
import classNames from "classnames";

interface RewardCardProps {
  title: string;
  description: string;
  comingSoon?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  title,
  description,
  comingSoon = false,
  onClick,
  icon,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={classNames(
        "relative bg-gray-200 text-black p-6 rounded-xl shadow text-center transition transform",
        {
          "cursor-pointer hover:scale-105 hover:shadow-lg": !!onClick && !comingSoon,
          "opacity-60 cursor-not-allowed": comingSoon,
        }
      )}
      onClick={comingSoon ? () => setShowTooltip(true) : onClick}
      onMouseLeave={() => setShowTooltip(false)}
      tabIndex={0}
    >
      {icon && <div className="mb-2 text-3xl flex justify-center">{icon}</div>}
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <p className="text-sm">{description}</p>
      {comingSoon && (
        <span className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Coming Soon
        </span>
      )}
      {comingSoon && showTooltip && (
        <div className="absolute z-20 left-1/2 -translate-x-1/2 top-24 bg-black text-white px-4 py-2 rounded-lg shadow text-xs w-52">
          This feature will launch soon.<br />
          Want early access? <a href="/invite" className="underline text-orange-400">Join the waitlist!</a>
        </div>
      )}
    </div>
  );
};
