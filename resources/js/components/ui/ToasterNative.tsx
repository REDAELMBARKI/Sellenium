import React from "react";
import { useToasts } from "@/contextHooks/useToasts";

const variantClasses = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
  warning: "bg-yellow-500 text-black",
};

export const ToasterNative = () => {
  const { toasts, removeToast } = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map(({ id, title, description, variant = "info" }) => (
        <div
          key={id}
          className={`flex justify-between items-start p-4 rounded shadow-md w-80 max-w-full ${variantClasses[variant]}`}
        >
          <div>
            {title && <div className="font-bold mb-1">{title}</div>}
            {description && <div className="text-sm">{description}</div>}
          </div>
          <button
            onClick={() => {
              if(!id) return ;
              removeToast(id)
            }}
            className="ml-4 text-lg font-bold leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
