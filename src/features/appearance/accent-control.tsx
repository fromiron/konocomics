"use client";

import { AccentSelector } from "@/components/design-system/accent-selector";
import { setAccentPreference, useAccentPreference } from "@/infrastructure/display-preferences";

/** The accent selector wired to this browser's stored display preference (03 §0). */
export function AccentControl({
  className,
  side,
}: Readonly<{ className?: string; side?: "top" | "bottom" }>) {
  const accent = useAccentPreference();
  return (
    <AccentSelector
      className={className}
      onValueChange={setAccentPreference}
      side={side}
      value={accent}
    />
  );
}
