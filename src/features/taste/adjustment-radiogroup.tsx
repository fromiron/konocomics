"use client";

import { SegmentedControl } from "@/components/design-system/segmented-control";
import type { AdjustmentPreference } from "@/domain/profile/types";
import { tasteStrings } from "@/lib/strings";

const OPTIONS = [
  { value: "veryLike", tone: "accent" },
  { value: "like", tone: "accent" },
  { value: "auto", tone: "neutral" },
  { value: "less", tone: "neutral" },
  { value: "exclude", tone: "warning" },
] as const;

export function AdjustmentRadiogroup({
  factorId,
  factorLabel,
  value,
  onChange,
}: Readonly<{
  factorId: string;
  factorLabel: string;
  value: AdjustmentPreference;
  onChange: (value: AdjustmentPreference) => void;
}>) {
  return (
    <SegmentedControl
      className="taste-adjustment-group"
      label={tasteStrings.adjustmentGroupLabel(factorLabel)}
      name={`taste-adjustment-${factorId}`}
      onSelect={onChange}
      options={OPTIONS.map((option) => ({
        ...option,
        label: tasteStrings.adjustmentLabels[option.value],
      }))}
      semantics="radio"
      value={value}
    />
  );
}
