"use client";

import { useRef, useState } from "react";

import type { RecommendationPolicies } from "@/domain/profile/types";
import { settingsStrings } from "@/lib/strings";

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
    <section className="settings-section" aria-labelledby="settings-policies-title">
      <div className="settings-section__header">
        <h2 id="settings-policies-title">{settingsStrings.policies.title}</h2>
        <p>{settingsStrings.policies.description}</p>
      </div>
      <fieldset className="settings-policies" disabled={displayed === undefined || busy}>
        <legend className="visually-hidden">{settingsStrings.policies.legend}</legend>
        {VISIBLE_POLICY_KEYS.map((key) => (
          <label key={key}>
            <input
              checked={displayed?.[key] ?? false}
              onChange={() => void togglePolicy(key)}
              type="checkbox"
            />
            <span>{settingsStrings.policies.labels[key]}</span>
          </label>
        ))}
      </fieldset>
      {displayed === undefined ? (
        <p className="settings-status" role="status">
          {settingsStrings.policies.loading}
        </p>
      ) : null}
      {busy ? (
        <p className="settings-status" role="status">
          {settingsStrings.policies.saving}
        </p>
      ) : null}
      {error === null ? null : (
        <p className="settings-inline-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
