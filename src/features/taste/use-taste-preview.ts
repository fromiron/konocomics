import { useEffect, useMemo, useState } from "react";
import type {
  ProfileAdjustments,
  RecommendationPolicies,
  UserWorkRecord,
} from "@/domain/profile/types";
import { RecommendationPlanWorkerClient } from "@/features/recommendations/recommendation-plan-worker-client";
import type { TastePreviewResult } from "@/features/recommendations/recommendation-plan-worker-protocol";
import { runtimeManifest } from "@/features/catalog/runtime-manifest";

type State = { key: string; result: TastePreviewResult | null; error: boolean };
export function useTastePreview(
  records: readonly UserWorkRecord[],
  adjustments: ProfileAdjustments,
  baseline: ProfileAdjustments | null,
  policies: RecommendationPolicies | undefined,
) {
  const [client] = useState(() => new RecommendationPlanWorkerClient());
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State>({ key: "", result: null, error: false });
  const key = useMemo(
    () => JSON.stringify({ records, adjustments, baseline, policies, attempt }),
    [records, adjustments, baseline, policies, attempt],
  );
  useEffect(() => () => client.terminate(), [client]);
  useEffect(() => {
    if (baseline === null || policies === undefined) return;
    let active = true;
    // Coalesce rapid adjustment changes and let the DNA paint before background work begins.
    const timer = window.setTimeout(() => {
      void client
        .preview(runtimeManifest, {
          records: [...records],
          adjustments,
          baselineAdjustments: baseline,
          policies,
        })
        .then((result) => {
          if (active) setState({ key, result, error: false });
        })
        .catch(() => {
          if (active) setState({ key, result: null, error: true });
        });
    }, 100);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [client, key, records, adjustments, baseline, policies]);
  const current = state.key === key;
  return {
    result: state.result,
    ready: current && state.result !== null,
    loading: !current,
    error: current && state.error,
    retry: () => setAttempt((value) => value + 1),
  };
}
