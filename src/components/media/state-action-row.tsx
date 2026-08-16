import type { KeyboardEvent } from "react";

import { Button } from "@/components/design-system/button";
import { recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type StateActionRowProps = Readonly<{
  busy: boolean;
  planned: boolean;
  compact?: boolean;
  className?: string;
  onPlanned: () => void;
  onCompleted: () => void;
  onHidden: () => void;
  onRemovalIntent?: () => void;
}>;

export function StateActionRow({
  busy,
  className,
  compact = false,
  onCompleted,
  onHidden,
  onPlanned,
  onRemovalIntent,
  planned,
}: StateActionRowProps) {
  const prepareKeyboardRemoval = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!busy && (event.key === "Enter" || event.key === " ")) onRemovalIntent?.();
  };
  const compactButton = compact
    ? "!h-auto min-h-[var(--control-min-size)] !rounded-none border-0 px-[var(--space-content-tight)] py-[var(--space-content-tight)] text-[length:var(--font-size-12)] leading-tight font-bold whitespace-normal"
    : "min-h-[var(--control-min-size)]";
  const secondaryButton = compact
    ? `${compactButton} border-l border-line bg-surface-1`
    : compactButton;

  return (
    <div
      className={cn(
        compact
          ? "grid grid-cols-3 border-t border-line"
          : "grid grid-cols-3 gap-[var(--space-content)]",
        className,
      )}
    >
      <Button
        aria-pressed={planned}
        className={compact ? `${compactButton} bg-accent text-on-accent` : compactButton}
        busy={busy}
        onClick={onPlanned}
        type="button"
      >
        <span>{recommendationStrings.actions.planned}</span>
        {compact && planned ? (
          <span
            aria-hidden="true"
            className="text-[length:var(--font-size-12)] font-normal whitespace-nowrap"
          >
            {recommendationStrings.actions.plannedConfirmation}
          </span>
        ) : null}
      </Button>
      <Button
        className={secondaryButton}
        data-recommendation-action="completed"
        busy={busy}
        onClick={() => {
          onRemovalIntent?.();
          onCompleted();
        }}
        onKeyDown={prepareKeyboardRemoval}
        onPointerDown={busy ? undefined : onRemovalIntent}
        type="button"
        variant="outline"
      >
        {recommendationStrings.actions.completed}
      </Button>
      <Button
        className={secondaryButton}
        data-recommendation-action="hidden"
        busy={busy}
        onClick={() => {
          onRemovalIntent?.();
          onHidden();
        }}
        onKeyDown={prepareKeyboardRemoval}
        onPointerDown={busy ? undefined : onRemovalIntent}
        type="button"
        variant="outline"
      >
        {recommendationStrings.actions.hidden}
      </Button>
    </div>
  );
}
