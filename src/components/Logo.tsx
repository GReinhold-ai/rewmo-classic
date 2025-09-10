import clsx from "clsx";

/**
 * Centralized RewmoAI logo.
 * Uses the PNG you already have at /logos/logo.png.
 * If/when you export an SVG later, just change the src here once.
 */
export default function Logo({
  size = 40,
  withWordmark = true,
  className = "",
  label = "RewmoAI",
}: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <img
        src="/logos/logo.png"
        width={size}
        height={size}
        alt={label}
        className="block object-contain"
        style={{ width: size, height: size }}
      />
      {withWordmark && (
        <span className="font-extrabold tracking-tight" style={{ color: "#FF9151" }}>
          RewmoAI
        </span>
      )}
    </div>
  );
}
