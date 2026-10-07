// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CatalogV1 } from "@/domain/catalog/types";
import type { RecommendationPolicies } from "@/domain/profile/types";
import {
  DataTransferError,
  ExportDraftConflictError,
  type ExportFileV1,
  type ImportPreviewV1,
} from "@/infrastructure/db";
import type * as PersistenceExports from "@/infrastructure/db";
import { SettingsFlow } from "@/features/settings/settings-flow";
import { settingsStrings } from "@/lib/strings";
import { createTestCatalog } from "../../helpers/catalog";

const testState = vi.hoisted(() => ({
  catalog: null as unknown as CatalogV1,
  deleteAllData: vi.fn(),
  exportUserData: vi.fn(),
  inspectImportJson: vi.fn(),
  navigate: vi.fn(),
  policies: {
    preferCompleted: false,
    preferHidden: true,
    preferVerified: false,
    excludeIncomplete: true,
  } as RecommendationPolicies,
  replaceFromExport: vi.fn(),
  savePolicies: vi.fn(),
  status: { state: "ready", mode: "indexeddb", warning: null } as const,
  userWorks: [] as { workId: string }[],
  externalWorks: [] as { id: string }[],
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    "aria-current": ariaCurrent,
    children,
    className,
    to,
  }: {
    "aria-current"?: "location";
    children: ReactNode;
    className?: string;
    to: string;
  }) => (
    <a aria-current={ariaCurrent} className={className} href={to}>
      {children}
    </a>
  ),
  useNavigate: () => testState.navigate,
}));

vi.mock("@/features/catalog/catalog-provider", () => ({
  useCatalogIdentity: () => ({
    catalogVersion: testState.catalog.catalogVersion,
    workIds: testState.catalog.works.map((work) => work.id),
    profileWorkIds: testState.catalog.works
      .filter((work) => work.eligibility.recommendationEligible)
      .map((work) => work.id),
  }),
}));

vi.mock("@/features/catalog/catalog-assets", () => ({
  loadCatalogSelection: vi.fn(async () => ({ catalog: testState.catalog })),
}));

vi.mock("@/infrastructure/db", async (importOriginal) => {
  const actual = await importOriginal<typeof PersistenceExports>();
  return {
    ...actual,
    usePersistence: () => ({
      deleteAllData: testState.deleteAllData,
      exportUserData: testState.exportUserData,
      inspectImportJson: testState.inspectImportJson,
      policies: testState.policies,
      replaceFromExport: testState.replaceFromExport,
      savePolicies: testState.savePolicies,
      status: testState.status,
      userWorks: testState.userWorks,
      externalWorks: testState.externalWorks,
    }),
  };
});

const catalog = createTestCatalog();
const exportedAt = "2026-08-14T12:34:56.000+09:00";
const exportFile: ExportFileV1 = {
  format: "konocomics-export",
  schemaVersion: 1,
  exportedAt,
  catalogVersion: "v1-older",
  userWorks: [
    {
      workId: catalog.works[0]!.id,
      readingState: "completed",
      reaction: "liked",
      updatedAt: exportedAt,
    },
  ],
  externalWorks: [],
  profile: {
    adjustments: { axes: {}, themes: {} },
    policies: testState.policies,
    onboardingCompletedAt: exportedAt,
  },
  onboardingDraft: null,
};
const preview: ImportPreviewV1 = {
  file: exportFile,
  exportedAt,
  workCount: 1,
  catalogVersion: exportFile.catalogVersion,
  catalogVersionMismatch: true,
  profileState: "first-run",
};
const appliedResult = {
  kind: "applied" as const,
  mode: "indexeddb" as const,
  readback: {
    counts: {
      userWorks: 1,
      externalWorks: 0,
      profile: 1,
      onboardingDraft: 0,
      recommendationCache: 0,
      providerCache: 0,
    },
    meta: { schemaVersion: 2 as const, catalogVersion: catalog.catalogVersion },
  },
};

beforeEach(() => {
  testState.catalog = catalog;
  testState.deleteAllData.mockReset().mockResolvedValue(appliedResult);
  testState.exportUserData.mockReset().mockResolvedValue(exportFile);
  testState.inspectImportJson.mockReset().mockResolvedValue(preview);
  testState.navigate.mockReset();
  testState.replaceFromExport.mockReset().mockResolvedValue(appliedResult);
  testState.savePolicies.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  testState.userWorks = [];
  testState.externalWorks = [];
});

