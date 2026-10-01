import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SettingsFlow } from "@/features/settings/settings-flow";
import { settingsSearchSchema } from "@/lib/route-search";
import { settingsStrings } from "@/lib/strings";

export const Route = createFileRoute("/settings")({
  ssr: false,
  validateSearch: (search) => settingsSearchSchema.parse(search),
  head: () => ({ meta: [{ title: settingsStrings.metadataTitle }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const router = useRouter();
  const [scrollRequest, setScrollRequest] = useState(0);

  // Scroll restoration runs on `onRendered` and can land after the section scroll; re-apply it.
  useEffect(
    () => router.subscribe("onRendered", () => setScrollRequest((request) => request + 1)),
    [router],
  );

  return (
    <SettingsFlow
      activeSection={search.section}
      onSectionChange={(section) => {
        void navigate({ resetScroll: false, search: { section } });
      }}
      scrollRequest={scrollRequest}
    />
  );
}
