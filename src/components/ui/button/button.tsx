import * as React from "react";
import { cn } from "../../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "accent" | "destructive" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

const variantClasses = {
  default:
    "bg-firm-navy text-white hover:bg-firm-navy-light hover:shadow-firm-navy",
  accent:
    "bg-firm-lime text-firm-navy-dark hover:bg-firm-lime-light hover:shadow-firm-lime",
  destructive:
    "bg-firm-destructive text-white hover:bg-firm-destructive-dark",
  outline:
    "border border-[var(--input-border)] bg-firm-muted text-firm-foreground hover:bg-[#e8e8e8]",
  ghost: "text-firm-foreground hover:bg-gray-100",
} as const;

const sizeClasses = {
  sm: "h-8 px-3 text-[13px]",
  default: "h-10 px-8 text-sm",
  lg: "h-11 px-8 text-base",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-firm-sm font-semibold font-sans",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-firm-lime focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.98]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
