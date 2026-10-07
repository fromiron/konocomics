"use client";

import { Link } from "@tanstack/react-router";
import {
  DatabaseIcon,
  DnaIcon,
  InfoIcon,
  SlidersHorizontalIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { buttonClassName } from "@/components/design-system/button";
import { PageHeader } from "@/components/layout/page-header";
import { useCatalogIdentity } from "@/features/catalog/catalog-provider";
import { usePersistence } from "@/infrastructure/db";
import { settingsStrings } from "@/lib/strings";
import { cn } from "@/lib/utils";

import { DataSettings } from "./data-settings";
import { PolicySettings } from "./policy-settings";
import { SettingsPanel, SettingsRow } from "./settings-panel";
import { StorageStatus } from "./storage-status";

export type SettingsSection = "policies" | "dna" | "data" | "danger" | "app";
const SETTINGS_SECTIONS = ["policies", "dna", "data", "danger", "app"] as const;

const LAST_SECTION: SettingsSection = "app";

const SECTION_ICONS: Record<SettingsSection, LucideIcon> = {
  policies: SlidersHorizontalIcon,
  dna: DnaIcon,
  data: DatabaseIcon,
  danger: TriangleAlertIcon,
  app: InfoIcon,
};

/** Share of the viewport height a section top must pass before it becomes current. */
const SPY_LINE_RATIO = 0.3;

function sectionElement(section: SettingsSection) {
  return document.getElementById(`settings-section-${section}`);
}

/**
 * Tracks which section the reader is in. A section chosen from the navigation (or `?section`)
 * stays current until the reader scrolls away, so a short last section can still be selected.
 */
function useCurrentSection(activeSection: SettingsSection | undefined, scrollRequest: number) {
  const [current, setCurrent] = useState<SettingsSection>(activeSection ?? SETTINGS_SECTIONS[0]);
  const pinned = useRef<{ scrollY: number; section: SettingsSection } | null>(null);

  const [syncedSection, setSyncedSection] = useState(activeSection);
  if (activeSection !== syncedSection) {
    setSyncedSection(activeSection);
    if (activeSection !== undefined) setCurrent(activeSection);
  }

  const scrollToSection = useCallback((section: SettingsSection) => {
    sectionElement(section)?.scrollIntoView?.({ block: "start" });
    pinned.current = { scrollY: window.scrollY, section };
  }, []);

  const jumpTo = useCallback(
    (section: SettingsSection) => {
      scrollToSection(section);
      setCurrent(section);
    },
    [scrollToSection],
  );

  useEffect(() => {
    if (activeSection !== undefined) scrollToSection(activeSection);
  }, [activeSection, scrollRequest, scrollToSection]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (pinned.current !== null) {
        if (Math.abs(window.scrollY - pinned.current.scrollY) < 2) return;
        pinned.current = null;
      }
      const line = window.innerHeight * SPY_LINE_RATIO;
      let next: SettingsSection = SETTINGS_SECTIONS[0];
      for (const section of SETTINGS_SECTIONS) {
        const top = sectionElement(section)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) next = section;
      }
      const atEnd =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setCurrent(atEnd ? LAST_SECTION : next);
    };
    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { current, jumpTo };
}