describe("SettingsFlow layout and storage", () => {
  it("shows every section on one page with a section navigation", () => {
    render(<SettingsFlow activeSection="data" />);

    const navigation = screen.getByRole("navigation", { name: settingsStrings.sections.label });
    expect(
      within(navigation)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual([
      settingsStrings.sections.items.policies,
      settingsStrings.sections.items.dna,
      settingsStrings.sections.items.data,
      settingsStrings.sections.items.danger,
      settingsStrings.sections.items.app,
    ]);
    expect(
      within(navigation)
        .getByRole("link", { name: settingsStrings.sections.items.data })
        .getAttribute("aria-current"),
    ).toBe("location");
    expect(screen.queryByRole("tablist")).toBeNull();
    for (const title of [
      settingsStrings.policies.title,
      settingsStrings.dna.title,
      settingsStrings.data.title,
      settingsStrings.danger.title,
      settingsStrings.app.title,
    ]) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeTruthy();
    }
  });

  it("shows record counts and protects local data from eviction on request", async () => {
    testState.userWorks = [{ workId: "a" }, { workId: "b" }, { workId: "c" }];
    testState.externalWorks = [{ id: "x" }];
    const persist = vi.fn().mockResolvedValue(true);
    vi.stubGlobal("navigator", {
      ...navigator,
      storage: {
        estimate: vi.fn().mockResolvedValue({ usage: 2 * 1024 * 1024 }),
        persist,
        persisted: vi.fn().mockResolvedValue(false),
      },
    });

    render(<SettingsFlow />);

    const strings = settingsStrings.storageStatus;
    expect(await screen.findByText(strings.notPersisted)).toBeTruthy();
    expect(
      screen.getByText(new RegExp(strings.records(3, 1).replace(/[()（）]/gu, "."), "u")),
    ).toBeTruthy();
    expect(screen.getByText(/使用容量 約2 MB/u)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: strings.protect }));
    expect(await screen.findByText(strings.persisted)).toBeTruthy();
    expect(persist).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: strings.protect })).toBeNull();
  });

  it("explains a denied protection request without claiming success", async () => {
    vi.stubGlobal("navigator", {
      ...navigator,
      storage: {
        estimate: vi.fn().mockResolvedValue({}),
        persist: vi.fn().mockResolvedValue(false),
        persisted: vi.fn().mockResolvedValue(false),
      },
    });

    render(<SettingsFlow />);

    fireEvent.click(
      await screen.findByRole("button", { name: settingsStrings.storageStatus.protect }),
    );
    expect(await screen.findByText(settingsStrings.storageStatus.denied)).toBeTruthy();
    expect(screen.queryByText(settingsStrings.storageStatus.persisted)).toBeNull();
  });
});

