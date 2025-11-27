import * as React from "react";
import { cn } from "@/lib/utils";

type IconPosition = "left" | "right";

interface InputProps extends React.ComponentProps<"input"> {
  children?: React.ReactNode;
  iconPosition?: IconPosition;
}

const DEFAULT_ICON_GAP_PX = 40;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, type = "text", iconPosition = "left", style, ...props }, ref) => {
    const hasIcon = !!children;

    const iconPaddingStyle: React.CSSProperties = hasIcon
      ? iconPosition === "left"
        ? { paddingLeft: `${DEFAULT_ICON_GAP_PX}px` }
        : { paddingRight: `${DEFAULT_ICON_GAP_PX}px` }
      : {};

    const mergedStyle = { ...iconPaddingStyle, ...style };

    return (
      <div
        className={cn(
          "relative flex items-center w-full transition duration-300 bg-white border border-gray-500/30 rounded-lg h-[46px] overflow-hidden focus-within:border-indigo-500",
          className
        )}
      >
        <input
          ref={ref}
          type={type}
          style={mergedStyle}
          className={cn(
            "w-full h-full outline-none placeholder-gray-500 text-sm bg-transparent px-3",
            "rounded-lg" 
          )}
          {...props}
        />

        {hasIcon && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
            )}
            style={iconPosition === "left" ? { left: 12 } : { right: 12 }}
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