function SectionNavigation({
  current,
  onSelect,
}: Readonly<{ current: SettingsSection; onSelect(section: SettingsSection): void }>) {
  const listRef = useRef<HTMLUListElement>(null);

  // On narrow screens the list is a horizontal bar: keep the current chip in view.
  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (list === null || list === undefined || item === null || item === undefined) return;
    if (list.scrollWidth <= list.clientWidth) return;
    const listBox = list.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    if (itemBox.left < listBox.left || itemBox.right > listBox.right) {
      list.scrollLeft += itemBox.left - listBox.left - (listBox.width - itemBox.width) / 2;
    }
  }, [current]);

  return (
    <nav
      aria-label={settingsStrings.sections.label}
      className="settings-nav sticky top-0 z-20 min-w-0 -mx-[var(--layout-page-padding)] mb-[var(--space-6)] border-b border-[var(--chrome-rule)] bg-canvas md:top-[calc(var(--desktop-navigation-height)+var(--space-6))] md:mx-0 md:mb-0 md:border-b-0 md:bg-transparent"
    >
      <ul
        className="settings-nav__list m-0 flex list-none gap-[var(--space-1)] overflow-x-auto px-[var(--layout-page-padding)] py-[var(--space-1)] [scrollbar-width:none] md:grid md:overflow-visible md:p-0 [&::-webkit-scrollbar]:hidden"
        ref={listRef}
      >
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = SECTION_ICONS[section];
          const isCurrent = current === section;
          return (
            <li className="shrink-0" key={section}>
              <a
                aria-current={isCurrent ? "location" : undefined}
                className={cn(
                  "flex min-h-[var(--control-min-size)] items-center gap-[var(--space-content-loose)] px-[var(--space-3)] text-[length:var(--font-size-14)] font-bold whitespace-nowrap text-text-muted transition-colors duration-[var(--motion-duration-feedback)] ease-[var(--motion-ease-direct)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [@media(hover:hover)_and_(pointer:fine)]:hover:text-text-strong",
                  // The current section is the amber block of the header and tab bar.
                  "aria-[current=location]:bg-accent aria-[current=location]:text-on-accent [@media(hover:hover)_and_(pointer:fine)]:aria-[current=location]:hover:text-on-accent",
                )}
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
                  onSelect(section);
                }}
                href={`/settings?section=${section}`}
              >
                <span aria-hidden="true" className="hidden md:inline-flex">
                  <Icon
                    className={cn(
                      "size-[var(--space-4)] shrink-0",
                      section === "danger" && !isCurrent && "text-danger",
                    )}
                  />
                </span>
                {settingsStrings.sections.items[section]}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function DnaSettings({ adjustmentCount }: Readonly<{ adjustmentCount: number }>) {
  return (
    <SettingsPanel
      description={settingsStrings.dna.description}
      headingId="settings-dna-title"
      id="settings-section-dna"
      title={settingsStrings.dna.title}
    >
      <SettingsRow
        action={
          <Link
            className={buttonClassName({
              className: "w-full px-[var(--space-4)] text-center font-bold sm:w-fit",
              variant: "outline",
            })}
            search={{ mode: "adjust" }}
            to="/taste"
          >
            {settingsStrings.dna.action}
          </Link>
        }
        title={settingsStrings.dna.adjustmentCount(adjustmentCount)}
        titleAs="p"
      />
    </SettingsPanel>
  );
}

function AppInfo({ storageDegraded }: Readonly<{ storageDegraded: boolean }>) {
  const rows = [
    [settingsStrings.app.versionLabel, settingsStrings.app.version],
    [
      settingsStrings.app.storageLabel,
      storageDegraded
        ? settingsStrings.app.storageValueSessionOnly
        : settingsStrings.app.storageValue,
    ],
    [settingsStrings.app.providerLabel, settingsStrings.app.providerCredit],
    [settingsStrings.app.affiliateLabel, settingsStrings.app.affiliateRelationship],
  ] as const;

  return (
    <SettingsPanel
      headingId="settings-app-title"
      id="settings-section-app"
      title={settingsStrings.app.title}
    >
      <dl className="m-0 grid min-w-0">
        {rows.map(([label, value]) => (
          <div
            className="grid min-w-0 gap-[var(--space-content-tight)] border-t border-line py-[var(--space-3)] text-[length:var(--font-size-14)] sm:grid-cols-[calc(var(--control-min-size)*3)_minmax(0,1fr)] sm:gap-[var(--space-4)]"
            key={label}
          >
            <dt className="font-bold text-text">{label}</dt>
            <dd className="m-0 min-w-0 text-text-muted [overflow-wrap:anywhere]">{value}</dd>
          </div>
        ))}
      </dl>
      <Link
        className={buttonClassName({
          className: "w-full px-[var(--space-4)] text-center font-bold sm:w-fit",
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
  scrollRequest = 0,
}: Readonly<{
  activeSection?: SettingsSection;
  onSectionChange?: (section: SettingsSection) => void;
  /** Bumped by the route after the router settles its own scroll, to re-apply `?section`. */
  scrollRequest?: number;
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
  const { current, jumpTo } = useCurrentSection(activeSection, scrollRequest);

  return (
    <main className="mx-auto w-full max-w-[var(--layout-width-media)] px-[var(--layout-page-padding)] pt-[var(--layout-page-block-start)]">
      <PageHeader
        className="mb-[var(--space-6)] md:mb-[var(--space-8)]"
        title={settingsStrings.title}
      >
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

      <div className="grid grid-cols-[minmax(0,1fr)] items-start md:grid-cols-[calc(var(--control-min-size)*5)_minmax(0,1fr)] md:gap-x-[var(--space-12)]">
        <SectionNavigation
          current={current}
          onSelect={(section) => {
            onSectionChange?.(section);
            jumpTo(section);
          }}
        />
        <div className="grid min-w-0 gap-[var(--space-12)]">
          <PolicySettings policies={policies} savePolicies={savePolicies} />
          <DnaSettings adjustmentCount={adjustmentCount} />
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
          <AppInfo storageDegraded={storageDegraded} />
        </div>
      </div>
    </main>
  );
}
