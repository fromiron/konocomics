"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";

import catalogInput from "../../src/data/generated/catalog-v1.json";
import recommendationContextInput from "../../src/data/generated/recommendation-context-v1.json";
import { catalogIdSchema, catalogV1Schema } from "../../src/domain/catalog/schema";
import type { Work } from "../../src/domain/catalog/types";
import {
  createG2Experiment,
  createG2Result,
  serializeG2Result,
  type G2Experiment,
  type G2ListPreference,
  type G2PostResponse,
  type G2PreResponse,
  type G2Respondent,
  type G2SlotId,
} from "../../src/domain/g2";
import type { RecommendationContext } from "../../src/domain/recommendation/types";
import { coreStrings, explanationLexicon, g2HarnessStrings } from "../../src/lib/strings";

const copy = g2HarnessStrings;
const PROFILE_FILE_LIMIT = 1024 * 1024;
const PARTICIPANT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const recommendationContextSchema: z.ZodType<RecommendationContext> = z.strictObject({
  constraintByWorkId: z.record(
    catalogIdSchema,
    z.strictObject({
      workId: catalogIdSchema,
      catalogRole: z.enum(["anchor", "bridge", "discovery"]),
      seriesGroupId: catalogIdSchema.optional(),
      volumeCount: z.number().int().nonnegative(),
    }),
  ),
  marketSnapshot: z.strictObject({
    catalogVersion: z.string().min(1),
    catalogAverageRating: z.number().min(0).max(5),
    byWorkId: z.record(
      catalogIdSchema,
      z.strictObject({
        workId: catalogIdSchema,
        reviewAverage: z.number().min(0).max(5).optional(),
        reviewCount: z.number().int().nonnegative().optional(),
      }),
    ),
  }),
});

const catalog = catalogV1Schema.parse(catalogInput);
const recommendationContext = recommendationContextSchema.parse(recommendationContextInput);
const workById = new Map(catalog.works.map((work) => [work.id, work]));

type Stage = "input" | "before" | "after" | "complete";
type Familiarity = G2PreResponse["familiarity"];
type FivePoint = G2PreResponse["wantToReadBefore"];
type PreDraft = Partial<Omit<G2PreResponse, "workId">>;
type PostDraft = Partial<Pick<G2PostResponse, "wantToReadAfter" | "agreement">>;

type G2WizardProps = {
  respondent: G2Respondent;
};

class ProfileInputError extends Error {}

function isParticipantId(value: string) {
  return value.length >= 1 && value.length <= 64 && PARTICIPANT_ID_PATTERN.test(value);
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function readProfile(file: File): Promise<unknown> {
  if (file.size > PROFILE_FILE_LIMIT) {
    throw new ProfileInputError(copy.errors.profileTooLarge);
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    throw new ProfileInputError(copy.errors.profileEncoding);
  }

  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new ProfileInputError(copy.errors.profileEncoding);
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ProfileInputError(copy.errors.profileJson);
  }
}

function stageIndex(stage: Stage) {
  return { input: 0, before: 1, after: 2, complete: 3 }[stage];
}

