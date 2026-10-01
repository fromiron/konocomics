import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { hasCatalogBackedProfile } from "@/domain/profile/catalog-profile";
import type { CatalogV1 } from "@/domain/catalog/types";
import { usePersistence } from "@/infrastructure/db";
import { catalogStrings } from "@/lib/strings";
import { loadCatalogSelection, type CatalogSelection } from "./catalog-assets";
import { CatalogFailure, CatalogProvider } from "./catalog-provider";
import { runtimeManifest } from "./runtime-manifest";

type PersonalCatalogState = {
  key: string;
  selection: CatalogSelection | null;
  guardCatalog: CatalogV1 | null;
  pending: boolean;
  error: boolean;
};
const Context = createContext<PersonalCatalogState | null>(null);
export function PersonalCatalogProvider({ children }: { children: ReactNode }) {
  const { userWorks } = usePersistence();
  const key =
    userWorks === undefined
      ? null
      : JSON.stringify([...new Set(userWorks.map((record) => record.workId))].sort());
  const [state, setState] = useState<PersonalCatalogState>({
    key: "",
    selection: null,
    guardCatalog: null,
    pending: true,
    error: false,
  });
  useEffect(() => {
    if (key === null) return;
    let active = true;
    const ids: string[] = JSON.parse(key);
    void loadCatalogSelection(runtimeManifest, ids)
      .then((selection) => {
        if (active)
          setState({
            key,
            selection,
            guardCatalog: selection.catalog,
            pending: false,
            error: false,
          });
      })
      .catch(() => {
        if (active)
          setState((current) => ({
            ...current,
            key,
            selection: null,
            pending: false,
            error: true,
          }));
      });
    return () => {
      active = false;
    };
  }, [key]);
  const value = useMemo(
    () =>
      state.key === key
        ? state
        : { ...state, key: key ?? "", selection: null, pending: true, error: false },
    [key, state],
  );
  return <Context value={value}>{children}</Context>;
}
export function usePersonalCatalog() {
  const state = useContext(Context);
  if (state === null) throw new Error("Personal Catalog provider is required");
  return state;
}
export function usePersonalProfile() {
  const { userWorks } = usePersistence();
  const { guardCatalog, pending, error } = usePersonalCatalog();
  const knownProfile =
    guardCatalog === null ? undefined : hasCatalogBackedProfile(userWorks, guardCatalog.works);
  return {
    // Newly recorded candidates must not unmount an already proven profile or its dialog.
    error: error && knownProfile !== true,
    hasProfile: knownProfile === true ? true : pending ? undefined : knownProfile,
  };
}
export function PersonalTasteCatalogProvider({ children }: { children: ReactNode }) {
  const { selection, error } = usePersonalCatalog();
  if (error) return <CatalogFailure />;
  if (selection === null)
    return (
      <main className="taste-page taste-page--loading">
        <p aria-live="polite">{catalogStrings.loading}</p>
      </main>
    );
  return <CatalogProvider catalog={selection.catalog}>{children}</CatalogProvider>;
}
