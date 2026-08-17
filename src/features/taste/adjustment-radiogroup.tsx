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
      className="taste-adjustment-group grid w-full grid-cols-[repeat(5,minmax(0,1fr))] gap-0 overflow-x-auto overscroll-x-contain rounded-[var(--radius-control)] border border-line bg-surface-1 p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      name={`taste-adjustment-${factorId}`}
      onValueChange={onChange}
      value={value}
    >
      {OPTIONS.map((option) => (
        <ChoiceChipRadio
          chipClassName="h-full w-full whitespace-nowrap rounded-[var(--radius-cover)] border-transparent bg-transparent px-1 py-1 text-[length:var(--font-size-12)] font-medium leading-none"
          className="taste-adjustment-chip min-h-[var(--control-min-size)] min-w-0"
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
