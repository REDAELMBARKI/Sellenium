import React, { useEffect, useState } from "react";
import { useToasts } from "@/contextHooks/useToasts";
import { createPortal } from "react-dom";


type Variant = "success" | "error" | "info" | "warning";

const variantStyles: Record<Variant, React.CSSProperties> = {
  success: { backgroundColor: "#22c55e", color: "#ffffff" },
  error: { backgroundColor: "#ef4444", color: "#ffffff" },
  info: { backgroundColor: "#3b82f6", color: "#ffffff" },
  warning: { backgroundColor: "#facc15", color: "#000000" },
};

export const ToasterNative = () => {
  const { toasts, removeToast, toastContainerRef } = useToasts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || toasts.length === 0) return null;

  const jsx = (
    <div
      className="absolute top-0 right-0 z-[9999] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map(({ id, title, description, variant = "info" }) => (
        <ToastItem
          key={id}
          id={id ?? ''}
          title={title}
          description={description}
          variant={variant}
          removeToast={removeToast}
        />
      ))}
    </div>
  );

  return createPortal(jsx, toastContainerRef.current ?? document.body);
};

// -------------------------------------------
// Toast Item WITH FADE-IN / FADE-OUT
// -------------------------------------------

interface ToastItemProps {
  id: string;
  title?: string;
  description?: string;
  variant: Variant;
  removeToast: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({
  id,
  title,
  description,
  variant,
  removeToast,
}) => {
  const [visible, setVisible] = useState(false);

  // Fade-in when mounted
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const close = () => {
    setVisible(false); // start fade-out
    setTimeout(() => removeToast(id), 450);
  };

  const style: React.CSSProperties = {
    ...variantStyles[variant],
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : "translateY(-5px)",
    transition: "opacity 1s ease, transform 2s ease",
  };

  return (
    <div
      className="flex justify-between items-start p-4 rounded shadow-md w-80 max-w-full pointer-events-auto"
      style={style}
    >
      <div>
        {title && <div className="font-bold mb-1">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
      </div>

      <button
        onClick={close}
        className="ml-4 text-lg font-bold leading-none"
      >
        ×
      </button>
    </div>
  );
};
