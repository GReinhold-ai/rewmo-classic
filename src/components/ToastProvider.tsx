import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type Kind = "success" | "error" | "info";

export type Toast = {
  id: string;
  kind: Kind;
  title: string;
  message?: string;
  duration?: number; // ms; default 3800
};

type Ctx = {
  show: (t: Omit<Toast, "id">) => void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, any>>({});

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const show = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = { id, duration: 3800, ...t };
    setToasts((prev) => [toast, ...prev]);
    timers.current[id] = setTimeout(() => remove(id), toast.duration);
  }, [remove]);

  const success = useCallback((title: string, message?: string, duration?: number) => {
    show({ kind: "success", title, message, duration });
  }, [show]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    show({ kind: "error", title, message, duration });
  }, [show]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    show({ kind: "info", title, message, duration });
  }, [show]);

  const value = useMemo(() => ({ show, success, error, info }), [show, success, error, info]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      {/* Container */}
      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[100] flex flex-col items-end gap-2 px-3 sm:bottom-6 sm:px-6">
        {toasts.map((t) => {
          const kindStyles =
            t.kind === "success"
              ? "bg-teal-500/10 border-teal-400/30 text-teal-100"
              : t.kind === "error"
              ? "bg-red-500/10 border-red-400/30 text-red-100"
              : "bg-white/10 border-white/20 text-white";
          const icon = t.kind === "success" ? "✅" : t.kind === "error" ? "⛔" : "ℹ️";
          return (
            <div
              key={t.id}
              className={`pointer-events-auto w-full max-w-sm rounded-xl border p-3 shadow-lg backdrop-blur ${kindStyles}`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <div className="text-xl leading-none">{icon}</div>
                <div className="flex-1">
                  <div className="font-semibold">{t.title}</div>
                  {t.message && <div className="mt-0.5 text-sm opacity-90">{t.message}</div>}
                </div>
                <button
                  onClick={() => remove(t.id)}
                  className="rounded-md px-2 py-1 text-xs hover:bg-white/5"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
