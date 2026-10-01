import { createFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/features/about/about-page";
import { emptySearchSchema } from "@/lib/route-search";
import { aboutStrings } from "@/lib/strings";

export const Route = createFileRoute("/about")({
  validateSearch: (search) => emptySearchSchema.parse(search),
  head: () => ({ meta: [{ title: aboutStrings.metadataTitle }] }),
  component: AboutPage,
});
