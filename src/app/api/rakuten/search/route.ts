import {
  fetchRakutenBooks,
  RAKUTEN_CDN_CACHE_CONTROL,
  readRakutenCredentials,
} from "@/infrastructure/rakuten/server";
import { rakutenTitleQuerySchema } from "@/infrastructure/rakuten/schema";

const invalidRequest = () => Response.json({ error: "invalid_request" }, { status: 400 });
const providerUnavailable = () => Response.json({ error: "provider_unavailable" }, { status: 502 });

export async function GET(request: Request): Promise<Response> {
  const title = rakutenTitleQuerySchema.safeParse(new URL(request.url).searchParams.get("title"));
  if (!title.success) {
    return invalidRequest();
  }
  const credentials = readRakutenCredentials();
  if (credentials === null) {
    return providerUnavailable();
  }

  try {
    const items = await fetchRakutenBooks({ kind: "search", title: title.data }, credentials);
    return Response.json({ items }, { headers: { "Cache-Control": RAKUTEN_CDN_CACHE_CONTROL } });
  } catch {
    return providerUnavailable();
  }
}
