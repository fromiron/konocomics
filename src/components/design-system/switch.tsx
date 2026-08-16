import type { ComponentProps } from "react";

import { Switch as PrimitiveSwitch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type SwitchProps = ComponentProps<typeof PrimitiveSwitch> & {
  busy?: boolean;
};

export function Switch({
  "aria-busy": ariaBusy,
  busy = false,
  className,
  disabled,
  ...props
}: SwitchProps) {
  return (
    <PrimitiveSwitch
      aria-busy={busy || ariaBusy || undefined}
      className={cn(
        "transition-opacity duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] after:inset-auto after:top-1/2 after:left-1/2 after:size-[var(--control-min-size)] after:-translate-x-1/2 after:-translate-y-1/2 focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-45 data-disabled:cursor-not-allowed data-disabled:opacity-45 active:scale-[0.97] active:duration-[var(--motion-duration-press)] motion-reduce:transition-none motion-reduce:active:scale-100 [&>[data-slot=switch-thumb]]:duration-[var(--motion-duration-feedback)] [&>[data-slot=switch-thumb]]:ease-[var(--motion-ease-direct)] motion-reduce:[&>[data-slot=switch-thumb]]:transition-none",
        className,
      )}
      disabled={disabled || busy}
      {...props}
    />
  );
}
