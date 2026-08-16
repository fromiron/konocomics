import { createFileRoute } from "@tanstack/react-router";

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

  return (
    <SettingsFlow
      activeSection={search.section}
      onSectionChange={(section) => {
        void navigate({ search: { section } });
      }}
    />
  );
}
