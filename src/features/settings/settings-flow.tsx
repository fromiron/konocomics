"use client";

import Link from "next/link";

import { useCatalogIdentity } from "@/features/catalog/catalog-provider";
import { usePersistence } from "@/infrastructure/db";
import { settingsStrings } from "@/lib/strings";

import { DataSettings } from "./data-settings";
import { PolicySettings } from "./policy-settings";

export function SettingsFlow() {
  const catalogIdentity = useCatalogIdentity();
  const {
    deleteAllData,
    exportUserData,
    inspectImportJson,
    policies,
    replaceFromExport,
    savePolicies,
    status,
  } = usePersistence();

  return (
    <main className="settings-page">
      <header className="settings-page__header">
        <h1>{settingsStrings.title}</h1>
        <p>{settingsStrings.description}</p>
      </header>

      {status.state === "degraded" ? (
        <p className="settings-storage-warning" role="status">
          {settingsStrings.storage.sessionOnly}
        </p>
      ) : null}

      <PolicySettings policies={policies} savePolicies={savePolicies} />
      <DataSettings
        currentCatalog={catalogIdentity}
        deleteAllData={deleteAllData}
        exportUserData={exportUserData}
        inspectImportJson={inspectImportJson}
        replaceFromExport={replaceFromExport}
      />

      <section className="settings-section" aria-labelledby="settings-app-title">
        <div className="settings-section__header">
          <h2 id="settings-app-title">{settingsStrings.app.title}</h2>
        </div>
        <dl className="settings-app-info">
          <div>
            <dt>{settingsStrings.app.versionLabel}</dt>
            <dd>{settingsStrings.app.version}</dd>
          </div>
          <div>
            <dt>{settingsStrings.app.storageLabel}</dt>
            <dd>
              {status.state === "degraded"
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
          className="settings-introduction-link interactive-press"
          href="/?landing=1"
          prefetch={false}
        >
          {settingsStrings.app.showIntroduction}
        </Link>
      </section>
    </main>
  );
}
