
"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // Variant classes
    let variantClasses = "";
    switch (variant) {
      case "destructive":
        variantClasses = "bg-red-600 text-white border border-red-600";
        break;
      case "outline":
        variantClasses = "border border-gray-300 shadow-xs active:shadow-none";
        break;
      case "secondary":
        variantClasses = "bg-gray-200 text-gray-900 border border-gray-300";
        break;
      case "ghost":
        variantClasses = "border border-transparent";
        break;
      default:
        variantClasses = "bg-blue-500 text-white border border-blue-500";
    }

    // Size classes
    let sizeClasses = "";
    switch (size) {
      case "sm":
        sizeClasses = "min-h-8 px-3 text-xs rounded-md";
        break;
      case "lg":
        sizeClasses = "min-h-10 px-8 rounded-md";
        break;
      case "icon":
        sizeClasses = "h-9 w-9";
        break;
      default:
        sizeClasses = "min-h-9 px-4 py-2";
    }

    const finalClassName = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus:outline-none focus:ring-1 disabled:opacity-50 ${variantClasses} ${sizeClasses} ${className}`;

    return <Comp className={finalClassName} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button };
