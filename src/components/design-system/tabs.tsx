import type { ComponentProps } from "react";

import {
  Tabs as PrimitiveTabs,
  TabsContent as PrimitiveTabsContent,
  TabsList as PrimitiveTabsList,
  TabsTrigger as PrimitiveTabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Tabs = PrimitiveTabs;

export function TabsList({ className, ...props }: ComponentProps<typeof PrimitiveTabsList>) {
  return (
    <PrimitiveTabsList
      className={cn(
        "min-h-[var(--control-min-size)] bg-surface-2 text-text-muted group-data-[orientation=horizontal]/tabs:h-auto",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof PrimitiveTabsTrigger>) {
  return (
    <PrimitiveTabsTrigger
      className={cn(
        "touch-target min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] rounded-[var(--radius-control)] transition-[opacity,transform] duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] after:duration-[var(--motion-duration-feedback)] after:ease-[var(--motion-ease-direct)] focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-45 aria-disabled:pointer-events-auto aria-disabled:cursor-not-allowed aria-disabled:opacity-45 data-active:border-accent data-active:bg-accent-soft data-active:text-accent data-active:shadow-none active:scale-[0.97] active:duration-[var(--motion-duration-press)] motion-reduce:transition-none motion-reduce:after:transition-none motion-reduce:active:scale-100",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof PrimitiveTabsContent>) {
  return <PrimitiveTabsContent className={cn("text-text", className)} {...props} />;
}
