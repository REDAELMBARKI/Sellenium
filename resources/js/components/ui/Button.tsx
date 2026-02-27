import * as React from "react";
import { Button as MaterialUIButton, ButtonProps as MuiButtonProps } from "@mui/material";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

export type ButtonVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "danger"
  | "outline"
  | "ghost"
  | "link";

export interface ButtonProps extends Omit<MuiButtonProps, "variant" | "color"> {
  variant?: ButtonVariant;
  size?: "sm" | "default" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      children,
      sx,
      ...props
    },
    ref
  ) => {
    const {
      state: { currentTheme: theme },
    } = useStoreConfigCtx();

    const muiVariant: MuiButtonProps["variant"] = (() => {
      switch (variant) {
        case "outline":
          return "outlined";
        case "ghost":
        case "link":
          return "text";
        default:
          return "contained";
      }
    })();

    const sizeMap: Record<string, MuiButtonProps["size"]> = {
      sm: "small",
      default: "medium",
      lg: "large",
      icon: "medium",
    };

    const variantSx: object = (() => {
      const base = {
        textTransform: "none",
        fontWeight: 500,
        letterSpacing: "0.01em",
        borderRadius: "8px",
        transition: "all 0.2s ease",
        boxShadow: "none",
        "&:hover": { boxShadow: "none" },
      };

      switch (variant) {
        case "secondary":
          return {
            ...base,
            backgroundColor: theme.secondary,
            color: theme.text,
            "&:hover": {
              ...base["&:hover"],
              backgroundColor: theme.secondary,
              filter: "brightness(0.93)",
            },
          };
        case "destructive":
        case "danger":
          return {
            ...base,
            backgroundColor: theme.error,
            color: theme.textInverse,
            "&:hover": {
              ...base["&:hover"],
              backgroundColor: theme.error,
              filter: "brightness(0.88)",
            },
          };
        case "outline":
          return {
            ...base,
            borderColor: theme.border,
            color: theme.text,
            backgroundColor: "transparent",
            "&:hover": {
              ...base["&:hover"],
              backgroundColor: `${theme.primary}10`,
              borderColor: theme.primary,
            },
          };
        case "ghost":
          return {
            ...base,
            color: theme.text,
            backgroundColor: "transparent",
            "&:hover": {
              ...base["&:hover"],
              backgroundColor: `${theme.primary}12`,
            },
          };
        case "link":
          return {
            ...base,
            color: theme.link,
            backgroundColor: "transparent",
            padding: 0,
            minWidth: "unset",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            "&:hover": {
              ...base["&:hover"],
              backgroundColor: "transparent",
              opacity: 0.75,
            },
          };
        default:
          return {
            ...base,
            backgroundColor: theme.primary,
            color: theme.textInverse,
            "&:hover": {
              ...base["&:hover"],
              backgroundColor: theme.primary,
              filter: "brightness(0.88)",
            },
          };
      }
    })();

    return (
      <MaterialUIButton
        ref={ref}
        variant={muiVariant}
        size={sizeMap[size]}
        disableElevation
        sx={{ ...variantSx, ...sx }}
        {...props}
      >
        {children}
      </MaterialUIButton>
    );
  }
);

Button.displayName = "Button";

export { Button };