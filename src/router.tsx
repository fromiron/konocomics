import { createRouter, parseSearchWith, stringifySearchWith } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const navigation = { isHistoryTraversal: false };
  const router = createRouter({
    routeTree,
    context: { navigation },
    parseSearch: parseSearchWith((value) => value),
    scrollRestoration: true,
    stringifySearch: stringifySearchWith(JSON.stringify),
  });
  if (typeof window !== "undefined") {
    navigation.isHistoryTraversal = performance
      .getEntriesByType("navigation")
      .some((entry) => "type" in entry && entry.type === "back_forward");
    router.history.subscribe(({ action }) => {
      navigation.isHistoryTraversal =
        action.type === "BACK" || action.type === "FORWARD" || action.type === "GO";
    });
  }
  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
