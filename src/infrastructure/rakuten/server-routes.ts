import "@tanstack/react-start/server-only";

import { fetchRakutenBooks, RAKUTEN_CDN_CACHE_CONTROL, readRakutenCredentials } from "./server";
import { rakutenIsbnSchema, rakutenTitleQuerySchema } from "./schema";

const invalidRequest = () => Response.json({ error: "invalid_request" }, { status: 400 });
const providerUnavailable = () => Response.json({ error: "provider_unavailable" }, { status: 502 });

export async function handleRakutenSearch(request: Request): Promise<Response> {
  const title = rakutenTitleQuerySchema.safeParse(new URL(request.url).searchParams.get("title"));
  if (!title.success) return invalidRequest();

  const credentials = readRakutenCredentials();
  if (credentials === null) return providerUnavailable();

  try {
    const items = await fetchRakutenBooks(
      { kind: "search", title: title.data },
      credentials,
      request,
    );
    return Response.json({ items }, { headers: { "Cache-Control": RAKUTEN_CDN_CACHE_CONTROL } });
  } catch {
    return providerUnavailable();
  }
}

export async function handleRakutenItem(request: Request): Promise<Response> {
  const isbn = rakutenIsbnSchema.safeParse(new URL(request.url).searchParams.get("isbn"));
  if (!isbn.success) return invalidRequest();

  const credentials = readRakutenCredentials();
  if (credentials === null) return providerUnavailable();

  try {
    const listings = await fetchRakutenBooks(
      { kind: "item", isbn: isbn.data },
      credentials,
      request,
    );
    const listing = listings.find((candidate) => candidate.isbn === isbn.data);
    return listing === undefined
      ? providerUnavailable()
      : Response.json({ listing }, { headers: { "Cache-Control": RAKUTEN_CDN_CACHE_CONTROL } });
  } catch {
    return providerUnavailable();
  }
}
