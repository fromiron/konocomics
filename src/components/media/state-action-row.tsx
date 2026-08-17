import { BookmarkIcon, CircleCheckIcon, CircleXIcon } from "lucide-react";
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
    ? "!h-auto min-h-[var(--control-min-size)] !rounded-none border-0 px-[var(--space-1)] py-[var(--space-content-tight)] text-[length:var(--font-size-12)] leading-tight font-bold whitespace-nowrap"
    : "min-h-[var(--control-min-size)]";
  const secondaryButton = compact
    ? `${compactButton} border-l border-line bg-surface-1`
    : compactButton;
  const iconClassName = compact ? "size-3.5 shrink-0" : "size-4 shrink-0";

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
        aria-label={
          compact
            ? planned
              ? `${recommendationStrings.actions.planned}、${recommendationStrings.actions.plannedConfirmation}`
              : recommendationStrings.actions.planned
            : undefined
        }
        aria-pressed={planned}
        className={compact ? `${compactButton} bg-accent text-on-accent` : compactButton}
        busy={busy}
        onClick={onPlanned}
        type="button"
      >
        <BookmarkIcon aria-hidden="true" className={cn(iconClassName, planned && "fill-current")} />
        <span
          className={
            compact
              ? "hidden text-[length:var(--font-size-12)] leading-tight whitespace-nowrap [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:inline"
              : undefined
          }
          data-expandable-reveal={compact || undefined}
        >
          {compact && planned
            ? recommendationStrings.actions.plannedConfirmation
            : recommendationStrings.actions.planned}
        </span>
      </Button>
      <Button
        aria-label={compact ? recommendationStrings.actions.completed : undefined}
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
        <CircleCheckIcon aria-hidden="true" className={iconClassName} />
        <span
          className={
            compact
              ? "hidden text-[length:var(--font-size-12)] leading-tight whitespace-nowrap [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:inline"
              : undefined
          }
          data-expandable-reveal={compact || undefined}
        >
          {recommendationStrings.actions.completed}
        </span>
      </Button>
      <Button
        aria-label={compact ? recommendationStrings.actions.hidden : undefined}
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
        <CircleXIcon aria-hidden="true" className={iconClassName} />
        <span
          className={
            compact
              ? "hidden text-[length:var(--font-size-12)] leading-tight whitespace-nowrap [@media(min-width:768px)_and_(hover:hover)_and_(pointer:fine)]:group-data-[expanded]/card:inline"
              : undefined
          }
          data-expandable-reveal={compact || undefined}
        >
          {recommendationStrings.actions.hidden}
        </span>
      </Button>
    </div>
  );
}
