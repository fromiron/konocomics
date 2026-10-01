"use client";

import type { ReactNode } from "react";

import { Button } from "./button";
import { ChoiceChipRadio, ChoiceChipRadioGroup } from "./choice-chip";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { SpringSelectionGroup, SpringSelectionIndicator } from "./spring-selection";
import { cn } from "@/lib/utils";

type SegmentOption<Value extends string> = Readonly<{
  value: Value;
  label: ReactNode;
  accessibleLabel?: string;
  id?: string;
  controls?: string;
  tone?: "accent" | "neutral" | "warning";
}>;

type SegmentedControlProps<Value extends string> = Readonly<{
  label: string;
  options: readonly SegmentOption<Value>[];
  value: Value | null;
  /** Selection intent; the caller owns persistence and optional re-tap clearing. */
  onSelect(value: Value): void;
  semantics?: "toggle" | "tabs" | "radio";
  name?: string;
  className?: string;
}>;

/** Sample anatomy: one padded track, equal flexible segments, one filled spring indicator. */
export function SegmentedControl<Value extends string>({
  label,
  options,
  value,
  onSelect,
  semantics = "toggle",
  name,
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
      {semantics === "radio" ? (
        <ChoiceChipRadioGroup
          aria-label={label}
          className={cn("segmented-control segmented-control--radio", className)}
          data-selection-tone={options.find((option) => option.value === value)?.tone ?? "accent"}
          name={name}
          onValueChange={(next) => {
            const option = options.find((entry) => entry.value === next);
            if (option) onSelect(option.value);
          }}
          value={value}
        >
          {options.map((option) => (
            <ChoiceChipRadio
              aria-label={option.accessibleLabel}
              chipClassName={cn(
                "relative isolate h-full w-full gap-0 border-0 bg-transparent px-[var(--space-2)] py-0 text-[length:var(--font-size-12)] font-medium leading-none text-text-muted",
                "peer-data-checked:border-transparent peer-data-checked:bg-transparent peer-data-checked:font-bold peer-data-checked:text-on-accent [@media(hover:hover)_and_(pointer:fine)]:group-hover/choice:bg-transparent",
                option.tone === "neutral" && "peer-data-checked:text-text-strong",
                option.tone === "warning" && "peer-data-checked:text-warn",
              )}
              className="segmented-control__option"
              id={option.id}
              key={option.value}
              value={option.value}
            >
              {content(option)}
            </ChoiceChipRadio>
          ))}
        </ChoiceChipRadioGroup>
      ) : semantics === "tabs" ? (
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
