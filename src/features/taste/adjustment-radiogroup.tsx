"use client";

import { ChoiceChipRadio, ChoiceChipRadioGroup } from "@/components/design-system/choice-chip";
import type { AdjustmentPreference } from "@/domain/profile/types";
import { tasteStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

const OPTIONS = [
  "veryLike",
  "like",
  "auto",
  "less",
  "exclude",
] as const satisfies readonly AdjustmentPreference[];

type AdjustmentRadiogroupProps = Readonly<{
  factorId: string;
  factorLabel: string;
  value: AdjustmentPreference;
  onChange: (value: AdjustmentPreference) => void;
}>;

export function AdjustmentRadiogroup({
  factorId,
  factorLabel,
  value,
  onChange,
}: AdjustmentRadiogroupProps) {
  return (
    <ChoiceChipRadioGroup
      aria-label={tasteStrings.adjustmentGroupLabel(factorLabel)}
      className="taste-adjustment-group flex w-full flex-nowrap items-stretch justify-between gap-[var(--space-content-tight)] overflow-x-auto overscroll-x-contain bg-transparent p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      name={`taste-adjustment-${factorId}`}
      onValueChange={onChange}
      value={value}
    >
      {OPTIONS.map((option) => (
        <ChoiceChipRadio
          chipClassName={cn(
            "h-full min-h-[var(--control-min-size)] gap-[var(--space-content-tight)] whitespace-nowrap rounded-none border-0 bg-transparent px-[var(--space-content-tight)] py-0 text-[length:var(--font-size-12)] font-medium leading-none text-text-muted",
            "peer-data-checked:border-transparent peer-data-checked:bg-transparent peer-data-checked:font-bold peer-data-checked:text-text-strong",
            "[@media(hover:hover)_and_(pointer:fine)]:group-hover/choice:border-transparent [@media(hover:hover)_and_(pointer:fine)]:group-hover/choice:bg-transparent [@media(hover:hover)_and_(pointer:fine)]:group-hover/choice:text-text",
            option === "exclude" && "peer-data-checked:text-warn",
          )}
          className={cn(
            "taste-adjustment-option min-h-[var(--control-min-size)] min-w-max",
            option === "exclude" &&
              "ml-[var(--space-content-tight)] border-l border-line pl-[var(--space-content)]",
          )}
          key={option}
          value={option}
        >
          <span
            aria-hidden="true"
            className={cn(
              "taste-adjustment-option__marker grid size-4 shrink-0 place-items-center rounded-full border bg-surface-1",
              option === value
                ? option === "exclude"
                  ? "border-warn"
                  : "border-accent"
                : "border-line",
            )}
          >
            <span
              className={cn(
                "taste-adjustment-option__marker-dot size-2 rounded-full",
                option === value
                  ? option === "exclude"
                    ? "bg-warn"
                    : "bg-accent"
                  : "bg-transparent",
              )}
            />
          </span>
          <span>{tasteStrings.adjustmentLabels[option]}</span>
        </ChoiceChipRadio>
      ))}
    </ChoiceChipRadioGroup>
  );
}
