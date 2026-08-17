"use client";

import { useNavigate } from "@tanstack/react-router";
import { type ChangeEvent, useRef, useState } from "react";

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
import { Button } from "@/components/design-system/button";
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
import { settingsStrings } from "@/lib/strings";

import { SettingsDialog } from "./settings-dialog";

type DataSettingsProps = Readonly<{
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

  const handleExport = async () => {
    if (!beginMutation("export")) return;
    const exportedAt = new Date().toISOString();
    try {
      const file = await exportUserData(exportedAt, currentCatalog);
      triggerDownload(file, exportedAt);
    } catch (nextError) {
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
      setPreview(nextPreview);
    } catch (nextError) {
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

  return (
    <section
      className="grid min-w-0 gap-[var(--space-5)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-5)]"
      aria-labelledby="settings-data-title"
    >
      <div className="grid gap-[var(--space-content)]">
        <h2 className="text-text-strong" id="settings-data-title">
          {settingsStrings.data.title}
        </h2>
        <p className="text-text-muted">{settingsStrings.data.description}</p>
      </div>

      <div className="grid">
        <div className="mt-[var(--space-3)] grid gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-4)]">
          <div className="grid gap-[var(--space-content-tight)]">
            <h3>{settingsStrings.data.export.title}</h3>
            <p className="text-text-muted">{settingsStrings.data.export.description}</p>
          </div>
          <Button
            className="w-fit"
            disabled={busyAction !== null}
            onClick={() => void handleExport()}
            type="button"
            variant="outline"
          >
            {busyAction === "export"
              ? settingsStrings.data.export.exporting
              : settingsStrings.data.export.action}
          </Button>
        </div>

        <div className="mt-[var(--space-3)] grid gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line bg-surface-2 p-[var(--space-4)]">
          <div className="grid gap-[var(--space-content-tight)]">
            <h3>{settingsStrings.data.import.title}</h3>
            <p className="text-text-muted">{settingsStrings.data.import.description}</p>
          </div>
          <label className="relative w-fit cursor-pointer has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-45">
            <input
              accept=".json,application/json"
              className="peer absolute size-px opacity-0"
              disabled={busyAction !== null}
              id="settings-import-file"
              onChange={(event) => void handleImportFile(event)}
              ref={fileInputRef}
              type="file"
            />
            <span className="inline-flex min-h-[var(--control-min-size)] w-fit items-center justify-center rounded-[var(--radius-control)] border border-line bg-surface-1 px-[var(--space-4)] py-[var(--space-content)] text-center font-bold text-text-strong peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring [@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-3">
              {busyAction === "inspect"
                ? settingsStrings.data.import.inspecting
                : settingsStrings.data.import.select}
            </span>
          </label>
          {preview === null ? null : (
            <div
              className="grid gap-[var(--space-4)] rounded-[var(--radius-card)] border border-line bg-surface-1 p-[var(--space-4)]"
              data-import-state="ready"
            >
              <h4>{settingsStrings.data.import.preview.title}</h4>
              <dl className="m-0 grid [&>div]:grid [&>div]:grid-cols-[minmax(0,1fr)_auto] [&>div]:gap-[var(--space-4)] [&>div]:border-t [&>div]:border-line [&>div]:py-[var(--space-3)] [&_dd]:m-0 [&_dd]:text-end [&_dt]:text-text-muted">
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
                <p className="settings-import-preview__warning border-l-[length:var(--space-1)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]">
                  {settingsStrings.data.import.preview.catalogMismatch(
                    preview.catalogVersion,
                    currentCatalog.catalogVersion,
                  )}
                </p>
              ) : null}
              <Button
                className="w-fit"
                disabled={busyAction !== null}
                onClick={(event) => openReplaceDialog(event.currentTarget)}
                type="button"
                variant="outline"
              >
                {settingsStrings.data.import.reviewReplacement}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-[var(--space-3)] grid gap-[var(--space-3)] rounded-[var(--radius-card)] border border-line-danger bg-surface-2 p-[var(--space-4)]">
          <div className="grid gap-[var(--space-content-tight)]">
            <h3>{settingsStrings.data.delete.title}</h3>
            <p className="text-text-muted">{settingsStrings.data.delete.description}</p>
          </div>
          <Button
            className="w-fit"
            disabled={busyAction !== null}
            onClick={(event) => openDeleteDialog(event.currentTarget)}
            type="button"
            variant="destructive"
          >
            {settingsStrings.data.delete.action}
          </Button>
        </div>
      </div>

      {busyAction === "inspect" ? (
        <p className="text-[length:var(--text-caption-size)] text-text-muted" role="status">
          {settingsStrings.data.import.inspecting}
        </p>
      ) : null}
      {error === null || dialog !== null ? null : (
        <p
          className="border-l-[length:var(--space-1)] border-warn bg-surface-1 px-[var(--space-4)] py-[var(--space-3)]"
          role="alert"
        >
          {error}
        </p>
      )}
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
            <AlertDialogTitle id="settings-delete-title">
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
    </section>
  );
}
