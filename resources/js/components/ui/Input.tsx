import * as React from "react";
import { cn } from "@/lib/utils";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

type IconPosition = "left" | "right";

interface InputProps extends React.ComponentProps<"input"> {
  children?: React.ReactNode;
  iconPosition?: IconPosition;
}

const DEFAULT_ICON_GAP_PX = 40;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, children, type = "text", iconPosition = "left", style, ...props }, ref) => {

    const {state : {currentTheme}} = useStoreConfigCtx()
    const hasIcon = !!children;

    const iconPaddingStyle: React.CSSProperties =  hasIcon
      ? iconPosition === "left"
        ? { paddingLeft: `${DEFAULT_ICON_GAP_PX}px` }
        : { paddingRight: `${DEFAULT_ICON_GAP_PX}px` }
      : {};
  

    const mergedStyle = { ...iconPaddingStyle, ...style };

    return (
    
         <div
          className={cn(
            "relative  flex items-center w-full rounded-md h-[46px] overflow-hidden transition",
            "focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0"
          )}
        
     
        >
      
        <input
          ref={ref}
          type={type}
          style={{...mergedStyle ,  ...{backgroundColor: currentTheme.bg,
                  color: currentTheme.text,
                  borderWidth: '2px',}}}
          className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"

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
