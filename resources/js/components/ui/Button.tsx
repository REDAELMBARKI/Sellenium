import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

export type ButtonVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "danger"
  | "outline"
  | "ghost"
  | "link";

const sizeClasses = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: keyof typeof sizeClasses;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const {
      state: { currentTheme: theme },
    } = useStoreConfigCtx();

    const base =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

    const variantStyle: React.CSSProperties = (() => {
      switch (variant) {
        case "secondary":
          return {
            background: theme.secondary,
            color: theme.text,
          };
        case "destructive":
        case "danger":
          return {
            background: theme.error,
            color: theme.textInverse,
          };
        case "outline":
          return {
            background: "transparent",
            color: theme.text,
            border: `1px solid ${theme.border}`,
          };
        case "ghost":
          return {
            background: "transparent",
            color: theme.text,
          };
        case "link":
          return {
            background: "transparent",
            color: theme.link,
            padding: 0,
          };
        default:
          return {
            background: theme.primary,
            color: theme.textInverse,
          };
      }
    })();

    return (
      <Comp
        ref={ref}
        className={cn(base, sizeClasses[size], className)}
        style={variantStyle}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };