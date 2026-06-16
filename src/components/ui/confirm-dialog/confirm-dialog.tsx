import * as React from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";

export interface ConfirmDialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default" | "accent";
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ConfirmDialog = React.forwardRef<HTMLDivElement, ConfirmDialogProps>(
  (
    {
      className,
      title,
      description,
      confirmLabel = "Confirm",
      cancelLabel = "Cancel",
      variant = "destructive",
      onConfirm,
      onCancel,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "w-full max-w-[480px] rounded-firm border border-firm-border bg-white p-6 shadow-md",
        className,
      )}
      {...props}
    >
      <h2 className="font-heading text-[22px] font-bold leading-tight text-firm-navy">
        {title}
      </h2>
      <p className="mt-4 font-sans text-base text-firm-foreground">{description}</p>
      <div className="mt-6 flex items-center justify-end gap-3">
        <Button variant="outline" size="default" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={variant} size="default" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  ),
);
ConfirmDialog.displayName = "ConfirmDialog";
