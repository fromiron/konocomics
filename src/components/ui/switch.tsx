"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  thumbRender,
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
  thumbRender?: SwitchPrimitive.Thumb.Props["render"];
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/40 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-checked:bg-primary data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-foreground ring-0 group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-checked:bg-primary-foreground data-unchecked:bg-foreground",
          !thumbRender &&
            "transition-transform data-checked:translate-x-[calc(100%-2px)] data-unchecked:translate-x-0",
        )}
        render={thumbRender}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
