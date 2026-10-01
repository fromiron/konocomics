"use client";

import type { ReactNode } from "react";

import { Button } from "./button";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { SpringSelectionGroup, SpringSelectionIndicator } from "./spring-selection";
import { cn } from "@/lib/utils";

type SegmentOption<Value extends string> = Readonly<{
  value: Value;
  label: ReactNode;
  accessibleLabel?: string;
  id?: string;
  controls?: string;
}>;

type SegmentedControlProps<Value extends string> = Readonly<{
  label: string;
  options: readonly SegmentOption<Value>[];
  value: Value | null;
  /** Selection intent; the caller owns persistence and optional re-tap clearing. */
  onSelect(value: Value): void;
  semantics?: "toggle" | "tabs";
  className?: string;
}>;

/** Sample anatomy: one padded track, equal flexible segments, one filled spring indicator. */
export function SegmentedControl<Value extends string>({
  label,
  options,
  value,
  onSelect,
  semantics = "toggle",
  className,
}: SegmentedControlProps<Value>) {
  const content = (option: SegmentOption<Value>) => (
    <>
      {option.value === value ? <SpringSelectionIndicator slot="segmented-indicator" /> : null}
      {option.label}
    </>
  );

  return (
    <SpringSelectionGroup>
      {semantics === "tabs" ? (
        <Tabs
          value={value}
          onValueChange={(next) => {
            const option = options.find((entry) => entry.value === next);
            if (option) onSelect(option.value);
          }}
        >
          <TabsList aria-label={label} className={cn("segmented-control", className)}>
            {options.map((option) => (
              <TabsTrigger
                aria-controls={option.controls}
                aria-label={option.accessibleLabel}
                className="segmented-control__option"
                id={option.id}
                key={option.value}
                value={option.value}
              >
                {content(option)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ) : (
        <div aria-label={label} className={cn("segmented-control", className)} role="group">
          {options.map((option) => (
            <Button
              aria-label={option.accessibleLabel}
              aria-pressed={option.value === value}
              className="segmented-control__option"
              id={option.id}
              key={option.value}
              onClick={() => onSelect(option.value)}
              type="button"
              variant="ghost"
            >
              {content(option)}
            </Button>
          ))}
        </div>
      )}
    </SpringSelectionGroup>
  );
}
