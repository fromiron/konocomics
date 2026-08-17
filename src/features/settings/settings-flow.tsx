"use client";

import { Link } from "@tanstack/react-router";
import { CogIcon, DnaIcon, InfoIcon, LockKeyholeIcon } from "lucide-react";
import type { ReactNode } from "react";

import { buttonClassName } from "@/components/design-system/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/design-system/tabs";
import { useCatalogIdentity } from "@/features/catalog/catalog-provider";
import { usePersistence } from "@/infrastructure/db";
import { settingsStrings } from "@/lib/strings";

import { DataSettings } from "./data-settings";
import { PolicySettings } from "./policy-settings";
import { SettingsPanel } from "./settings-panel";

export type SettingsSection = "policies" | "data" | "app";
const SETTINGS_SECTIONS = ["policies", "data", "app"] as const;

function AppInfo({ storageDegraded }: Readonly<{ storageDegraded: boolean }>) {
  return (
    <SettingsPanel headingId="settings-app-title" icon={InfoIcon} title={settingsStrings.app.title}>
      <dl className="m-0 grid gap-[var(--space-content)] sm:grid-cols-2 md:grid-cols-5 [&>div]:grid [&>div]:min-w-0 [&>div]:content-start [&>div]:gap-[var(--space-content-tight)] [&>div]:rounded-[var(--radius-card)] [&>div]:border [&>div]:border-line [&>div]:bg-surface-2 [&>div]:p-[var(--space-3)] [&_dd]:m-0 [&_dd]:min-w-0 [&_dd]:text-[length:var(--text-caption-size)] [&_dd]:text-text-strong [&_dd]:[overflow-wrap:anywhere] [&_dt]:text-[length:var(--text-caption-size)] [&_dt]:font-bold [&_dt]:text-text-muted">
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
    <SettingsPanel
      className="h-full"
      description={settingsStrings.dna.description}
      headingId="settings-dna-title"
      icon={DnaIcon}
      title={settingsStrings.dna.title}
      tone="accent"
    >
      <div className="grid gap-[var(--space-4)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <p className="min-w-0 rounded-[var(--radius-control)] border border-line-accent-subtle bg-accent-soft px-[var(--space-4)] py-[var(--space-3)] text-text-strong [overflow-wrap:anywhere]">
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
  );
  const localDataPanel = (
    <SettingsPanel
      className="h-full"
      description={
        storageDegraded ? settingsStrings.storage.sessionOnly : settingsStrings.storage.browserOnly
      }
      headingId="settings-local-data-title"
      icon={LockKeyholeIcon}
      title={settingsStrings.localData.title}
      tone={storageDegraded ? "danger" : "accent"}
    >
      <p className="rounded-[var(--radius-control)] border border-line-accent-subtle bg-accent-soft px-[var(--space-4)] py-[var(--space-3)] text-text-strong">
        {settingsStrings.localData.privacy}
      </p>
    </SettingsPanel>
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
    <div className="grid gap-[var(--space-6)]">
      {policySettingsPanel}
      {dnaPanel}
    </div>
  );
  const dataPanel = (
    <div className="grid gap-[var(--space-6)] md:grid-cols-2 md:items-stretch">
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
      <main className="mx-auto grid w-full max-w-[var(--layout-width-media)] gap-[var(--space-section)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)] pb-[calc(var(--layout-mobile-navigation-clearance)+var(--space-8))] md:px-[var(--space-8)] md:pt-[var(--space-6)] md:pb-[var(--space-section-large)]">
        <header className="grid min-w-0 gap-[var(--space-4)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="grid max-w-[var(--layout-width-reading)] gap-[var(--space-content-loose)]">
            <h1 className="text-[length:var(--text-page-title-size)] text-text-strong md:text-[length:var(--font-size-32)]">
              {settingsStrings.title}
            </h1>
            <p className="text-text-muted">{settingsStrings.description}</p>
          </div>
          <span aria-hidden="true" className="hidden size-[calc(var(--space-8)*2)] md:block">
            <CogIcon className="size-full text-accent opacity-45" strokeWidth={1.25} />
          </span>
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
          <div className="grid gap-[var(--space-6)] md:gap-[var(--space-8)]">
            {policySettingsPanel}
            <div className="grid gap-[var(--space-6)] md:grid-cols-2 md:items-stretch">
              {dnaPanel}
              {localDataPanel}
            </div>
            <div className="grid gap-[var(--space-6)] md:grid-cols-2 md:items-stretch">
              {dataSettingsPanel}
            </div>
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
