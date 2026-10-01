"use client";

import { useRef, useState } from "react";

import { Switch } from "@/components/design-system/switch";
import type { RecommendationPolicies } from "@/domain/profile/types";
import { settingsStrings } from "@/lib/strings";

import { SettingsNotice, SettingsPanel } from "./settings-panel";

const VISIBLE_POLICY_KEYS = ["preferCompleted", "preferHidden", "preferVerified"] as const;

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
    <SettingsPanel
      description={settingsStrings.policies.description}
      headingId="settings-policies-title"
      id="settings-section-policies"
      title={settingsStrings.policies.title}
    >
      <fieldset
        className="m-0 grid min-w-0 border-0 p-0"
        disabled={displayed === undefined || busy}
      >
        <legend className="sr-only">{settingsStrings.policies.legend}</legend>
        {VISIBLE_POLICY_KEYS.map((key) => {
          const labelId = `settings-policy-${key}-label`;
          const descriptionId = `settings-policy-${key}-description`;
          return (
            <div
              className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-[var(--space-4)] border-t border-line py-[var(--space-4)] last:pb-0"
              key={key}
            >
              <span className="grid min-w-0 gap-[var(--space-content-tight)]">
                <strong className="text-[length:var(--font-size-16)] text-text-strong" id={labelId}>
                  {settingsStrings.policies.labels[key]}
                </strong>
                <span
                  className="text-[length:var(--font-size-14)] text-text-muted [overflow-wrap:anywhere]"
                  id={descriptionId}
                >
                  {settingsStrings.policies.descriptions[key]}
                </span>
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
        <SettingsNotice tone="progress">{settingsStrings.policies.loading}</SettingsNotice>
      ) : null}
      {busy ? (
        <SettingsNotice tone="progress">{settingsStrings.policies.saving}</SettingsNotice>
      ) : null}
      {error === null ? null : <SettingsNotice tone="error">{error}</SettingsNotice>}
    </SettingsPanel>
  );
}
