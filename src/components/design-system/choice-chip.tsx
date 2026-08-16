"use client";

import type { ReactNode } from "react";

import { Checkbox, type CheckboxProps } from "@/components/ui/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupItemProps,
  type RadioGroupProps,
} from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type ChoiceChipProps = Readonly<{
  children: ReactNode;
  className?: string;
  chipClassName?: string;
  variant?: "default" | "danger";
}>;

const chipClassName =
  "inline-flex min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] items-center justify-center rounded-[var(--radius-pill)] border border-line bg-surface-1 px-[var(--space-content-loose)] py-[var(--space-content)] text-[length:var(--font-size-14)] font-bold peer-data-checked:border-accent peer-data-checked:bg-accent-soft peer-data-checked:text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus-ring)] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-45 [@media(hover:hover)_and_(pointer:fine)]:group-hover/choice:border-accent-hover [@media(hover:hover)_and_(pointer:fine)]:group-hover/choice:bg-surface-3";

export function ChoiceChipRadioGroup<Value>({ className, ...props }: RadioGroupProps<Value>) {
  return (
    <RadioGroup className={cn("flex flex-wrap gap-[var(--space-content)]", className)} {...props} />
  );
}

export function ChoiceChipRadio<Value>({
  children,
  className,
  chipClassName: customChipClassName,
  variant = "default",
  ...props
}: ChoiceChipProps & Omit<RadioGroupItemProps<Value>, "children" | "className">) {
  return (
    <label
      className={cn(
        "group/choice relative inline-flex min-h-[var(--control-min-size)] cursor-pointer items-center has-[[data-disabled]]:cursor-not-allowed",
        className,
      )}
    >
      <RadioGroupItem className="peer sr-only" {...props} />
      <span
        className={cn(
          chipClassName,
          variant === "danger" &&
            "peer-data-checked:border-warn peer-data-checked:bg-surface-danger-soft peer-data-checked:text-warn",
          customChipClassName,
        )}
      >
        {children}
      </span>
    </label>
  );
}

export function ChoiceChipCheckbox({
  children,
  className,
  chipClassName: customChipClassName,
  variant = "default",
  ...props
}: ChoiceChipProps & Omit<CheckboxProps, "children" | "className">) {
  return (
    <label
      className={cn(
        "group/choice relative inline-flex min-h-[var(--control-min-size)] cursor-pointer items-center has-[[data-disabled]]:cursor-not-allowed",
        className,
      )}
    >
      <Checkbox className="peer sr-only" {...props} />
      <span
        className={cn(
          chipClassName,
          variant === "danger" &&
            "peer-data-checked:border-warn peer-data-checked:bg-surface-danger-soft peer-data-checked:text-warn",
          customChipClassName,
        )}
      >
        {children}
      </span>
    </label>
  );
}
