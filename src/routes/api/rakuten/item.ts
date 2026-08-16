import { createFileRoute } from "@tanstack/react-router";

import { handleRakutenItem } from "@/infrastructure/rakuten/server-routes";

export const Route = createFileRoute("/api/rakuten/item")({
  server: {
    handlers: {
      GET: ({ request }) => handleRakutenItem(request),
    },
  },
});
