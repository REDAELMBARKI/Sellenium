import { ToastType } from "@/context/ToastContext";
import { ToastInternal } from "@/contextProvoders/ToastProvider";
import { useState, useCallback, useEffect, useRef, createContext, useContext } from "react";


export function Toast({
  toast,
  onRemove,
}: {
  toast: ToastInternal;
  onRemove: (id: string) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!barRef.current || toast.duration <= 0) return;
    const bar = barRef.current;
    bar.style.transitionDuration = `${toast.duration}ms`;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        bar.style.transform = "scaleX(0)";
      })
    );
  }, [toast.duration]);

  useEffect(() => {
    if (!barRef.current) return;
    barRef.current.style.transitionPlayState = hovered ? "paused" : "running";
  }, [hovered]);

  const config = {
    success: {
      accent: "#00e5a0",
      glow: "rgba(0,229,160,0.15)",
      border: "rgba(0,229,160,0.2)",
      bg: "rgba(8, 20, 16, 0.96)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="tv-icon">
          <path
            d="M20 6L9 17l-5-5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    error: {
      accent: "#ff4d6d",
      glow: "rgba(255,77,109,0.15)",
      border: "rgba(255,77,109,0.2)",
      bg: "rgba(20, 8, 12, 0.96)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="tv-icon">
          <path
            d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    info: {
      accent: "#4d9fff",
      glow: "rgba(77,159,255,0.15)",
      border: "rgba(77,159,255,0.2)",
      bg: "rgba(8, 12, 22, 0.96)",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="tv-icon">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  };

  const c = config[toast.type];

  return (
    <div
      className={`tv-toast ${toast.leaving ? "tv-leave" : "tv-enter"}`}
      style={
        {
          "--accent": c.accent,
          "--glow": c.glow,
          "--border": c.border,
          "--bg": c.bg,
        } as React.CSSProperties
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="tv-glow" />

      <div className="tv-icon-wrap">{c.icon}</div>

      <div className="tv-content">
        {toast.title && <p className="tv-title">{toast.title}</p>}
        {toast.description && <p className="tv-desc">{toast.description}</p>}
        {toast.action && <div className="tv-action">{toast.action}</div>}
      </div>

      <button
        className="tv-close"
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 14 14" fill="none">
          <path
            d="M1 1l12 12M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="tv-bar-track">
        <div ref={barRef} className="tv-bar" />
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────



/*
──────────────────────────────────────────────────────
USAGE
──────────────────────────────────────────────────────

1. Wrap your app once in main.tsx or App.tsx:

    import { ToastProvider } from './components/Toast';
    <ToastProvider><App /></ToastProvider>

2. Call addToast() anywhere:

    import { useToast } from './components/Toast';
    const { addToast } = useToast();

    onError: (errors) => {
      if (errors?.submit) {
        addToast({
          type: "error",
          title: "Order failed",
          description: Array.isArray(errors.submit)
            ? errors.submit[0]
            : errors.submit,
        });
      }
      if (errors?.coupon) {
        addToast({
          type: "info",
          title: "Coupon issue",
          description: Array.isArray(errors.coupon)
            ? errors.coupon[0]
            : errors.coupon,
        });
      }
    }

3. ToastProvider, useToast, and Toast are all exported
   so you can use <Toast /> standalone if needed.
──────────────────────────────────────────────────────
*/