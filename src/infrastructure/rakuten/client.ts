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
let popularBooksRequest: Promise<RakutenBookItem[]> | undefined;
let popularBooksExpiresAt = 0;
const RAKUTEN_REQUEST_INTERVAL_MS = import.meta.env.MODE === "development" ? 1_000 : 0;
const MAX_CONCURRENT_PROVIDER_REQUESTS = 4;
let providerRequestQueue: Promise<void> = Promise.resolve();
let nextProviderRequestAt = 0;
let activeProviderRequests = 0;
const pendingProviderRequests: Array<() => void> = [];

function runWithProviderSlot<T>(request: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const run = () => {
      activeProviderRequests += 1;
      void (async () => {
        try {
          resolve(await request());
        } catch (error) {
          reject(error);
        } finally {
          activeProviderRequests -= 1;
          pendingProviderRequests.shift()?.();
        }
      })();
    };

    if (activeProviderRequests < MAX_CONCURRENT_PROVIDER_REQUESTS) run();
    else pendingProviderRequests.push(run);
  });
}

function scheduleProviderRequest<T>(request: () => Promise<T>): Promise<T> {
  if (RAKUTEN_REQUEST_INTERVAL_MS === 0) return runWithProviderSlot(request);

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

async function fetchJson(url: string, signal?: AbortSignal): Promise<unknown> {
  let response: Response;
  try {
    const request = scheduleProviderRequest(() => {
      signal?.throwIfAborted();
      return fetch(url, {
        headers: { Accept: "application/json" },
        ...(signal === undefined ? {} : { signal }),
      });
    });
    response =
      signal === undefined
        ? await request
        : await new Promise<Response>((resolve, reject) => {
            const abort = () => reject(signal.reason);
            // A search can expire while waiting behind cover requests, before fetch starts.
            if (signal.aborted) abort();
            else signal.addEventListener("abort", abort, { once: true });
            void request
              .then(resolve, reject)
              .finally(() => signal.removeEventListener("abort", abort));
          });
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

export async function searchRakutenBooks(
  title: string,
  signal?: AbortSignal,
): Promise<RakutenBookItem[]> {
  const parsedTitle = rakutenTitleQuerySchema.safeParse(title);
  if (!parsedTitle.success) {
    throw new RakutenClientError("invalid_request");
  }
  const payload = await fetchJson(
    `/api/rakuten/search?${new URLSearchParams({ title: parsedTitle.data }).toString()}`,
    signal === undefined
      ? AbortSignal.timeout(10_000)
      : AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
  );
  const response = rakutenSearchResponseSchema.safeParse(payload);
  if (!response.success) {
    throw new RakutenClientError("invalid_response", 200);
  }
  return response.data.items;
}

export function fetchPopularRakutenBooks(): Promise<RakutenBookItem[]> {
  if (popularBooksRequest !== undefined && Date.now() < popularBooksExpiresAt) {
    return popularBooksRequest;
  }
  popularBooksExpiresAt = Date.now() + 24 * 60 * 60 * 1_000;
  popularBooksRequest = fetchJson("/api/rakuten/search?sort=sales")
    .then((payload) => {
      const response = rakutenSearchResponseSchema.safeParse(payload);
      if (!response.success) throw new RakutenClientError("invalid_response", 200);
      return response.data.items;
    })
    .catch((error: unknown) => {
      popularBooksRequest = undefined;
      throw error;
    });
  return popularBooksRequest;
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
