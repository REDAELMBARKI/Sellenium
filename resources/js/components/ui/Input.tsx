import * as React from "react";
import { cn } from "@/lib/utils";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

type IconPosition = "left" | "right";

interface InputProps extends React.ComponentProps<"input"> {
  children?: React.ReactNode;
  iconPosition?: IconPosition;
  label?: string;
  error?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      children,
      type = "text",
      iconPosition = "left",
      style,
      label,
      error,
      hint,
      id,
      ...props
    },
    ref
  ) => {
    const { state: { currentTheme } } = useStoreConfigCtx();

    const hasIcon = !!children;
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const paddingLeft  = hasIcon && iconPosition === "left"  ? "40px" : "15px";
    const paddingRight = hasIcon && iconPosition === "right" ? "40px" : "15px";
    const accentColor  = error ? (currentTheme.error ?? "#ef4444") : currentTheme.accent;

    return (
      <div
        className="flex flex-col gap-1.5 w-full"
        // Expose theme values as CSS vars so pure CSS selectors can use them
        style={{
          "--input-accent": accentColor,
          "--input-border": currentTheme.border,
          "--input-text":   currentTheme.textSecondary,
        } as React.CSSProperties}
      >
        <style>{`
          
          .themed-input:hover { border-color: color-mix(in srgb, var(--input-accent) 40%, transparent) !important; outline: none; }
          .themed-input:focus { box-shadow: none !important; outline: none !important;
            border-color: var(--input-accent) !important;
            outline: none;
          }
          .themed-input:hover ~ .input-icon,
          .themed-input:focus ~ .input-icon {
            color: var(--input-accent) !important;
          }
        `}</style>

        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-widest select-none"
            style={{ color: error ? accentColor : currentTheme.textSecondary }}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">

          {hasIcon && iconPosition === "left" && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
              style={{ color: currentTheme.textSecondary }}
            >
              {children}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn("themed-input w-full h-[46px] rounded-xl font-medium text-sm placeholder:font-normal placeholder:opacity-40", className)}
            style={{
              paddingLeft,
              paddingRight,
              backgroundColor: "transparent",
              color: currentTheme.text,
              caretColor: accentColor,
              border: `1px solid ${currentTheme.border}`,
              outline: "none", boxShadow: "none",
              ...style,
            }}
            {...props}
          />

          {hasIcon && iconPosition === "right" && (
            <div
              className="input-icon absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
              style={{ color: currentTheme.textSecondary }}
            >
              {children}
            </div>
          )}
        </div>

        {(error || hint) && (
          <p
            className="text-xs font-medium mt-0.5 flex items-center gap-1"
            style={{ color: error ? accentColor : currentTheme.textSecondary }}
          >
            {error && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                <path d="M6 3.5V6.5M6 8H6.005" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            )}
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };