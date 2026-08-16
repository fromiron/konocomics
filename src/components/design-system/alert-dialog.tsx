import type { ComponentProps } from "react";

import {
  AlertDialog as PrimitiveAlertDialog,
  AlertDialogAction as PrimitiveAlertDialogAction,
  AlertDialogCancel as PrimitiveAlertDialogCancel,
  AlertDialogContent as PrimitiveAlertDialogContent,
  AlertDialogDescription as PrimitiveAlertDialogDescription,
  AlertDialogFooter as PrimitiveAlertDialogFooter,
  AlertDialogHeader as PrimitiveAlertDialogHeader,
  AlertDialogTitle as PrimitiveAlertDialogTitle,
  AlertDialogTrigger as PrimitiveAlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export const AlertDialog = PrimitiveAlertDialog;

export function AlertDialogTrigger({
  className,
  ...props
}: ComponentProps<typeof PrimitiveAlertDialogTrigger>) {
  return (
    <PrimitiveAlertDialogTrigger
      className={cn(
        "touch-target min-h-[var(--control-min-size)] min-w-[var(--control-min-size)]",
        className,
      )}
      {...props}
    />
  );
}

export function AlertDialogContent({
  className,
  ...props
}: ComponentProps<typeof PrimitiveAlertDialogContent>) {
  return (
    <PrimitiveAlertDialogContent
      className={cn(
        "rounded-[var(--radius-card)] border border-line bg-surface-1 text-text shadow-[var(--shadow-raised)] ring-0 !transition-none !animate-none",
        className,
      )}
      {...props}
    />
  );
}

export function AlertDialogHeader({
  className,
  ...props
}: ComponentProps<typeof PrimitiveAlertDialogHeader>) {
  return (
    <PrimitiveAlertDialogHeader
      className={cn("gap-[var(--space-content)]", className)}
      {...props}
    />
  );
}

export function AlertDialogFooter({
  className,
  ...props
}: ComponentProps<typeof PrimitiveAlertDialogFooter>) {
  return (
    <PrimitiveAlertDialogFooter className={cn("border-line bg-surface-2", className)} {...props} />
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: ComponentProps<typeof PrimitiveAlertDialogTitle>) {
  return <PrimitiveAlertDialogTitle className={cn("text-text-strong", className)} {...props} />;
}

export function AlertDialogDescription({
  className,
  ...props
}: ComponentProps<typeof PrimitiveAlertDialogDescription>) {
  return (
    <PrimitiveAlertDialogDescription className={cn("text-text-muted", className)} {...props} />
  );
}

export function AlertDialogAction({
  "aria-busy": ariaBusy,
  busy = false,
  className,
  disabled,
  ...props
}: ComponentProps<typeof PrimitiveAlertDialogAction> & { busy?: boolean }) {
  return (
    <PrimitiveAlertDialogAction
      aria-busy={busy || ariaBusy || undefined}
      className={cn(
        "touch-target interactive-press min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] transition-[opacity,transform] duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-45 active:not-aria-[haspopup]:translate-y-0 active:scale-[0.97] active:bg-accent-active active:duration-[var(--motion-duration-press)] motion-reduce:active:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent-hover",
        className,
      )}
      disabled={disabled || busy}
      {...props}
    />
  );
}

export function AlertDialogCancel({
  className,
  ...props
}: ComponentProps<typeof PrimitiveAlertDialogCancel>) {
  return (
    <PrimitiveAlertDialogCancel
      className={cn(
        "touch-target interactive-press min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] transition-[opacity,transform] duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] focus-visible:border-line focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-45 active:not-aria-[haspopup]:translate-y-0 active:scale-[0.97] active:duration-[var(--motion-duration-press)] motion-reduce:active:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-3",
        className,
      )}
      {...props}
    />
  );
}
