"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/design-system/button";
import { settingsStrings } from "@/lib/strings";

type PersistState = "unknown" | "persisted" | "not-persisted" | "denied";

const megabytes = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 });

function storageManager(): StorageManager | undefined {
  return typeof navigator === "undefined" ? undefined : navigator.storage;
}

/** Record count, origin usage, and eviction protection for the local-first data store. */
export function StorageStatus({
  externalCount,
  recordCount,
  storageDegraded,
}: Readonly<{
  externalCount: number;
  recordCount: number;
  storageDegraded: boolean;
}>) {
  const strings = settingsStrings.storageStatus;
  const [persistState, setPersistState] = useState<PersistState>("unknown");
  const [usageBytes, setUsageBytes] = useState<number | null>(null);
  const [requesting, setRequesting] = useState(false);
  const canRequestPersistence = typeof storageManager()?.persist === "function";

  useEffect(() => {
    const storage = storageManager();
    if (storageDegraded || storage === undefined) return;
    let active = true;
    void storage
      .persisted?.()
      .then((persisted) => {
        if (active) setPersistState(persisted ? "persisted" : "not-persisted");
      })
      .catch(() => undefined);
    void storage
      .estimate?.()
      .then(({ usage }) => {
        if (active && usage !== undefined) setUsageBytes(usage);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [storageDegraded]);

  const requestPersistence = async () => {
    const storage = storageManager();
    if (storage?.persist === undefined || requesting) return;
    setRequesting(true);
    try {
      setPersistState((await storage.persist()) ? "persisted" : "denied");
    } catch {
      setPersistState("denied");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="grid gap-[var(--space-4)] border-t border-line pt-[var(--space-5)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="grid min-w-0 gap-[var(--space-content-tight)]">
        <h3 className="text-[length:var(--font-size-16)]">{strings.title}</h3>
        <p className="text-text-muted [overflow-wrap:anywhere]">
          {strings.records(recordCount, externalCount)}
          {usageBytes === null ? null : (
            <>
              <span aria-hidden="true"> · </span>
              {strings.usage(megabytes.format(usageBytes / 1024 / 1024))}
            </>
          )}
        </p>
        <p className="text-text-muted [overflow-wrap:anywhere]" role="status">
          {storageDegraded
            ? settingsStrings.storage.sessionOnly
            : persistState === "persisted"
              ? strings.persisted
              : persistState === "denied"
                ? strings.denied
                : persistState === "not-persisted"
                  ? strings.notPersisted
                  : null}
        </p>
      </div>
      {!storageDegraded && persistState === "not-persisted" && canRequestPersistence ? (
        <Button
          className="w-full sm:w-fit"
          disabled={requesting}
          onClick={() => void requestPersistence()}
          type="button"
          variant="outline"
        >
          {requesting ? strings.protecting : strings.protect}
        </Button>
      ) : null}
    </div>
  );
}
