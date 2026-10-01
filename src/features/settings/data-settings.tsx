"use client";

import { useNavigate } from "@tanstack/react-router";
import {
  CircleCheckIcon,
  DownloadIcon,
  FileUpIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react";
import { type ChangeEvent, type ReactNode, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/design-system/alert-dialog";
import { Button, buttonClassName } from "@/components/design-system/button";
import { Input } from "@/components/design-system/input";
import {
  DataTransferError,
  exportFilenameV1,
  serializeExportFileV1,
  type CurrentCatalogIdentity,
  type DataMutationResult,
  type ExportFileV1,
  type ImportPreviewV1,
} from "@/infrastructure/db";
import { resetMoodSession } from "@/features/recommendations/mood-session";
import { settingsStrings } from "@/lib/strings";

import { SettingsDialog } from "./settings-dialog";
import { SettingsNotice, SettingsPanel, SettingsRow } from "./settings-panel";

type DataSettingsProps = Readonly<{
  /** Leading rows (for example the storage status) shown before export. Renders the data and danger cards. */
  children?: ReactNode;
  currentCatalog: CurrentCatalogIdentity;
  deleteAllData(currentCatalogVersion: string): Promise<DataMutationResult>;
  exportUserData(exportedAt: string, currentCatalog: CurrentCatalogIdentity): Promise<ExportFileV1>;
  inspectImportJson(
    jsonText: string,
    currentCatalog: CurrentCatalogIdentity,
  ): Promise<ImportPreviewV1>;
  replaceFromExport(
    file: ExportFileV1,
    currentCatalog: CurrentCatalogIdentity,
  ): Promise<DataMutationResult>;
}>;

type DialogState =
  | Readonly<{ kind: "replace"; opener: HTMLElement | null }>
  | Readonly<{ kind: "delete"; opener: HTMLElement | null }>
  | null;

const exportedAtFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "long",
  timeStyle: "short",
});

function transferErrorMessage(error: unknown): string {
  if (!(error instanceof DataTransferError)) {
    return settingsStrings.data.errors.unknown;
  }

  switch (error.code) {
    case "invalid-json":
      return settingsStrings.data.errors.invalidJson;
    case "invalid-format":
      return settingsStrings.data.errors.invalidFormat(error.details);
    case "unsupported-schema-version":
      return settingsStrings.data.errors.unsupportedVersion(error.receivedVersion);
    case "unsupported-external-identity-version":
      return settingsStrings.data.errors.unsupportedExternalIdentity(error.receivedVersion);
    case "external-identity-invalid":
      return settingsStrings.data.errors.externalIdentity(error.details);
    case "incompatible-profile-state":
      return settingsStrings.data.errors.incompatibleProfile(error.details);
  }

  return settingsStrings.data.errors.unknown;
}

