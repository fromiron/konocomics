import { createFileRoute } from "@tanstack/react-router";

import { handleRakutenSearch } from "@/infrastructure/rakuten/server-routes";

export const Route = createFileRoute("/api/rakuten/search")({
  server: {
    handlers: {
      GET: ({ request }) => handleRakutenSearch(request),
    },
  },
});
