import type { Metadata } from "next";

import { SettingsFlow } from "@/features/settings/settings-flow";
import { settingsStrings } from "@/lib/strings";

export const metadata: Metadata = {
  title: settingsStrings.metadataTitle,
};

export default function SettingsPage() {
  return <SettingsFlow />;
}
