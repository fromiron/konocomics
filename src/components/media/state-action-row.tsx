import { BookmarkIcon } from "lucide-react";
import type { ComponentPropsWithoutRef, KeyboardEvent } from "react";

import { Button } from "@/components/design-system/button";
import { recommendationStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

type RemovalActionProps = Readonly<{
  busy: boolean;
  className?: string;
  onCompleted: () => void;
  onHidden: () => void;
  onRemovalIntent?: () => void;
  surface?: "page" | "cover";
}>;

type StateActionRowProps = Omit<RemovalActionProps, "surface"> &
  Readonly<{
    planned: boolean;
    onPlanned: () => void;
  }>;

type QuietTextActionProps = ComponentPropsWithoutRef<"button"> &
  Readonly<{
    danger?: boolean;
    surface?: "page" | "cover";
  }>;

function removalHandlersFor({
  busy,
  onRemovalIntent,
}: Pick<RemovalActionProps, "busy" | "onRemovalIntent">) {
  return {
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      if (!busy && (event.key === "Enter" || event.key === " ")) onRemovalIntent?.();
    },
    onPointerDown: busy ? undefined : onRemovalIntent,
  };
}

/**
 * Secondary shelf actions: labelled, always visible, no button chrome.
 * These remove the work from the recommendation shelf, so they must not
 * compete with the primary save affordance.
 */
function QuietTextAction({
  className,
  danger = false,
  surface = "page",
  ...props
}: QuietTextActionProps) {
  const onCover = surface === "cover";

  return (
    <button
      {...props}
      className={cn(
        "quiet-text-action inline-flex min-h-[var(--control-min-size)] min-w-[var(--control-min-size)] items-center px-[var(--space-1)] text-left transition-colors duration-[var(--motion-duration-feedback)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none",
        onCover && "quiet-text-action--cover focus-visible:ring-offset-0",
        !onCover && "focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        danger && "quiet-text-action--danger",
        className,
      )}
      type="button"
    />
  );
}

/**
 * Preview/dialog row: one primary save control, then quiet corrective actions.
 * Not three equal buttons.
 */
export function StateActionRow({
  busy,
  className,
  onCompleted,
  onHidden,
  onPlanned,
  onRemovalIntent,
  planned,
}: StateActionRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[var(--space-2)] sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <Button
        aria-pressed={planned}
        busy={busy}
        className="w-fit justify-self-start aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent"
        onClick={onPlanned}
        type="button"
      >
        <BookmarkIcon aria-hidden="true" className={cn("size-4", planned && "fill-current")} />
        {recommendationStrings.actions.planned}
      </Button>
      <RecommendationFeedbackActions
        busy={busy}
        onCompleted={onCompleted}
        onHidden={onHidden}
        onRemovalIntent={onRemovalIntent}
      />
    </div>
  );
}

/**
 * Save affordance for cover-forward cards. Parent positions it; accent fill
 * appears only once a work is actually saved.
 */
export function CoverSaveToggle({
  busy,
  className,
  onPlanned,
  planned,
}: Readonly<{
  busy: boolean;
  className?: string;
  onPlanned: () => void;
  planned: boolean;
}>) {
  return (
    <button
      aria-busy={busy || undefined}
      aria-label={
        planned
          ? `${recommendationStrings.actions.planned}、${recommendationStrings.actions.plannedConfirmation}`
          : recommendationStrings.actions.planned
      }
      aria-pressed={planned}
      className={cn(
        "cover-save-toggle grid size-[var(--control-min-size)] shrink-0 place-items-center rounded-full transition-colors duration-[var(--motion-duration-feedback)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none",
        className,
      )}
      disabled={busy}
      onClick={onPlanned}
      type="button"
    >
      <BookmarkIcon aria-hidden="true" className={cn("size-5", planned && "fill-current")} />
    </button>
  );
}

/**
 * Corrective feedback for a recommended work: both actions remove the entry
 * from the shelf, so they stay quiet and secondary to the save affordance.
 */
export function RecommendationFeedbackActions({
  busy,
  className,
  onCompleted,
  onHidden,
  onRemovalIntent,
  surface = "page",
}: RemovalActionProps) {
  const removalHandlers = removalHandlersFor({ busy, onRemovalIntent });

  return (
    <div className={cn("flex items-center gap-[var(--space-1)]", className)}>
      <QuietTextAction
        aria-busy={busy || undefined}
        data-recommendation-action="completed"
        disabled={busy}
        onClick={() => {
          onRemovalIntent?.();
          onCompleted();
        }}
        surface={surface}
        {...removalHandlers}
      >
        {recommendationStrings.actions.completed}
      </QuietTextAction>
      <QuietTextAction
        aria-busy={busy || undefined}
        danger
        data-recommendation-action="hidden"
        disabled={busy}
        onClick={() => {
          onRemovalIntent?.();
          onHidden();
        }}
        surface={surface}
        {...removalHandlers}
      >
        {recommendationStrings.actions.hidden}
      </QuietTextAction>
    </div>
  );
}
