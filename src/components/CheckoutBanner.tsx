import { useState } from "react";
import clsx from "clsx";

type Kind = "success" | "error" | "info";

export default function CheckoutBanner({
  kind,
  title,
  message,
  className = "",
}: {
  kind: Kind;
  title: string;
  message?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  const styles: Record<Kind, string> = {
    success:
      "bg-teal-500/10 border-teal-400/30 text-teal-200",
    error:
      "bg-red-500/10 border-red-400/30 text-red-200",
    info:
      "bg-white/10 border-white/20 text-white/90",
  };

  return (
    <div className={clsx("rounded-xl border p-4", styles[kind], className)}>
      <div className="flex items-start gap-3">
        <div className="leading-none text-xl">
          {kind === "success" ? "✅" : kind === "error" ? "⛔" : "ℹ️"}
        </div>
        <div className="flex-1">
          <div className="font-bold">{title}</div>
          {message && <div className="mt-1 text-sm opacity-90">{message}</div>}
        </div>
        <button
          onClick={() => setOpen(false)}
          className="rounded-md px-2 py-1 text-xs hover:bg-white/5"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
