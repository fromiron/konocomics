import { normalizeIsbn } from "@/domain/catalog/normalize";

import {
  rakutenErrorResponseSchema,
  rakutenIsbnSchema,
  rakutenItemResponseSchema,
  rakutenSearchResponseSchema,
  rakutenTitleQuerySchema,
  type RakutenBookItem,
} from "./schema";

export type RakutenClientErrorCode =
  "invalid_request" | "provider_unavailable" | "invalid_response";

export class RakutenClientError extends Error {
  constructor(
    readonly code: RakutenClientErrorCode,
    readonly status?: number,
  ) {
    super(code);
    this.name = "RakutenClientError";
  }
}

const providerRequests = new Map<string, Promise<RakutenBookItem>>();
const RAKUTEN_REQUEST_INTERVAL_MS = process.env.NODE_ENV === "test" ? 0 : 1_000;
let providerRequestQueue: Promise<void> = Promise.resolve();
let nextProviderRequestAt = 0;

function scheduleProviderRequest<T>(request: () => Promise<T>): Promise<T> {
  const scheduled = providerRequestQueue.then(async () => {
    const delay = nextProviderRequestAt - Date.now();
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    nextProviderRequestAt = Date.now() + RAKUTEN_REQUEST_INTERVAL_MS;
    return request();
  });
  providerRequestQueue = scheduled.then(
    () => undefined,
    () => undefined,
  );
  return scheduled;
}

export function buildRakutenBooksSearchUrl(title: string): string {
  const parsedTitle = rakutenTitleQuerySchema.safeParse(title);
  if (!parsedTitle.success) {
    throw new RakutenClientError("invalid_request");
  }
  const url = new URL("https://books.rakuten.co.jp/search");
  url.searchParams.set("g", "001001");
  url.searchParams.set("sitem", parsedTitle.data);
  return url.toString();
}

async function fetchJson(url: string): Promise<unknown> {
  let response: Response;
  try {
    response = await scheduleProviderRequest(() =>
      fetch(url, { headers: { Accept: "application/json" } }),
    );
  } catch {
    throw new RakutenClientError("provider_unavailable");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new RakutenClientError("invalid_response", response.status);
  }

  if (!response.ok) {
    const error = rakutenErrorResponseSchema.safeParse(payload);
    throw new RakutenClientError(
      error.success ? error.data.error : "provider_unavailable",
      response.status,
    );
  }
  return payload;
}

export async function searchRakutenBooks(title: string): Promise<RakutenBookItem[]> {
  const parsedTitle = rakutenTitleQuerySchema.safeParse(title);
  if (!parsedTitle.success) {
    throw new RakutenClientError("invalid_request");
  }
  const payload = await fetchJson(
    `/api/rakuten/search?${new URLSearchParams({ title: parsedTitle.data }).toString()}`,
  );
  const response = rakutenSearchResponseSchema.safeParse(payload);
  if (!response.success) {
    throw new RakutenClientError("invalid_response", 200);
  }
  return response.data.items;
}

export async function fetchRakutenBook(isbn: string): Promise<RakutenBookItem> {
  const parsedIsbn = rakutenIsbnSchema.safeParse(normalizeIsbn(isbn));
  if (!parsedIsbn.success) {
    throw new RakutenClientError("invalid_request");
  }
  const payload = await fetchJson(
    `/api/rakuten/item?${new URLSearchParams({ isbn: parsedIsbn.data }).toString()}`,
  );
  const response = rakutenItemResponseSchema.safeParse(payload);
  if (!response.success) {
    throw new RakutenClientError("invalid_response", 200);
  }
  return response.data.listing;
}

export function requestRakutenBook(isbn: string): Promise<RakutenBookItem> {
  const parsedIsbn = rakutenIsbnSchema.safeParse(normalizeIsbn(isbn));
  if (!parsedIsbn.success) {
    return Promise.reject(new RakutenClientError("invalid_request"));
  }

  const current = providerRequests.get(parsedIsbn.data);
  if (current !== undefined) return current;

  const request = fetchRakutenBook(parsedIsbn.data).finally(() => {
    if (providerRequests.get(parsedIsbn.data) === request) {
      providerRequests.delete(parsedIsbn.data);
    }
  });
  providerRequests.set(parsedIsbn.data, request);
  return request;
}
