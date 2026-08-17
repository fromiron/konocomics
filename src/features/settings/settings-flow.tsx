"use client";

import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { buttonClassName } from "@/components/design-system/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/design-system/tabs";
import { useCatalogIdentity } from "@/features/catalog/catalog-provider";
import { usePersistence } from "@/infrastructure/db";
import { settingsStrings } from "@/lib/strings";

import { DataSettings } from "./data-settings";
import { PolicySettings } from "./policy-settings";

export type SettingsSection = "policies" | "data" | "app";
const SETTINGS_SECTIONS = ["policies", "data", "app"] as const;

function AppInfo({ storageDegraded }: Readonly<{ storageDegraded: boolean }>) {
  return (
    <section
      className="grid gap-[var(--space-5)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-5)]"
      aria-labelledby="settings-app-title"
    >
      <div className="grid gap-[var(--space-content)]">
        <h2 className="text-text-strong" id="settings-app-title">
          {settingsStrings.app.title}
        </h2>
      </div>
      <dl className="m-0 grid [&>div]:grid [&>div]:grid-cols-[minmax(8rem,9rem)_minmax(0,1fr)] [&>div]:items-start [&>div]:gap-[var(--space-4)] [&>div]:border-t [&>div]:border-line [&>div]:py-[var(--space-3)] [&_dd]:m-0 [&_dd]:min-w-0 [&_dd]:[overflow-wrap:anywhere] [&_dt]:text-text-muted">
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
          className: "w-fit px-[var(--space-4)] py-[var(--space-content)] text-center font-bold",
          variant: "outline",
        })}
        preload={false}
        search={{ landing: "1" }}
        to="/"
      >
        {settingsStrings.app.showIntroduction}
      </Link>
    </section>
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
    inspectImportJson,
    policies,
    replaceFromExport,
    savePolicies,
    status,
  } = usePersistence();
  const storageDegraded = status.state === "degraded";
  const adjustmentCount = [
    ...Object.values(adjustments?.axes ?? {}),
    ...Object.values(adjustments?.themes ?? {}),
  ].filter((value) => value !== "auto").length;
  const policySettingsPanel = <PolicySettings policies={policies} savePolicies={savePolicies} />;
  const dnaPanel = (
    <section
      className="grid min-w-0 gap-[var(--space-5)] rounded-[var(--radius-card)] border border-line-accent-subtle bg-surface-1 p-[var(--space-5)]"
      aria-labelledby="settings-dna-title"
    >
      <div className="grid gap-[var(--space-content)]">
        <h2 className="text-text-strong" id="settings-dna-title">
          {settingsStrings.dna.title}
        </h2>
        <p className="text-text-muted">{settingsStrings.dna.description}</p>
      </div>
      <p>{settingsStrings.dna.adjustmentCount(adjustmentCount)}</p>
      <Link
        className={buttonClassName({
          className: "w-fit px-[var(--space-4)] py-[var(--space-content)] text-center font-bold",
          variant: "outline",
        })}
        search={{ mode: "adjust" }}
        to="/taste"
      >
        {settingsStrings.dna.action}
      </Link>
    </section>
  );
  const localDataPanel = (
    <section
      className="grid min-w-0 gap-[var(--space-5)] rounded-[var(--radius-card)] border border-line-accent-subtle bg-surface-1 p-[var(--space-5)]"
      aria-labelledby="settings-local-data-title"
    >
      <div className="grid gap-[var(--space-content)]">
        <h2 className="text-text-strong" id="settings-local-data-title">
          {settingsStrings.localData.title}
        </h2>
        <p className="text-text-muted">
          {storageDegraded
            ? settingsStrings.storage.sessionOnly
            : settingsStrings.storage.browserOnly}
        </p>
      </div>
      <p>{settingsStrings.localData.privacy}</p>
    </section>
  );
  const dataSettingsPanel = (
    <DataSettings
      currentCatalog={catalogIdentity}
      deleteAllData={deleteAllData}
      exportUserData={exportUserData}
      inspectImportJson={inspectImportJson}
      replaceFromExport={replaceFromExport}
    />
  );
  const policyPanel = (
    <div className="grid gap-[var(--space-6)] md:grid-cols-2 md:items-start">
      {policySettingsPanel}
      {dnaPanel}
    </div>
  );
  const dataPanel = (
    <div className="grid gap-[var(--space-6)] md:grid-cols-2 md:items-start">
      {localDataPanel}
      {dataSettingsPanel}
    </div>
  );
  const appPanel = <AppInfo storageDegraded={storageDegraded} />;
  const panels: Record<SettingsSection, ReactNode> = {
    policies: policyPanel,
    data: dataPanel,
    app: appPanel,
  };

  return (
    <>
      <main className="mx-auto grid w-full max-w-[var(--layout-width-media)] gap-[var(--space-section)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[var(--space-section-large)]">
        <header className="grid gap-[var(--space-content)]">
          <h1 className="text-[length:var(--text-page-title-size)] text-text-strong">
            {settingsStrings.title}
          </h1>
          <p className="text-text-muted">{settingsStrings.description}</p>
        </header>

        {storageDegraded ? (
          <p
            className="border-l-[length:var(--space-1)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
            role="status"
          >
            {settingsStrings.storage.sessionOnly}
          </p>
        ) : null}

        {activeSection === undefined ? (
          <div className="grid gap-[var(--space-6)]">
            {policySettingsPanel}
            <div className="grid gap-[var(--space-6)] md:grid-cols-2 md:items-start">
              {dnaPanel}
              {localDataPanel}
            </div>
            {dataSettingsPanel}
            {appPanel}
          </div>
        ) : (
          <Tabs
            className="gap-[var(--space-6)]"
            onValueChange={(value) => {
              if (SETTINGS_SECTIONS.some((section) => section === value)) onSectionChange?.(value);
            }}
            value={activeSection}
          >
            <TabsList
              aria-label={settingsStrings.sections.label}
              className="w-full justify-start overflow-x-auto overflow-y-hidden"
            >
              {SETTINGS_SECTIONS.map((section) => (
                <TabsTrigger
                  className="min-w-max shrink-0 px-[var(--space-4)]"
                  key={section}
                  value={section}
                >
                  {settingsStrings.sections.items[section]}
                </TabsTrigger>
              ))}
            </TabsList>
            {SETTINGS_SECTIONS.map((section) => (
              <TabsContent key={section} value={section}>
                {panels[section]}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
