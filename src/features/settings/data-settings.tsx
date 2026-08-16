"use client";

import { useRouter } from "next/navigation";
import { type ChangeEvent, useRef, useState } from "react";

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
  const router = useRouter();
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
      router.replace("/");
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
    <section className="settings-section" aria-labelledby="settings-data-title">
      <div className="settings-section__header">
        <h2 id="settings-data-title">{settingsStrings.data.title}</h2>
        <p>{settingsStrings.data.description}</p>
      </div>

      <div className="settings-actions">
        <div className="settings-action-row">
          <div>
            <h3>{settingsStrings.data.export.title}</h3>
            <p>{settingsStrings.data.export.description}</p>
          </div>
          <button
            className="settings-button settings-button--secondary interactive-press"
            disabled={busyAction !== null}
            onClick={() => void handleExport()}
            type="button"
          >
            {busyAction === "export"
              ? settingsStrings.data.export.exporting
              : settingsStrings.data.export.action}
          </button>
        </div>

        <div className="settings-action-row settings-action-row--stacked">
          <div>
            <h3>{settingsStrings.data.import.title}</h3>
            <p>{settingsStrings.data.import.description}</p>
          </div>
          <label className="settings-file-control">
            <span>
              {busyAction === "inspect"
                ? settingsStrings.data.import.inspecting
                : settingsStrings.data.import.select}
            </span>
            <input
              accept=".json,application/json"
              disabled={busyAction !== null}
              id="settings-import-file"
              onChange={(event) => void handleImportFile(event)}
              ref={fileInputRef}
              type="file"
            />
          </label>
          {preview === null ? null : (
            <div className="settings-import-preview" data-import-state="ready">
              <h4>{settingsStrings.data.import.preview.title}</h4>
              <dl>
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
                <p className="settings-import-preview__warning">
                  {settingsStrings.data.import.preview.catalogMismatch(
                    preview.catalogVersion,
                    currentCatalog.catalogVersion,
                  )}
                </p>
              ) : null}
              <button
                className="settings-button settings-button--secondary interactive-press"
                disabled={busyAction !== null}
                onClick={(event) => openReplaceDialog(event.currentTarget)}
                type="button"
              >
                {settingsStrings.data.import.reviewReplacement}
              </button>
            </div>
          )}
        </div>

        <div className="settings-action-row settings-action-row--danger">
          <div>
            <h3>{settingsStrings.data.delete.title}</h3>
            <p>{settingsStrings.data.delete.description}</p>
          </div>
          <button
            className="settings-button settings-button--danger interactive-press"
            disabled={busyAction !== null}
            onClick={(event) => openDeleteDialog(event.currentTarget)}
            type="button"
          >
            {settingsStrings.data.delete.action}
          </button>
        </div>
      </div>

      {busyAction === "inspect" ? (
        <p className="settings-status" role="status">
          {settingsStrings.data.import.inspecting}
        </p>
      ) : null}
      {error === null || dialog !== null ? null : (
        <p className="settings-inline-error" role="alert">
          {error}
        </p>
      )}
      {success === null ? null : (
        <p className="settings-snackbar" role="status">
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
          <div className="settings-dialog__header">
            <h2 id="settings-replace-title">{settingsStrings.data.import.confirm.title}</h2>
            <p>{settingsStrings.data.import.confirm.description}</p>
          </div>
          {busyAction === "replace" ? (
            <p className="settings-status" role="status">
              {settingsStrings.data.import.confirm.replacing}
            </p>
          ) : null}
          {error === null ? null : (
            <p className="settings-inline-error" role="alert">
              {error}
            </p>
          )}
          <div className="settings-dialog__actions">
            <button
              className="settings-button settings-button--secondary interactive-press"
              disabled={busyAction === "replace"}
              id="settings-replace-cancel"
              onClick={closeDialog}
              type="button"
            >
              {settingsStrings.dialog.cancel}
            </button>
            <button
              className="settings-button settings-button--primary interactive-press"
              disabled={busyAction === "replace"}
              onClick={() => void handleReplace()}
              type="button"
            >
              {busyAction === "replace"
                ? settingsStrings.data.import.confirm.replacing
                : settingsStrings.data.import.confirm.action}
            </button>
          </div>
        </SettingsDialog>
      ) : null}

      {dialog?.kind === "delete" ? (
        <SettingsDialog
          busy={busyAction === "delete"}
          initialFocusId="settings-delete-confirmation"
          labelledBy="settings-delete-title"
          onClose={closeDialog}
          opener={dialog.opener}
        >
          <div className="settings-dialog__header">
            <h2 id="settings-delete-title">{settingsStrings.data.delete.confirm.title}</h2>
            <p>{settingsStrings.data.delete.confirm.description}</p>
          </div>
          <label className="settings-delete-confirmation" htmlFor="settings-delete-confirmation">
            <span>{settingsStrings.data.delete.confirm.label}</span>
            <input
              autoComplete="off"
              disabled={busyAction === "delete"}
              id="settings-delete-confirmation"
              onChange={(event) => setDeleteConfirmation(event.currentTarget.value)}
              spellCheck={false}
              type="text"
              value={deleteConfirmation}
            />
          </label>
          {busyAction === "delete" ? (
            <p className="settings-status" role="status">
              {settingsStrings.data.delete.confirm.deleting}
            </p>
          ) : null}
          {error === null ? null : (
            <p className="settings-inline-error" role="alert">
              {error}
            </p>
          )}
          <div className="settings-dialog__actions">
            <button
              className="settings-button settings-button--secondary interactive-press"
              disabled={busyAction === "delete"}
              onClick={closeDialog}
              type="button"
            >
              {settingsStrings.dialog.cancel}
            </button>
            <button
              className="settings-button settings-button--danger interactive-press"
              disabled={
                deleteConfirmation !== settingsStrings.data.delete.keyword ||
                busyAction === "delete"
              }
              onClick={() => void handleDelete()}
              type="button"
            >
              {busyAction === "delete"
                ? settingsStrings.data.delete.confirm.deleting
                : settingsStrings.data.delete.confirm.action}
            </button>
          </div>
        </SettingsDialog>
      ) : null}
    </section>
  );
}
