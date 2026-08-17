import type { ComponentProps } from "react";

import { Button as PrimitiveButton, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ButtonProps = ComponentProps<typeof PrimitiveButton> & {
  busy?: boolean;
};

export function buttonClassName({
  className,
  variant = "default",
}: Readonly<{ className?: string; variant?: ButtonProps["variant"] }> = {}) {
  return cn(
    buttonVariants({ variant }),
    "touch-target interactive-press min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] rounded-[var(--radius-control)] transition-[opacity,transform] duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-45 aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent active:not-aria-[haspopup]:translate-y-0 active:scale-[0.97] active:duration-[var(--motion-duration-press)] motion-reduce:active:scale-100",
    variant === "outline" ? "focus-visible:border-line" : "focus-visible:border-transparent",
    variant === "default" &&
      "active:bg-accent-active [@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent-hover",
    (variant === "outline" || variant === "ghost") &&
      "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-3",
    className,
  );
}

export function Button({
  "aria-busy": ariaBusy,
  busy = false,
  className,
  disabled,
  variant = "default",
  ...props
}: ButtonProps) {
  return (
    <PrimitiveButton
      aria-busy={busy || ariaBusy || undefined}
      className={
        typeof className === "function"
          ? (state) => buttonClassName({ className: className(state), variant })
          : buttonClassName({ className, variant })
      }
      disabled={disabled || busy}
      variant={variant}
      {...props}
    />
  );
}