function triggerDownload(file: ExportFileV1, exportedAt: string) {
  const blob = new Blob([serializeExportFileV1(file)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.download = exportFilenameV1(exportedAt);
  anchor.href = url;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function DataSettings({
  children,
  currentCatalog,
  deleteAllData,
  exportUserData,
  inspectImportJson,
  replaceFromExport,
}: DataSettingsProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mutationFence = useRef(false);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [preview, setPreview] = useState<ImportPreviewV1 | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [busyAction, setBusyAction] = useState<"export" | "inspect" | "replace" | "delete" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  /** Where an error outside a dialog is shown: next to the control that caused it. */
  const [errorAt, setErrorAt] = useState<"export" | "import" | "danger">("export");
  const [exportOrigin, setExportOrigin] = useState<"data" | "danger">("data");
  const [previewFilename, setPreviewFilename] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const beginMutation = (action: Exclude<NonNullable<typeof busyAction>, "inspect">) => {
    if (mutationFence.current) return false;
    mutationFence.current = true;
    setBusyAction(action);
    setError(null);
    setSuccess(null);
    return true;
  };

  const finishMutation = () => {
    mutationFence.current = false;
    setBusyAction(null);
  };

  const handleExport = async (origin: "data" | "danger") => {
    if (!beginMutation("export")) return;
    setExportOrigin(origin);
    const exportedAt = new Date().toISOString();
    try {
      const file = await exportUserData(exportedAt, currentCatalog);
      triggerDownload(file, exportedAt);
    } catch (nextError) {
      setErrorAt(origin === "danger" ? "danger" : "export");
      setError(transferErrorMessage(nextError));
    } finally {
      finishMutation();
    }
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const selectedFile = input.files?.[0];
    setPreview(null);
    setError(null);
    setSuccess(null);
    if (selectedFile === undefined) return;
    if (mutationFence.current) return;
    mutationFence.current = true;
    setBusyAction("inspect");
    try {
      const nextPreview = await inspectImportJson(await selectedFile.text(), currentCatalog);
      setPreviewFilename(selectedFile.name);
      setPreview(nextPreview);
    } catch (nextError) {
      setErrorAt("import");
      setError(transferErrorMessage(nextError));
    } finally {
      mutationFence.current = false;
      setBusyAction(null);
      input.value = "";
    }
  };

  const openReplaceDialog = (opener: HTMLElement) => {
    if (preview !== null && !mutationFence.current) {
      setDialog({ kind: "replace", opener });
      setError(null);
    }
  };

  const handleReplace = async () => {
    if (preview === null || !beginMutation("replace")) return;
    try {
      const result = await replaceFromExport(preview.file, currentCatalog);
      if (result.kind === "indeterminate") {
        setError(settingsStrings.data.errors.indeterminate);
        return;
      }
      resetMoodSession();
      setDialog(null);
      setPreview(null);
      if (fileInputRef.current !== null) fileInputRef.current.value = "";
      setSuccess(
        result.mode === "session-only"
          ? settingsStrings.data.import.successSessionOnly
          : settingsStrings.data.import.success,
      );
    } catch (nextError) {
      setError(transferErrorMessage(nextError));
    } finally {
      finishMutation();
    }
  };

  const openDeleteDialog = (opener: HTMLElement) => {
    if (mutationFence.current) return;
    setDeleteConfirmation("");
    setError(null);
    setDialog({ kind: "delete", opener });
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== settingsStrings.data.delete.keyword || !beginMutation("delete")) {
      return;
    }
    try {
      const result = await deleteAllData(currentCatalog.catalogVersion);
      if (result.kind === "indeterminate") {
        setError(settingsStrings.data.errors.indeterminate);
        return;
      }
      resetMoodSession();
      setDialog(null);
      setPreview(null);
      setDeleteConfirmation("");
      if (result.mode === "session-only") {
        setSuccess(settingsStrings.data.delete.successSessionOnly);
        return;
      }
      await navigate({ to: "/", replace: true });
    } catch (nextError) {
      setError(transferErrorMessage(nextError));
    } finally {
      finishMutation();
    }
  };

  const closeDialog = () => {
    if (mutationFence.current) return;
    setDialog(null);
    setDeleteConfirmation("");
    setError(null);
  };

  const exportLabel = (origin: "data" | "danger") =>
    busyAction === "export" && exportOrigin === origin
      ? settingsStrings.data.export.exporting
      : origin === "data"
        ? settingsStrings.data.export.action
        : settingsStrings.danger.exportFirst;

  return (
    <>
      <SettingsPanel
        description={settingsStrings.data.description}
        headingId="settings-data-title"
        id="settings-section-data"
        title={settingsStrings.data.title}
      >
        <div className="grid min-w-0 gap-[var(--space-5)]">
          {children}
          <SettingsRow
            action={
              <Button
                className="w-full sm:w-fit"
                disabled={busyAction !== null}
                onClick={() => void handleExport("data")}
                type="button"
                variant="outline"
              >
                <DownloadIcon aria-hidden="true" />
                {exportLabel("data")}
              </Button>
            }
            description={<p>{settingsStrings.data.export.description}</p>}
            title={settingsStrings.data.export.title}
          >
            {error !== null && dialog === null && errorAt === "export" ? (
              <SettingsNotice tone="error">{error}</SettingsNotice>
            ) : null}
          </SettingsRow>

          <SettingsRow
            action={
              <label className="relative w-full cursor-pointer has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-45 sm:w-fit">
                <input
                  accept=".json,application/json"
                  className="peer absolute size-px opacity-0"
                  disabled={busyAction !== null}
                  id="settings-import-file"
                  onChange={(event) => void handleImportFile(event)}
                  ref={fileInputRef}
                  type="file"
                />
                <span
                  className={buttonClassName({
                    className:
                      "pointer-events-none w-full gap-[var(--space-content)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring sm:w-fit",
                    variant: "outline",
                  })}
                >
                  <FileUpIcon aria-hidden="true" />
                  {busyAction === "inspect"
                    ? settingsStrings.data.import.inspecting
                    : settingsStrings.data.import.select}
                </span>
              </label>
            }
            description={<p>{settingsStrings.data.import.description}</p>}
            title={settingsStrings.data.import.title}
          >
            {busyAction === "inspect" ? (
              <SettingsNotice tone="progress">
                {settingsStrings.data.import.inspecting}
              </SettingsNotice>
            ) : null}
            {error !== null && dialog === null && errorAt === "import" ? (
              <SettingsNotice tone="error">{error}</SettingsNotice>
            ) : null}
            {preview === null ? null : (
              <div
                className="grid min-w-0 gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line-accent-subtle bg-surface-2 p-[var(--space-4)] md:p-[var(--space-5)]"
                data-import-state="ready"
              >
                <div className="grid min-w-0 gap-[var(--space-content-tight)]">
                  <h4 className="flex min-w-0 items-center gap-[var(--space-content)] text-text-strong">
                    <CircleCheckIcon
                      aria-hidden="true"
                      className="size-[var(--space-4)] shrink-0 text-accent"
                    />
                    {settingsStrings.data.import.preview.title}
                  </h4>
                  {previewFilename === "" ? null : (
                    <p className="text-[length:var(--font-size-14)] text-text-muted [overflow-wrap:anywhere]">
                      {settingsStrings.data.import.verified(previewFilename)}
                    </p>
                  )}
                </div>
                <dl className="m-0 grid min-w-0 text-[length:var(--font-size-14)] [&>div]:grid [&>div]:grid-cols-[minmax(0,1fr)_auto] [&>div]:gap-[var(--space-4)] [&>div]:border-t [&>div]:border-line [&>div]:py-[var(--space-3)] [&_dd]:m-0 [&_dd]:text-end [&_dd]:text-text-strong [&_dt]:text-text-muted">
                  <div>
                    <dt>{settingsStrings.data.import.preview.exportedAtLabel}</dt>
                    <dd>{exportedAtFormatter.format(new Date(preview.exportedAt))}</dd>
                  </div>
                  <div>
                    <dt>{settingsStrings.data.import.preview.workCountLabel}</dt>
                    <dd>{settingsStrings.data.import.preview.workCount(preview.workCount)}</dd>
                  </div>
                </dl>
                {preview.catalogVersionMismatch ? (
                  <p className="settings-import-preview__warning border-l-[length:var(--space-1)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)] [overflow-wrap:anywhere]">
                    {settingsStrings.data.import.preview.catalogMismatch(
                      preview.catalogVersion,
                      currentCatalog.catalogVersion,
                    )}
                  </p>
                ) : null}
                <Button
                  className="w-full sm:w-fit"
                  disabled={busyAction !== null}
                  onClick={(event) => openReplaceDialog(event.currentTarget)}
                  type="button"
                >
                  {settingsStrings.data.import.reviewReplacement}
                </Button>
              </div>
            )}
          </SettingsRow>
        </div>
      </SettingsPanel>

      <SettingsPanel
        description={settingsStrings.danger.description}
        headingId="settings-danger-title"
        icon={<TriangleAlertIcon aria-hidden="true" className="size-[var(--space-5)] shrink-0" />}
        id="settings-section-danger"
        title={settingsStrings.danger.title}
        tone="danger"
      >
        <div className="grid min-w-0 gap-[var(--space-4)] border-t border-line-danger pt-[var(--space-5)] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="grid min-w-0 gap-[var(--space-content-tight)]">
            <h3 className="text-[length:var(--font-size-16)] text-text-strong">
              {settingsStrings.data.delete.title}
            </h3>
            <p className="text-[length:var(--font-size-14)] text-text-muted [overflow-wrap:anywhere]">
              {settingsStrings.data.delete.description}
            </p>
          </div>
          <div className="flex flex-col gap-[var(--space-content)] sm:flex-row sm:items-center">
            <Button
              className="w-full sm:w-fit"
              disabled={busyAction !== null}
              onClick={() => void handleExport("danger")}
              type="button"
              variant="outline"
            >
              <DownloadIcon aria-hidden="true" />
              {exportLabel("danger")}
            </Button>
            <Button
              className="w-full border-line-danger sm:w-fit"
              disabled={busyAction !== null}
              onClick={(event) => openDeleteDialog(event.currentTarget)}
              type="button"
              variant="destructive"
            >
              <Trash2Icon aria-hidden="true" />
              {settingsStrings.data.delete.action}
            </Button>
          </div>
          {error !== null && dialog === null && errorAt === "danger" ? (
            <div className="sm:col-span-2">
              <SettingsNotice tone="error">{error}</SettingsNotice>
            </div>
          ) : null}
        </div>
      </SettingsPanel>

      {success === null ? null : (
        <p
          className="fixed right-[var(--layout-page-padding)] bottom-[calc(var(--layout-mobile-navigation-clearance)+var(--space-4))] left-[var(--layout-page-padding)] z-65 mx-auto w-fit max-w-[calc(100%-(var(--layout-page-padding)*2))] rounded-[var(--radius-control)] border border-line bg-surface-1 px-[var(--space-4)] py-[var(--space-3)] text-text-strong shadow-[var(--shadow-raised)]"
          role="status"
        >
          {success}
        </p>
      )}

      {dialog?.kind === "replace" && preview !== null ? (
        <SettingsDialog
          busy={busyAction === "replace"}
          fallbackFocusId="settings-import-file"
          initialFocusId="settings-replace-cancel"
          labelledBy="settings-replace-title"
          onClose={closeDialog}
          opener={dialog.opener}
        >
          <div className="grid gap-[var(--space-content)]">
            <h2 id="settings-replace-title">{settingsStrings.data.import.confirm.title}</h2>
            <p className="text-text-muted">{settingsStrings.data.import.confirm.description}</p>
          </div>
          {busyAction === "replace" ? (
            <p className="text-[length:var(--text-caption-size)] text-text-muted" role="status">
              {settingsStrings.data.import.confirm.replacing}
            </p>
          ) : null}
          {error === null ? null : (
            <p
              className="border-l-[length:var(--space-1)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-[var(--space-content)]">
            <Button
              disabled={busyAction === "replace"}
              id="settings-replace-cancel"
              onClick={closeDialog}
              type="button"
              variant="outline"
            >
              {settingsStrings.dialog.cancel}
            </Button>
            <Button
              disabled={busyAction === "replace"}
              onClick={() => void handleReplace()}
              type="button"
            >
              {busyAction === "replace"
                ? settingsStrings.data.import.confirm.replacing
                : settingsStrings.data.import.confirm.action}
            </Button>
          </div>
        </SettingsDialog>
      ) : null}

      <AlertDialog
        open={dialog?.kind === "delete"}
        onOpenChange={(open) => {
          if (!open && busyAction !== "delete") closeDialog();
        }}
      >
        <AlertDialogContent
          className="fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-(var(--layout-page-padding)*2)-var(--layout-safe-area-bottom))] w-[min(100%,var(--layout-width-form))] max-w-[var(--layout-width-form)] -translate-x-1/2 -translate-y-1/2 gap-[var(--space-5)] overflow-y-auto rounded-[var(--radius-card)] bg-surface-1 p-[var(--space-6)] !transition-none data-[size=default]:max-w-[var(--layout-width-form)] data-[size=default]:sm:max-w-[var(--layout-width-form)] data-closed:!animate-none data-open:!animate-none sm:max-w-[var(--layout-width-form)]"
          initialFocus={() => document.getElementById("settings-delete-confirmation")}
        >
          <AlertDialogHeader className="grid grid-rows-none place-items-stretch gap-[var(--space-content)] text-start">
            <AlertDialogTitle
              className="flex items-center gap-[var(--space-content)]"
              id="settings-delete-title"
            >
              <TriangleAlertIcon
                aria-hidden="true"
                className="size-[var(--space-5)] shrink-0 text-danger"
              />
              {settingsStrings.data.delete.confirm.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {settingsStrings.data.delete.confirm.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <label
            className="grid gap-[var(--space-content)] font-bold"
            htmlFor="settings-delete-confirmation"
          >
            <span>{settingsStrings.data.delete.confirm.label}</span>
            <Input
              autoComplete="off"
              className="text-text-strong"
              disabled={busyAction === "delete"}
              id="settings-delete-confirmation"
              onChange={(event) => setDeleteConfirmation(event.currentTarget.value)}
              spellCheck={false}
              type="text"
              value={deleteConfirmation}
            />
          </label>
          {busyAction === "delete" ? (
            <p className="text-[length:var(--text-caption-size)] text-text-muted" role="status">
              {settingsStrings.data.delete.confirm.deleting}
            </p>
          ) : null}
          {error === null ? null : (
            <p
              className="border-l-[length:var(--space-1)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
              role="alert"
            >
              {error}
            </p>
          )}
          <AlertDialogFooter className="m-0 flex flex-row flex-wrap justify-end gap-[var(--space-content)] rounded-none border-0 bg-transparent p-0">
            <AlertDialogCancel disabled={busyAction === "delete"} onClick={closeDialog}>
              {settingsStrings.dialog.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              busy={busyAction === "delete"}
              disabled={
                deleteConfirmation !== settingsStrings.data.delete.keyword ||
                busyAction === "delete"
              }
              onClick={() => void handleDelete()}
              type="button"
              variant="destructive"
            >
              {busyAction === "delete"
                ? settingsStrings.data.delete.confirm.deleting
                : settingsStrings.data.delete.confirm.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
