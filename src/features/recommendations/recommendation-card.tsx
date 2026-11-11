import { ScanSearchIcon } from "lucide-react";

import { ConfidenceLabel, KnownPublicationMeta } from "@/components/media/recommendation-evidence";
import { StageCard } from "@/components/media/stage-card";
import {
  CoverSaveToggle,
  QuietTextAction,
  RecommendationFeedbackActions,
} from "@/components/media/state-action-row";
import type { Work } from "@/domain/catalog/types";
import { generateTasteExplanation } from "@/domain/explanation/generate";
import type { TasteExplanationSentence } from "@/domain/explanation/types";
import type { TasteRecommendationExplanation } from "@/domain/explanation/types";
import type { RecommendationPlanEntry } from "@/domain/recommendation/types";
import { explanationLexicon, recommendationStrings } from "@/lib/strings";

type RecommendationCardProps = Readonly<{
  entry: RecommendationPlanEntry;
  explanation?: TasteRecommendationExplanation;
  work: Work;
  volumeCount: number;
  resolveTitle: (workId: string) => string | undefined;
  planned: boolean;
  busy: boolean;
  priority: boolean;
  coverUrl?: string | null;
  /** Absent on carousel clones, which never register as the canonical card. */
  articleRef?: (element: HTMLElement | null) => void;
  onPlanned: () => void;
  onCompleted: () => void;
  onHidden: () => void;
  onRemovalIntent: () => void;
  onDismissForToday?: () => void;
  onPreview?: () => void;
  onCoverVisible?: () => void;
}>;

function serializeContributionSummary(sentence: TasteExplanationSentence) {
  return JSON.stringify({
    text: sentence.text,
    source: sentence.source,
    group: sentence.group,
    factorId: sentence.factorId,
    value: sentence.value,
    anchorWorkIds: sentence.anchorWorkIds,
    ...(sentence.axisPreferenceDirection === undefined
      ? {}
      : { axisPreferenceDirection: sentence.axisPreferenceDirection }),
    ...(sentence.negativeReasonId === undefined
      ? {}
      : { negativeReasonId: sentence.negativeReasonId }),
  });
}

function explanationFor(
  entry: RecommendationPlanEntry,
  resolveTitle: (workId: string) => string | undefined,
) {
  return generateTasteExplanation({
    contributions: entry.contributions,
    confidenceLevel: entry.confidenceLevel,
    lexicon: explanationLexicon,
    resolveTitle,
  });
}

export function RecommendationCard({
  articleRef,
  busy,
  coverUrl,
  entry,
  explanation: suppliedExplanation,
  onCompleted,
  onCoverVisible,
  onDismissForToday,
  onHidden,
  onPlanned,
  onPreview,
  onRemovalIntent,
  planned,
  priority,
  resolveTitle,
  volumeCount,
  work,
}: RecommendationCardProps) {
  const explanation = suppliedExplanation ?? explanationFor(entry, resolveTitle);
  const leadReason = explanation.positiveReasons[0];

  return (
    <StageCard
      actions={
        <>
          {onPreview === undefined ? null : (
            <QuietTextAction
              aria-label={recommendationStrings.quickPreview.open(work.title)}
              className="pointer-events-auto size-[var(--control-min-size)] shrink-0 justify-center px-0"
              onClick={onPreview}
              surface="cover"
            >
              <ScanSearchIcon aria-hidden="true" className="size-4" />
            </QuietTextAction>
          )}
          <CoverSaveToggle
            busy={busy}
            className="pointer-events-auto"
            onPlanned={onPlanned}
            planned={planned}
          />
          <RecommendationFeedbackActions
            busy={busy}
            className="pointer-events-auto ml-auto shrink-0"
            dismissForTodayLabel={recommendationStrings.mood.dismissLabel(work.title)}
            onCompleted={onCompleted}
            onDismissForToday={onDismissForToday}
            onHidden={onHidden}
            onRemovalIntent={onRemovalIntent}
            surface="cover"
          />
        </>
      }
      articleData={{ "data-personalized-recommendation-card": work.id }}
      articleRef={articleRef}
      backdropData={{ "data-recommendation-card-backdrop": true }}
      coverLinkData={{ "data-recommendation-select": true }}
      coverLinkLabel={recommendationStrings.openDetails(work.title)}
      coverUrl={coverUrl}
      creators={work.creators}
      meta={
        <>
          <KnownPublicationMeta
            className="min-w-0 truncate"
            status={work.status}
            volumeCount={volumeCount}
          />
          <ConfidenceLabel
            className="shrink-0"
            label={explanation.confidence.label}
            prefix={recommendationStrings.confidenceHeading}
          />
        </>
      }
      onCoverVisible={onCoverVisible}
      priority={priority}
      reason={leadReason?.text ?? recommendationStrings.reasonUnavailable}
      reasonData={{
        "data-contribution-summary":
          leadReason === undefined ? undefined : serializeContributionSummary(leadReason),
        "data-recommendation-evidence-summary": leadReason === undefined ? undefined : true,
      }}
      scrimData={{ "data-recommendation-card-scrim": true }}
      title={work.title}
      workId={work.id}
    />
  );
}
