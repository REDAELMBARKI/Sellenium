import * as React from "react"
import { cn } from "@/lib/utils"

const variantClasses = {
  default:
    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",

  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",

  destructive:
    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",

  outline: "text-foreground border border-border",

  // NEW BADGE VARIANTS
  success:
    "border-transparent bg-green-500 text-white hover:bg-green-500/80",

  warning:
    "border-transparent bg-yellow-500 text-black hover:bg-yellow-500/80",

  danger:
    "border-transparent bg-red-500 text-white hover:bg-red-500/80",

  info:
    "border-transparent bg-blue-500 text-white hover:bg-blue-500/80",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantClasses
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

  return (
    <div
      className={cn(base, variantClasses[variant], className)}
      {...props}
    />
  )
}
