"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { buttonClassName } from "@/components/design-system/button";
import { PageHeader } from "@/components/layout/page-header";
import { useCatalogIdentity } from "@/features/catalog/catalog-provider";
import { usePersistence } from "@/infrastructure/db";
import { settingsStrings } from "@/lib/strings";

import { DataSettings } from "./data-settings";
import { PolicySettings } from "./policy-settings";
import { SettingsPanel } from "./settings-panel";
import { StorageStatus } from "./storage-status";

export type SettingsSection = "policies" | "dna" | "data" | "app";
const SETTINGS_SECTIONS = ["policies", "dna", "data", "app"] as const;

function AppInfo({ storageDegraded }: Readonly<{ storageDegraded: boolean }>) {
  return (
    <SettingsPanel headingId="settings-app-title" title={settingsStrings.app.title}>
      <dl className="m-0 grid gap-[var(--space-4)] sm:grid-cols-2 md:grid-cols-5 [&>div]:grid [&>div]:min-w-0 [&>div]:content-start [&>div]:gap-[var(--space-content-tight)] [&_dd]:m-0 [&_dd]:min-w-0 [&_dd]:text-[length:var(--text-caption-size)] [&_dd]:text-text-strong [&_dd]:[overflow-wrap:anywhere] [&_dt]:text-[length:var(--text-caption-size)] [&_dt]:font-bold [&_dt]:text-text-muted">
        <div>
          <dt>{settingsStrings.app.versionLabel}</dt>
          <dd>{settingsStrings.app.version}</dd>
        </div>
        <div>
          <dt>{settingsStrings.app.storageLabel}</dt>
          <dd>
            {storageDegraded
              ? settingsStrings.storage.sessionOnly
              : settingsStrings.storage.browserOnly}
          </dd>
        </div>
        <div>
          <dt>{settingsStrings.app.providerLabel}</dt>
          <dd>{settingsStrings.app.providerCredit}</dd>
        </div>
        <div>
          <dt>{settingsStrings.app.affiliateLabel}</dt>
          <dd>{settingsStrings.app.affiliateRelationship}</dd>
        </div>
        <div>
          <dt>{settingsStrings.app.licenseLabel}</dt>
          <dd>{settingsStrings.app.licenseUnset}</dd>
        </div>
      </dl>
      <Link
        className={buttonClassName({
          className:
            "w-full px-[var(--space-4)] py-[var(--space-content)] text-center font-bold sm:w-fit",
          variant: "outline",
        })}
        preload={false}
        search={{ landing: "1" }}
        to="/"
      >
        {settingsStrings.app.showIntroduction}
      </Link>
    </SettingsPanel>
  );
}

export function SettingsFlow({
  activeSection,
  onSectionChange,
}: Readonly<{
  activeSection?: SettingsSection;
  onSectionChange?: (section: SettingsSection) => void;
}> = {}) {
  const catalogIdentity = useCatalogIdentity();
  const {
    adjustments,
    deleteAllData,
    exportUserData,
    externalWorks,
    inspectImportJson,
    policies,
    replaceFromExport,
    savePolicies,
    status,
    userWorks,
  } = usePersistence();
  const storageDegraded = status.state === "degraded";
  const adjustmentCount = [
    ...Object.values(adjustments?.axes ?? {}),
    ...Object.values(adjustments?.themes ?? {}),
  ].filter((value) => value !== "auto").length;

  useEffect(() => {
    if (activeSection === undefined) return;
    document
      .getElementById(`settings-section-${activeSection}`)
      ?.scrollIntoView?.({ block: "start" });
  }, [activeSection]);

  const sections: Record<SettingsSection, ReactNode> = {
    policies: <PolicySettings policies={policies} savePolicies={savePolicies} />,
    dna: (
      <SettingsPanel
        description={settingsStrings.dna.description}
        headingId="settings-dna-title"
        title={settingsStrings.dna.title}
      >
        <div className="grid gap-[var(--space-4)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <p className="min-w-0 font-bold text-text-strong [overflow-wrap:anywhere]">
            {settingsStrings.dna.adjustmentCount(adjustmentCount)}
          </p>
          <Link
            className={buttonClassName({
              className:
                "w-full px-[var(--space-4)] py-[var(--space-content)] text-center font-bold sm:w-fit",
              variant: "outline",
            })}
            search={{ mode: "adjust" }}
            to="/taste"
          >
            {settingsStrings.dna.action}
          </Link>
        </div>
      </SettingsPanel>
    ),
    data: (
      <DataSettings
        currentCatalog={catalogIdentity}
        deleteAllData={deleteAllData}
        exportUserData={exportUserData}
        inspectImportJson={inspectImportJson}
        replaceFromExport={replaceFromExport}
      >
        <StorageStatus
          externalCount={externalWorks?.length ?? 0}
          recordCount={userWorks?.length ?? 0}
          storageDegraded={storageDegraded}
        />
      </DataSettings>
    ),
    app: <AppInfo storageDegraded={storageDegraded} />,
  };

  return (
    <main className="mx-auto w-full max-w-[var(--layout-width-media)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[var(--space-8)] md:pb-[var(--space-section-large)]">
      <PageHeader className="mb-[var(--space-6)]" title={settingsStrings.title}>
        <p className="text-[length:var(--font-size-14)] leading-relaxed text-text-muted">
          {settingsStrings.description}
        </p>
      </PageHeader>

      {storageDegraded ? (
        <p
          className="mb-[var(--space-6)] border-l-[length:var(--space-1)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
          role="status"
        >
          {settingsStrings.storage.sessionOnly}
        </p>
      ) : null}

      <div className="grid items-start gap-x-[var(--space-12)] md:grid-cols-[calc(var(--control-min-size)*4)_minmax(0,1fr)]">
        <nav
          aria-label={settingsStrings.sections.label}
          className="sticky top-[calc(var(--desktop-navigation-height)+var(--space-6))] hidden md:block"
        >
          <ul className="m-0 grid list-none gap-[var(--space-1)] p-0">
            {SETTINGS_SECTIONS.map((section) => (
              <li key={section}>
                <Link
                  aria-current={activeSection === section ? "location" : undefined}
                  className="flex min-h-[var(--control-min-size)] items-center border-l-2 border-transparent pl-[var(--space-3)] text-[length:var(--font-size-14)] font-medium text-text-muted hover:text-text focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring aria-[current=location]:border-accent aria-[current=location]:font-bold aria-[current=location]:text-accent"
                  onClick={(event) => {
                    if (
                      event.button !== 0 ||
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return;
                    event.preventDefault();
                    onSectionChange?.(section);
                    document
                      .getElementById(`settings-section-${section}`)
                      ?.scrollIntoView?.({ block: "start" });
                  }}
                  resetScroll={false}
                  search={{ section }}
                  to="/settings"
                >
                  {settingsStrings.sections.items[section]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid min-w-0 gap-[var(--space-shelf-group)]">
          {SETTINGS_SECTIONS.map((section) => (
            <div
              className="min-w-0 scroll-mt-[calc(var(--desktop-navigation-height)+var(--space-6))]"
              id={`settings-section-${section}`}
              key={section}
            >
              {sections[section]}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
