"use client";

import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/design-system/button";
import { settingsStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { SettingsRow } from "./settings-panel";

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

  const protectionMessage = storageDegraded
    ? settingsStrings.storage.sessionOnly
    : persistState === "persisted"
      ? strings.persisted
      : persistState === "denied"
        ? strings.denied
        : persistState === "not-persisted"
          ? strings.notPersisted
          : null;
  const ProtectionIcon = persistState === "persisted" ? ShieldCheckIcon : ShieldAlertIcon;

  return (
    <SettingsRow
      action={
        !storageDegraded && persistState === "not-persisted" && canRequestPersistence ? (
          <Button
            className="w-full sm:w-fit"
            disabled={requesting}
            onClick={() => void requestPersistence()}
            type="button"
            variant="outline"
          >
            {requesting ? strings.protecting : strings.protect}
          </Button>
        ) : undefined
      }
      description={
        <>
          <p>
            {strings.records(recordCount, externalCount)}
            {usageBytes === null ? null : (
              <>
                <span aria-hidden="true"> · </span>
                {strings.usage(megabytes.format(usageBytes / 1024 / 1024))}
              </>
            )}
          </p>
          <p className="flex items-start gap-[var(--space-content)]" role="status">
            {protectionMessage === null ? null : (
              <>
                <ProtectionIcon
                  aria-hidden="true"
                  className={cn(
                    "mt-[var(--space-content-tight)] size-[var(--space-4)] shrink-0",
                    persistState === "persisted" && !storageDegraded
                      ? "text-accent"
                      : "text-text-muted",
                  )}
                />
                <span className="min-w-0">{protectionMessage}</span>
              </>
            )}
          </p>
        </>
      }
      title={strings.title}
    />
  );
}
