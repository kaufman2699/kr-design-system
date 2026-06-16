import * as React from "react";
import { cn } from "../../../lib/utils";

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, checked, defaultChecked = false, onChange, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isOn = isControlled ? checked : internalChecked;

    const handleClick = () => {
      if (!isControlled) {
        setInternalChecked(!isOn);
      }
      onChange?.(!isOn);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isOn}
        onClick={handleClick}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full p-0.5",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-firm-lime focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isOn ? "bg-firm-navy" : "bg-gray-300",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block size-4 rounded-full bg-white shadow-sm",
            "transition-transform duration-200",
            isOn ? "translate-x-4" : "translate-x-0",
          )}
        />
      </button>
    );
  },
);
Toggle.displayName = "Toggle";

export { Toggle };
