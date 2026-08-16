"use client";

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
    <div
      aria-label={tasteStrings.adjustmentGroupLabel(factorLabel)}
      className="taste-adjustment-group"
      role="radiogroup"
    >
      {OPTIONS.map((option) => (
        <label className="taste-adjustment-chip" key={option}>
          <input
            checked={value === option}
            name={`taste-adjustment-${factorId}`}
            onChange={() => onChange(option)}
            type="radio"
            value={option}
          />
          <span className={cn(option === "exclude" && "taste-adjustment-chip__label--exclude")}>
            {tasteStrings.adjustmentLabels[option]}
          </span>
        </label>
      ))}
    </div>
  );
}
