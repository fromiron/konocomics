"use client";

import { ChoiceChipRadio, ChoiceChipRadioGroup } from "@/components/design-system/choice-chip";
import type { AdjustmentPreference } from "@/domain/profile/types";
import { tasteStrings } from "@/lib/strings";

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
      className="taste-adjustment-group grid grid-cols-[repeat(5,minmax(max-content,1fr))] gap-[var(--space-content)] overflow-x-auto overscroll-x-contain p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      name={`taste-adjustment-${factorId}`}
      onValueChange={onChange}
      value={value}
    >
      {OPTIONS.map((option) => (
        <ChoiceChipRadio
          chipClassName="w-full rounded-[var(--radius-control)] px-[var(--space-3)] py-2 text-[length:var(--text-caption-size)]"
          className="taste-adjustment-chip min-w-[var(--control-min-size)]"
          key={option}
          value={option}
          variant={option === "exclude" ? "danger" : "default"}
        >
          {tasteStrings.adjustmentLabels[option]}
        </ChoiceChipRadio>
      ))}
    </ChoiceChipRadioGroup>
  );
}