describe("SettingsFlow data ownership", () => {
  it("keeps export and import in the data card and moves deletion to a separate danger card", () => {
    render(<SettingsFlow />);

    const dataPanel = screen
      .getByRole("heading", { level: 2, name: settingsStrings.data.title })
      .closest("section");
    const dangerPanel = screen
      .getByRole("heading", { level: 2, name: settingsStrings.danger.title })
      .closest("section");
    if (dataPanel === null || dangerPanel === null) throw new Error("Missing settings card");

    expect(
      within(dataPanel).getByRole("button", { name: settingsStrings.data.export.action }),
    ).toBeTruthy();
    expect(
      within(dataPanel).getByLabelText(settingsStrings.data.import.select, { selector: "input" }),
    ).toBeTruthy();
    expect(
      within(dataPanel).queryByRole("button", { name: settingsStrings.data.delete.action }),
    ).toBeNull();
    expect(
      within(dangerPanel).getByRole("button", { name: settingsStrings.data.delete.action }),
    ).toBeTruthy();
    expect(dangerPanel.id).toBe("settings-section-danger");
  });

  it("offers an export from the danger card before deleting", async () => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:export");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    render(<SettingsFlow />);

    fireEvent.click(screen.getByRole("button", { name: settingsStrings.danger.exportFirst }));

    await waitFor(() => expect(testState.exportUserData).toHaveBeenCalledTimes(1));
    expect(testState.deleteAllData).not.toHaveBeenCalled();
  });

  it("confirms the exact conflicting draft selections before downloading a recovery backup", async () => {
    const entries = [{ workId: catalog.works[0]!.id, reaction: "liked" as const }];
    testState.exportUserData.mockRejectedValueOnce(new ExportDraftConflictError(entries));
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:export");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const download = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);
    render(<SettingsFlow />);

    fireEvent.click(screen.getByRole("button", { name: settingsStrings.data.export.action }));
    const dialog = await screen.findByRole("dialog", {
      name: settingsStrings.data.export.recovery.title,
    });
    expect(within(dialog).getByText(catalog.works[0]!.title, { exact: false })).toBeTruthy();
    expect(download).not.toHaveBeenCalled();
    fireEvent.click(within(dialog).getByRole("button", { name: settingsStrings.dialog.cancel }));
    expect(testState.exportUserData).toHaveBeenCalledTimes(1);

    testState.exportUserData.mockRejectedValueOnce(new ExportDraftConflictError(entries));
    fireEvent.click(screen.getByRole("button", { name: settingsStrings.data.export.action }));
    const retryDialog = await screen.findByRole("dialog", {
      name: settingsStrings.data.export.recovery.title,
    });
    fireEvent.click(
      within(retryDialog).getByRole("button", {
        name: settingsStrings.data.export.recovery.action,
      }),
    );
    await waitFor(() => expect(download).toHaveBeenCalledTimes(1));
    expect(testState.exportUserData.mock.calls[2]?.[2]).toEqual(entries);
    expect(testState.replaceFromExport).not.toHaveBeenCalled();
    expect(testState.deleteAllData).not.toHaveBeenCalled();
  });

  it("drops the unset license row from the app information", () => {
    render(<SettingsFlow />);

    expect(screen.queryByText("ライセンス")).toBeNull();
    expect(screen.getByRole("link", { name: settingsStrings.app.showIntroduction })).toBeTruthy();
  });

  it("discloses the conditional affiliate relationship without exposing configuration", () => {
    render(<SettingsFlow />);

    expect(screen.getByText(settingsStrings.app.affiliateLabel)).toBeTruthy();
    expect(screen.getByText(settingsStrings.app.affiliateRelationship)).toBeTruthy();
  });

  it("downloads the versioned export through the exact current Catalog identity", async () => {
    const createObjectUrl = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:export");
    const revokeObjectUrl = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    let downloadedFilename = "";
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      downloadedFilename = this.download;
    });
    render(<SettingsFlow />);

    fireEvent.click(screen.getByRole("button", { name: settingsStrings.data.export.action }));

    await waitFor(() => expect(testState.exportUserData).toHaveBeenCalledTimes(1));
    expect(testState.exportUserData.mock.calls[0]?.[1]).toEqual({
      catalogVersion: catalog.catalogVersion,
      workIds: catalog.works.map((work) => work.id),
      profileWorkIds: catalog.works
        .filter((work) => work.eligibility.recommendationEligible)
        .map((work) => work.id),
    });
    expect(downloadedFilename).toMatch(/^konocomics-export-\d{8}\.json$/u);
    expect(createObjectUrl).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:export");
  });

  it("validates locally, shows the required preview, then opens a separate replacement confirmation", async () => {
    render(<SettingsFlow />);
    const file = new File(["{}"], "backup.json", { type: "application/json" });
    Object.defineProperty(file, "text", { value: vi.fn().mockResolvedValue("{}") });

    fireEvent.change(
      screen.getByLabelText(settingsStrings.data.import.select, { selector: "input" }),
      { target: { files: [file] } },
    );

    await waitFor(() => expect(testState.inspectImportJson).toHaveBeenCalledTimes(1));
    expect(screen.getByText(settingsStrings.data.import.preview.workCount(1))).toBeTruthy();
    expect(screen.getByText(settingsStrings.data.import.verified("backup.json"))).toBeTruthy();
    expect(
      screen.getByText(
        settingsStrings.data.import.preview.catalogMismatch(
          exportFile.catalogVersion,
          catalog.catalogVersion,
        ),
      ),
    ).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: settingsStrings.data.import.reviewReplacement }),
    );
    const dialog = screen.getByRole("dialog", {
      name: settingsStrings.data.import.confirm.title,
    });
    expect(dialog).toBeTruthy();
    fireEvent.click(
      screen.getByRole("button", { name: settingsStrings.data.import.confirm.action }),
    );

    await waitFor(() =>
      expect(testState.replaceFromExport).toHaveBeenCalledWith(exportFile, {
        catalogVersion: catalog.catalogVersion,
        workIds: catalog.works.map((work) => work.id),
        profileWorkIds: catalog.works
          .filter((work) => work.eligibility.recommendationEligible)
          .map((work) => work.id),
      }),
    );
    expect(await screen.findByText(settingsStrings.data.import.success)).toBeTruthy();
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByLabelText(settingsStrings.data.import.select, { selector: "input" }),
      ),
    );
  });

  it("shows the received unsupported version and never opens replacement for an invalid file", async () => {
    testState.inspectImportJson.mockRejectedValue(
      new DataTransferError("unsupported-schema-version", "newer schema", {
        receivedVersion: 2,
      }),
    );
    render(<SettingsFlow />);
    const file = new File(["{}"], "future.json", { type: "application/json" });
    Object.defineProperty(file, "text", { value: vi.fn().mockResolvedValue("{}") });

    fireEvent.change(
      screen.getByLabelText(settingsStrings.data.import.select, { selector: "input" }),
      { target: { files: [file] } },
    );

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe(
        settingsStrings.data.errors.unsupportedVersion(2),
      ),
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(testState.replaceFromExport).not.toHaveBeenCalled();
  });

  it("states that an applied session-only import will be lost on reload", async () => {
    testState.replaceFromExport.mockResolvedValue({
      ...appliedResult,
      mode: "session-only",
    });
    render(<SettingsFlow />);
    const file = new File(["{}"], "session.json", { type: "application/json" });
    Object.defineProperty(file, "text", { value: vi.fn().mockResolvedValue("{}") });

    fireEvent.change(
      screen.getByLabelText(settingsStrings.data.import.select, { selector: "input" }),
      { target: { files: [file] } },
    );
    await waitFor(() => expect(testState.inspectImportJson).toHaveBeenCalledTimes(1));
    fireEvent.click(
      screen.getByRole("button", { name: settingsStrings.data.import.reviewReplacement }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: settingsStrings.data.import.confirm.action }),
    );

    expect(await screen.findByText(settingsStrings.data.import.successSessionOnly)).toBeTruthy();
  });

  it("requires the exact typed keyword before deleting and redirects only after readback success", async () => {
    render(<SettingsFlow />);

    fireEvent.click(screen.getByRole("button", { name: settingsStrings.data.delete.action }));
    const confirmation = screen.getByLabelText(settingsStrings.data.delete.confirm.label);
    const submit = screen.getByRole("button", {
      name: settingsStrings.data.delete.confirm.action,
    });
    expect((submit as HTMLButtonElement).disabled).toBe(true);

    fireEvent.change(confirmation, { target: { value: "削 除" } });
    expect((submit as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(confirmation, { target: { value: settingsStrings.data.delete.keyword } });
    expect((submit as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(submit);

    await waitFor(() =>
      expect(testState.deleteAllData).toHaveBeenCalledWith(catalog.catalogVersion),
    );
    expect(testState.navigate).toHaveBeenCalledWith({ to: "/", replace: true });
  });

  it("keeps the delete dialog open and does not redirect when mutation readback is indeterminate", async () => {
    testState.deleteAllData.mockResolvedValue({
      kind: "indeterminate",
      operation: "delete",
      recovery: "reload",
    });
    render(<SettingsFlow />);

    fireEvent.click(screen.getByRole("button", { name: settingsStrings.data.delete.action }));
    fireEvent.change(screen.getByLabelText(settingsStrings.data.delete.confirm.label), {
      target: { value: settingsStrings.data.delete.keyword },
    });
    fireEvent.click(
      screen.getByRole("button", { name: settingsStrings.data.delete.confirm.action }),
    );

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe(settingsStrings.data.errors.indeterminate),
    );
    expect(screen.getByRole("alertdialog")).toBeTruthy();
    expect(testState.navigate).not.toHaveBeenCalled();
  });

  it("keeps Settings open and warns that a session-only delete may return after reload", async () => {
    testState.deleteAllData.mockResolvedValue({
      ...appliedResult,
      mode: "session-only",
      readback: {
        ...appliedResult.readback,
        counts: {
          userWorks: 0,
          externalWorks: 0,
          profile: 0,
          onboardingDraft: 0,
          recommendationCache: 0,
          providerCache: 0,
        },
      },
    });
    render(<SettingsFlow />);

    fireEvent.click(screen.getByRole("button", { name: settingsStrings.data.delete.action }));
    fireEvent.change(screen.getByLabelText(settingsStrings.data.delete.confirm.label), {
      target: { value: settingsStrings.data.delete.keyword },
    });
    fireEvent.click(
      screen.getByRole("button", { name: settingsStrings.data.delete.confirm.action }),
    );

    expect(await screen.findByText(settingsStrings.data.delete.successSessionOnly)).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(testState.navigate).not.toHaveBeenCalled();
  });
});
