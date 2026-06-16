import * as React from "react";
import { cn } from "../../../lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  selected?: boolean;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, icon, selected = false, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-firm px-3 py-1.5 text-[13px] font-normal",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-firm-lime focus-visible:ring-offset-1",
        "disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "bg-firm-navy text-white"
          : "bg-gray-100 text-firm-muted-foreground hover:bg-gray-200",
        className,
      )}
      {...props}
    >
      {icon && <span className="flex size-4 shrink-0 items-center justify-center">{icon}</span>}
      {children}
    </button>
  ),
);
Chip.displayName = "Chip";

export { Chip };
