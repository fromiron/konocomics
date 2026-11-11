"use client";

import { CheckIcon } from "lucide-react";
import { useId, useRef } from "react";

import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type AccentThemeId, accentThemeIds } from "@/lib/accent-theme";
import { accentStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type AccentSelectorProps = Readonly<{
  value: AccentThemeId;
  onValueChange(value: AccentThemeId): void;
  /** Where the popover opens: below a header, above a bottom tab bar. */
  side?: "top" | "bottom";
  className?: string;
}>;

function isAccentThemeId(value: unknown): value is AccentThemeId {
  return accentThemeIds.some((id) => id === value);
}

/**
 * The accent selector (03 §0 「accent 선택」): an icon-only trigger showing the current accent,
 * and a popover with the six accents as a radiogroup. A choice applies at once and the popover
 * stays open so several can be tried; Esc or an outside press closes it and returns focus to the
 * trigger (a press on another control keeps that control's focus). Each swatch takes its colour
 * from its own theme block.
 */
export function AccentSelector({
  className,
  onValueChange,
  side = "bottom",
  value,
}: AccentSelectorProps) {
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Base UI returns focus to the trigger on Esc. An outside press on empty space moves focus to
  // the page's tabindex=-1 content region (or the body), which Base UI treats as focus moving on,
  // so the trigger takes it back once the popover has closed. A press on another control keeps
  // that control's focus.
  const restoreFocus = (open: boolean) => {
    if (open) return;
    const active = document.activeElement;
    if (
      active === null ||
      active === document.body ||
      (active instanceof HTMLElement && active.tabIndex < 0)
    ) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  };
  return (
    <Popover onOpenChangeComplete={restoreFocus}>
      <PopoverTrigger
        aria-label={accentStrings.trigger(accentStrings.names[value])}
        className={cn(
          "accent-selector touch-target grid size-[var(--control-min-size)] shrink-0 place-items-center rounded-full bg-transparent transition-transform duration-[var(--motion-duration-press)] ease-[var(--motion-ease-direct)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.97] motion-reduce:active:scale-100 data-[popup-open]:bg-surface-2 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-2",
          className,
        )}
        data-accent-selector=""
        ref={triggerRef}
      >
        <span
          aria-hidden="true"
          className="accent-selector__trigger-swatch block rounded-full bg-accent ring-1 ring-line"
        />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="accent-selector__popup w-[calc(var(--control-min-size)*5)] max-w-[calc(100vw-var(--layout-page-padding)*2)] gap-0 rounded-[var(--radius-card)] bg-surface-2 p-[var(--space-1)] text-text shadow-[var(--shadow-raised)] ring-0 !animate-none"
        data-reduced-motion="fade"
        side={side}
        sideOffset={8}
      >
        <PopoverTitle
          className="px-[var(--space-3)] pt-[var(--space-2)] pb-[var(--space-1)] text-[length:var(--text-caption-size)] font-bold text-text-muted"
          id={titleId}
        >
          {accentStrings.title}
        </PopoverTitle>
        <RadioGroup
          aria-labelledby={titleId}
          className="gap-0"
          onValueChange={(next) => {
            if (isAccentThemeId(next)) onValueChange(next);
          }}
          value={value}
        >
          {accentThemeIds.map((id) => {
            const selected = id === value;
            return (
              <label
                className="accent-selector__option relative flex min-h-[var(--control-min-size)] cursor-pointer items-center gap-[var(--space-3)] px-[var(--space-3)] text-[length:var(--font-size-14)] text-text-strong has-[[data-slot=radio-group-item]:focus-visible]:outline-2 has-[[data-slot=radio-group-item]:focus-visible]:-outline-offset-2 has-[[data-slot=radio-group-item]:focus-visible]:outline-ring [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-3"
                key={id}
              >
                <RadioGroupItem className="peer sr-only absolute size-px" value={id} />
                {/* The swatch selects its own theme block, so it shows that accent's colour. */}
                <span
                  aria-hidden="true"
                  className="accent-selector__swatch shrink-0 rounded-full bg-accent ring-1 ring-line"
                  data-accent={id}
                />
                <span className={cn("min-w-0 flex-1", selected && "font-bold")}>
                  {accentStrings.names[id]}
                </span>
                <CheckIcon
                  aria-hidden="true"
                  className={cn("size-4 shrink-0", selected ? "opacity-100" : "opacity-0")}
                />
              </label>
            );
          })}
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
}
