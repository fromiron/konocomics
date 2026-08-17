"use client";

import { useRef, useState } from "react";

import { Switch } from "@/components/design-system/switch";
import type { RecommendationPolicies } from "@/domain/profile/types";
import { settingsStrings } from "@/lib/strings";

const VISIBLE_POLICY_KEYS = [
  "preferCompleted",
  "preferHidden",
  "preferVerified",
  "excludeIncomplete",
] as const;

type VisiblePolicyKey = (typeof VISIBLE_POLICY_KEYS)[number];

type PolicySettingsProps = Readonly<{
  policies: RecommendationPolicies | undefined;
  savePolicies(policies: RecommendationPolicies): Promise<void>;
}>;

export function PolicySettings({ policies, savePolicies }: PolicySettingsProps) {
  const busyRef = useRef(false);
  const [pending, setPending] = useState<RecommendationPolicies | null>(null);
  const [error, setError] = useState<string | null>(null);
  const displayed = pending ?? policies;

  const togglePolicy = async (key: VisiblePolicyKey) => {
    if (displayed === undefined || busyRef.current) return;
    const next = { ...displayed, [key]: !displayed[key] };
    busyRef.current = true;
    setPending(next);
    setError(null);
    try {
      await savePolicies(next);
      setPending(null);
    } catch {
      setPending(null);
      setError(settingsStrings.policies.error);
    } finally {
      busyRef.current = false;
    }
  };

  const busy = pending !== null;

  return (
    <section
      className="grid min-w-0 gap-[var(--space-5)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-5)]"
      aria-labelledby="settings-policies-title"
    >
      <div className="grid gap-[var(--space-content)]">
        <h2 className="text-text-strong" id="settings-policies-title">
          {settingsStrings.policies.title}
        </h2>
        <p className="text-text-muted">{settingsStrings.policies.description}</p>
      </div>
      <fieldset className="m-0 grid gap-0 border-0 p-0" disabled={displayed === undefined || busy}>
        <legend className="sr-only">{settingsStrings.policies.legend}</legend>
        {VISIBLE_POLICY_KEYS.map((key) => {
          const labelId = `settings-policy-${key}-label`;
          const descriptionId = `settings-policy-${key}-description`;
          return (
            <div
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-[var(--space-4)] border-t border-line py-[var(--space-4)] first:border-t-0"
              key={key}
            >
              <span className="grid gap-[var(--space-content-tight)]">
                <strong className="text-text-strong" id={labelId}>
                  {settingsStrings.policies.labels[key]}
                </strong>
                <small className="font-normal text-text-muted" id={descriptionId}>
                  {settingsStrings.policies.descriptions[key]}
                </small>
              </span>
              <Switch
                aria-describedby={descriptionId}
                aria-labelledby={labelId}
                busy={busy}
                checked={displayed?.[key] ?? false}
                disabled={displayed === undefined}
                onCheckedChange={() => void togglePolicy(key)}
              />
            </div>
          );
        })}
      </fieldset>
      {displayed === undefined ? (
        <p className="text-[length:var(--text-caption-size)] text-text-muted" role="status">
          {settingsStrings.policies.loading}
        </p>
      ) : null}
      {busy ? (
        <p className="text-[length:var(--text-caption-size)] text-text-muted" role="status">
          {settingsStrings.policies.saving}
        </p>
      ) : null}
      {error === null ? null : (
        <p
          className="border-l-[length:var(--space-1)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
          role="alert"
        >
          {error}
        </p>
      )}
    </section>
  );
}
