"use client";

import { useCallback } from "react";

import {
  createExternalWorkDetailHref,
  parseExternalWorkId,
  type ExternalWorkId,
} from "@/domain/catalog/external-work";
import type { Work } from "@/domain/catalog/types";
import type { UserWorkRecord } from "@/domain/profile/types";
import { useCatalog } from "@/features/catalog/catalog-provider";
import {
  createPlannedExternalWorkRecord,
  type ExternalWorkRecord,
  usePersistence,
} from "@/infrastructure/db";
import type { RakutenBookItem } from "@/infrastructure/rakuten";

import { LibraryView } from "./library-view";
import type { LibraryAddOutcome } from "./work-search-sheet";

function nowIso() {
  return new Date().toISOString();
}

export function LibraryFlow() {
  const catalog = useCatalog();
  const {
    status,
    userWorks,
    externalWorks,
    addUserWorkIfAbsent,
    addExternalWorkIfAbsent,
    saveUserWork,
    saveExternalUserRecord,
  } = usePersistence();

  const addCatalogWork = useCallback(
    async (work: Work): Promise<LibraryAddOutcome> => {
      const result = await addUserWorkIfAbsent({
        workId: work.id,
        readingState: "planned",
        updatedAt: nowIso(),
      });
      return result.kind;
    },
    [addUserWorkIfAbsent],
  );

  const addExternalWork = useCallback(
    async (item: RakutenBookItem): Promise<LibraryAddOutcome> => {
      const record = await createPlannedExternalWorkRecord(item, nowIso());
      const result = await addExternalWorkIfAbsent(record);
      return result.kind;
    },
    [addExternalWorkIfAbsent],
  );

  const saveCatalogRecord = useCallback(
    async (record: UserWorkRecord) => {
      await saveUserWork(record);
    },
    [saveUserWork],
  );

  const saveExternalRecord = useCallback(
    async (
      id: ExternalWorkId,
      expectedNormalizedKey: string,
      record: ExternalWorkRecord["record"],
    ) => {
      await saveExternalUserRecord(id, expectedNormalizedKey, record);
    },
    [saveExternalUserRecord],
  );

  return (
    <LibraryView
      addCatalogWork={addCatalogWork}
      addExternalWork={addExternalWork}
      catalog={catalog}
      externalHref={(id) => createExternalWorkDetailHref(parseExternalWorkId(id))}
      externalWorks={externalWorks}
      saveExternalUserRecord={saveExternalRecord}
      saveUserWork={saveCatalogRecord}
      storageDegraded={status.state === "degraded"}
      userWorks={userWorks}
    />
  );
}