function Progress({ stage }: { stage: Stage }) {
  const labels = [
    copy.progress.input,
    copy.progress.before,
    copy.progress.after,
    copy.progress.complete,
  ];
  const current = stageIndex(stage);
  return (
    <ol className="progress" aria-label={copy.progress.label}>
      {labels.map((label, index) => (
        <li
          className={index === current ? "is-current" : index < current ? "is-done" : undefined}
          aria-current={index === current ? "step" : undefined}
          key={label}
        >
          <span aria-hidden="true">{index + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}

function PageHeader({ modeLabel }: { modeLabel: string }) {
  return (
    <header className="site-header">
      <p className="wordmark" aria-label={coreStrings.appName}>
        <span>kono</span>co<span>mi</span>cs
      </p>
      <p className="mode-label">{modeLabel}</p>
    </header>
  );
}

function CoverPlaceholder({ work }: { work: Work }) {
  return (
    <div
      className="cover-placeholder"
      role="img"
      aria-label={`${work.title} ${copy.lists.coverUnavailable}`}
    >
      <span className="cover-status">{copy.lists.coverUnavailable}</span>
      <strong>{work.title}</strong>
      <small>
        {copy.lists.creatorPrefix} {work.creators.join("・")}
      </small>
    </div>
  );
}

function workFor(workId: string) {
  const work = workById.get(workId);
  if (work === undefined) {
    throw new Error(`Catalog work is missing: ${workId}`);
  }
  return work;
}

function ChoiceGroup<Value extends string | number>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { value: Value; label: string }[];
  value: Value | undefined;
  onChange: (value: Value) => void;
}) {
  return (
    <fieldset className="question-group">
      <legend>{legend}</legend>
      <div className="choices">
        {options.map((option) => (
          <label
            className={value === option.value ? "choice is-selected" : "choice"}
            key={option.value}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="choice-value" aria-hidden="true">
              {typeof option.value === "number" ? option.value : ""}
            </span>
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const familiarityOptions = [
  { value: "read", label: copy.before.familiarity.read },
  { value: "knownUnread", label: copy.before.familiarity.knownUnread },
  { value: "unknown", label: copy.before.familiarity.unknown },
] as const;

const preferenceOptions = [
  { value: "A", label: copy.before.preference.A },
  { value: "B", label: copy.before.preference.B },
  { value: "tie", label: copy.before.preference.tie },
] as const;

function RecommendationCard({
  item,
  children,
}: {
  item: G2Experiment["slots"][G2SlotId]["items"][number];
  children?: ReactNode;
}) {
  const work = workFor(item.workId);
  return (
    <li className="recommendation-card">
      <div className="work-summary">
        <CoverPlaceholder work={work} />
        <div className="work-copy">
          <p className="rank">
            {item.rank}
            {copy.lists.rankSuffix}
          </p>
          <h3>{work.title}</h3>
          <p>{work.creators.join("・")}</p>
        </div>
      </div>
      {children}
    </li>
  );
}

function ListSection({ slot, children }: { slot: G2SlotId; children: ReactNode }) {
  const label = copy.lists[slot];
  return (
    <section className="list-section" aria-labelledby={`recommendation-list-${slot.toLowerCase()}`}>
      <h2 id={`recommendation-list-${slot.toLowerCase()}`}>{label}</h2>
      {children}
    </section>
  );
}

function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <p className="error-message" role="alert">
      {children}
    </p>
  );
}

function InputStage({
  headingRef,
  participantId,
  file,
  busy,
  error,
  onParticipantIdChange,
  onFileChange,
  onSubmit,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  participantId: string;
  file: File | null;
  busy: boolean;
  error: string | null;
  onParticipantIdChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="stage-panel">
      <h1 ref={headingRef} tabIndex={-1}>
        {copy.input.title}
      </h1>
      <p className="lede">{copy.input.description}</p>
      <form className="input-form" onSubmit={onSubmit}>
        <label className="field">
          <span>{copy.input.participantIdLabel}</span>
          <input
            type="text"
            value={participantId}
            onChange={(event) => onParticipantIdChange(event.currentTarget.value)}
            required
            minLength={1}
            maxLength={64}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
          />
          <small>{copy.input.participantIdHint}</small>
        </label>

        <label className="field">
          <span>{copy.input.profileLabel}</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={(event) => onFileChange(event.currentTarget.files?.[0] ?? null)}
            required
          />
          <small>{copy.input.profileHint}</small>
        </label>

        <p className="privacy-note">{copy.input.privacy}</p>
        {error === null ? null : <ErrorMessage>{error}</ErrorMessage>}
        <button className="primary-button" type="submit" disabled={busy || file === null}>
          {busy ? copy.input.loading : copy.input.submit}
        </button>
      </form>
    </section>
  );
}

function BeforeStage({
  headingRef,
  experiment,
  drafts,
  preference,
  onFamiliarityChange,
  onWantToReadChange,
  onPreferenceChange,
  onSubmit,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  experiment: G2Experiment;
  drafts: Readonly<Record<string, PreDraft | undefined>>;
  preference: G2ListPreference | undefined;
  onFamiliarityChange: (workId: string, value: Familiarity) => void;
  onWantToReadChange: (workId: string, value: FivePoint) => void;
  onPreferenceChange: (value: G2ListPreference) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const firstOccurrence = useMemo(() => {
    const entries = new Map<string, string>();
    for (const slot of ["A", "B"] as const) {
      for (const item of experiment.slots[slot].items) {
        if (!entries.has(item.workId)) {
          entries.set(item.workId, `${slot}:${item.rank}`);
        }
      }
    }
    return entries;
  }, [experiment]);
  const complete =
    preference !== undefined &&
    experiment.distinctWorkIds.every((workId) => {
      const draft = drafts[workId];
      return draft?.familiarity !== undefined && draft.wantToReadBefore !== undefined;
    });

  return (
    <form onSubmit={onSubmit}>
      <header className="stage-heading">
        <h1 ref={headingRef} tabIndex={-1}>
          {copy.before.title}
        </h1>
        <p>{copy.before.description}</p>
        <p className="notice">{copy.before.sharedResponse}</p>
      </header>

      <div className="list-grid">
        {(["A", "B"] as const).map((slot) => (
          <ListSection slot={slot} key={slot}>
            <ol className="recommendation-list">
              {experiment.slots[slot].items.map((item) => {
                const draft = drafts[item.workId] ?? {};
                const isFirst = firstOccurrence.get(item.workId) === `${slot}:${item.rank}`;
                return (
                  <RecommendationCard item={item} key={`${slot}:${item.rank}:${item.workId}`}>
                    {isFirst ? (
                      <div className="card-questions">
                        <ChoiceGroup
                          legend={copy.before.familiarityQuestion}
                          name={`before-familiarity-${item.workId}`}
                          options={familiarityOptions}
                          value={draft.familiarity}
                          onChange={(value) => onFamiliarityChange(item.workId, value)}
                        />
                        <ChoiceGroup
                          legend={copy.before.wantToReadQuestion}
                          name={`before-interest-${item.workId}`}
                          options={copy.before.wantToReadScale}
                          value={draft.wantToReadBefore}
                          onChange={(value) => onWantToReadChange(item.workId, value)}
                        />
                      </div>
                    ) : (
                      <p className="shared-answer-note">{copy.before.sharedAnswerRecorded}</p>
                    )}
                  </RecommendationCard>
                );
              })}
            </ol>
          </ListSection>
        ))}
      </div>

      <section className="preference-panel">
        <ChoiceGroup
          legend={copy.before.preferenceQuestion}
          name="before-list-preference"
          options={preferenceOptions}
          value={preference}
          onChange={onPreferenceChange}
        />
        <button className="primary-button" type="submit" disabled={!complete}>
          {copy.before.submit}
        </button>
        {complete ? null : <p className="completion-hint">{copy.before.incomplete}</p>}
      </section>
    </form>
  );
}

function postKey(slot: G2SlotId, rank: number, workId: string) {
  return `${slot}\u0000${rank}\u0000${workId}`;
}

function AfterStage({
  headingRef,
  experiment,
  drafts,
  error,
  onWantToReadChange,
  onAgreementChange,
  onSubmit,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  experiment: G2Experiment;
  drafts: Readonly<Record<string, PostDraft | undefined>>;
  error: string | null;
  onWantToReadChange: (key: string, value: FivePoint) => void;
  onAgreementChange: (key: string, value: FivePoint) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const complete = (["A", "B"] as const).every((slot) =>
    experiment.slots[slot].items.every((item) => {
      const draft = drafts[postKey(slot, item.rank, item.workId)];
      return (
        draft?.wantToReadAfter !== undefined &&
        (!item.explanationAvailable || draft.agreement !== undefined)
      );
    }),
  );

  return (
    <form onSubmit={onSubmit}>
      <header className="stage-heading">
        <h1 ref={headingRef} tabIndex={-1}>
          {copy.after.title}
        </h1>
        <p>{copy.after.description}</p>
      </header>

      <div className="list-grid">
        {(["A", "B"] as const).map((slot) => (
          <ListSection slot={slot} key={slot}>
            <ol className="recommendation-list">
              {experiment.slots[slot].items.map((item) => {
                const key = postKey(slot, item.rank, item.workId);
                const draft = drafts[key] ?? {};
                return (
                  <RecommendationCard item={item} key={key}>
                    <div className="explanation-copy">
                      <h4>{copy.after.explanationHeading}</h4>
                      {item.explanationAvailable ? (
                        item.explanationTexts.map((text) => <p key={text}>{text}</p>)
                      ) : (
                        <p>{copy.after.noExplanation}</p>
                      )}
                    </div>
                    <div className="card-questions">
                      <ChoiceGroup
                        legend={copy.after.wantToReadQuestion}
                        name={`after-interest-${slot}-${item.rank}-${item.workId}`}
                        options={copy.after.wantToReadScale}
                        value={draft.wantToReadAfter}
                        onChange={(value) => onWantToReadChange(key, value)}
                      />
                      {item.explanationAvailable ? (
                        <ChoiceGroup
                          legend={copy.after.agreementQuestion}
                          name={`after-agreement-${slot}-${item.rank}-${item.workId}`}
                          options={copy.after.agreementScale}
                          value={draft.agreement ?? undefined}
                          onChange={(value) => onAgreementChange(key, value)}
                        />
                      ) : null}
                    </div>
                  </RecommendationCard>
                );
              })}
            </ol>
          </ListSection>
        ))}
      </div>

      <div className="submit-panel">
        {error === null ? null : <ErrorMessage>{error}</ErrorMessage>}
        <button className="primary-button" type="submit" disabled={!complete}>
          {copy.after.submit}
        </button>
        {complete ? null : <p className="completion-hint">{copy.after.incomplete}</p>}
      </div>
    </form>
  );
}

function CompleteStage({
  headingRef,
  experiment,
  downloaded,
  onDownload,
  onRestart,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  experiment: G2Experiment;
  downloaded: boolean;
  onDownload: () => void;
  onRestart: () => void;
}) {
  const engineLabel = (slot: G2SlotId) =>
    experiment.slots[slot].engine === "taste" ? copy.complete.taste : copy.complete.baseline;
  return (
    <section className="stage-panel complete-panel">
      <h1 ref={headingRef} tabIndex={-1}>
        {copy.complete.title}
      </h1>
      <p className="lede">{copy.complete.description}</p>
      <section className="debrief" aria-labelledby="debrief-heading">
        <h2 id="debrief-heading">{copy.complete.debriefHeading}</h2>
        <dl>
          <div>
            <dt>{copy.lists.A}</dt>
            <dd>{engineLabel("A")}</dd>
          </div>
          <div>
            <dt>{copy.lists.B}</dt>
            <dd>{engineLabel("B")}</dd>
          </div>
        </dl>
      </section>
      <div className="complete-actions">
        <button className="primary-button" type="button" onClick={onDownload}>
          {copy.complete.download}
        </button>
        <button className="secondary-button" type="button" onClick={onRestart}>
          {copy.complete.restart}
        </button>
      </div>
      <p className="download-status" aria-live="polite">
        {downloaded ? copy.complete.downloaded : ""}
      </p>
    </section>
  );
}

export function G2Wizard({ respondent }: G2WizardProps) {
  const [stage, setStage] = useState<Stage>("input");
  const [participantId, setParticipantId] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [experiment, setExperiment] = useState<G2Experiment | null>(null);
  const [preDrafts, setPreDrafts] = useState<Record<string, PreDraft | undefined>>({});
  const [preference, setPreference] = useState<G2ListPreference>();
  const [postDrafts, setPostDrafts] = useState<Record<string, PostDraft | undefined>>({});
  const [resultText, setResultText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const modeLabel = respondent.kind === "human" ? copy.mode.human : copy.mode.syntheticPilot;

  useEffect(() => {
    headingRef.current?.focus();
  }, [stage]);

  async function startExperiment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!isParticipantId(participantId)) {
      setError(copy.errors.participantId);
      return;
    }
    if (profileFile === null) {
      setError(copy.errors.profileRequired);
      return;
    }

    setBusy(true);
    try {
      const profile = await readProfile(profileFile);
      const nextExperiment = await createG2Experiment({
        participantId,
        profile,
        catalog,
        context: recommendationContext,
        sha256Hex,
        lexicon: explanationLexicon,
      });
      setExperiment(nextExperiment);
      setStage("before");
    } catch (caught) {
      setError(caught instanceof ProfileInputError ? caught.message : copy.errors.setup);
    } finally {
      setBusy(false);
    }
  }

  function updatePreFamiliarity(workId: string, familiarity: Familiarity) {
    setPreDrafts((current) => ({
      ...current,
      [workId]: { ...(current[workId] ?? {}), familiarity },
    }));
  }

  function updatePreInterest(workId: string, wantToReadBefore: FivePoint) {
    setPreDrafts((current) => ({
      ...current,
      [workId]: { ...(current[workId] ?? {}), wantToReadBefore },
    }));
  }

  function lockBefore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (experiment === null || preference === undefined) {
      return;
    }
    const complete = experiment.distinctWorkIds.every((workId) => {
      const draft = preDrafts[workId];
      return draft?.familiarity !== undefined && draft.wantToReadBefore !== undefined;
    });
    if (complete) {
      setStage("after");
    }
  }

  function updatePostInterest(key: string, wantToReadAfter: FivePoint) {
    setPostDrafts((current) => ({
      ...current,
      [key]: { ...(current[key] ?? {}), wantToReadAfter },
    }));
  }

  function updatePostAgreement(key: string, agreement: FivePoint) {
    setPostDrafts((current) => ({
      ...current,
      [key]: { ...(current[key] ?? {}), agreement },
    }));
  }

  function finalize(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (experiment === null || preference === undefined) {
      return;
    }

    const preResponses = experiment.distinctWorkIds.flatMap<G2PreResponse>((workId) => {
      const draft = preDrafts[workId];
      return draft?.familiarity === undefined || draft.wantToReadBefore === undefined
        ? []
        : [{ workId, familiarity: draft.familiarity, wantToReadBefore: draft.wantToReadBefore }];
    });
    const postResponses = (["A", "B"] as const).flatMap<G2PostResponse>((slot) =>
      experiment.slots[slot].items.flatMap<G2PostResponse>((item) => {
        const draft = postDrafts[postKey(slot, item.rank, item.workId)];
        if (
          draft?.wantToReadAfter === undefined ||
          (item.explanationAvailable && draft.agreement === undefined)
        ) {
          return [];
        }
        return [
          {
            slot,
            rank: item.rank,
            workId: item.workId,
            wantToReadAfter: draft.wantToReadAfter,
            agreement: item.explanationAvailable ? (draft.agreement ?? null) : null,
          },
        ];
      }),
    );

    try {
      const result = createG2Result({
        experiment,
        respondent,
        preResponses,
        listPreference: preference,
        postResponses,
      });
      setResultText(serializeG2Result(result));
      setStage("complete");
    } catch {
      setError(copy.errors.result);
    }
  }

  function downloadResult() {
    if (experiment === null || resultText === "") {
      return;
    }
    const url = URL.createObjectURL(
      new Blob([resultText], { type: "application/json;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `konocomics-g2-${experiment.participantId}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  }

  function restart() {
    setStage("input");
    setParticipantId("");
    setProfileFile(null);
    setExperiment(null);
    setPreDrafts({});
    setPreference(undefined);
    setPostDrafts({});
    setResultText("");
    setError(null);
    setDownloaded(false);
  }

  return (
    <main className="page-shell">
      <PageHeader modeLabel={modeLabel} />
      <Progress stage={stage} />
      {stage === "input" ? (
        <InputStage
          headingRef={headingRef}
          participantId={participantId}
          file={profileFile}
          busy={busy}
          error={error}
          onParticipantIdChange={setParticipantId}
          onFileChange={setProfileFile}
          onSubmit={startExperiment}
        />
      ) : null}
      {stage === "before" && experiment !== null ? (
        <BeforeStage
          headingRef={headingRef}
          experiment={experiment}
          drafts={preDrafts}
          preference={preference}
          onFamiliarityChange={updatePreFamiliarity}
          onWantToReadChange={updatePreInterest}
          onPreferenceChange={setPreference}
          onSubmit={lockBefore}
        />
      ) : null}
      {stage === "after" && experiment !== null ? (
        <AfterStage
          headingRef={headingRef}
          experiment={experiment}
          drafts={postDrafts}
          error={error}
          onWantToReadChange={updatePostInterest}
          onAgreementChange={updatePostAgreement}
          onSubmit={finalize}
        />
      ) : null}
      {stage === "complete" && experiment !== null && resultText !== "" ? (
        <CompleteStage
          headingRef={headingRef}
          experiment={experiment}
          downloaded={downloaded}
          onDownload={downloadResult}
          onRestart={restart}
        />
      ) : null}
    </main>
  );
}
