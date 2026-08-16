import {
  fetchRakutenBooks,
  RAKUTEN_CDN_CACHE_CONTROL,
  readRakutenCredentials,
} from "@/infrastructure/rakuten/server";
import { rakutenIsbnSchema } from "@/infrastructure/rakuten/schema";

const invalidRequest = () => Response.json({ error: "invalid_request" }, { status: 400 });
const providerUnavailable = () => Response.json({ error: "provider_unavailable" }, { status: 502 });

export async function GET(request: Request): Promise<Response> {
  const isbn = rakutenIsbnSchema.safeParse(new URL(request.url).searchParams.get("isbn"));
  if (!isbn.success) {
    return invalidRequest();
  }
  const credentials = readRakutenCredentials();
  if (credentials === null) {
    return providerUnavailable();
  }

  try {
    const listings = await fetchRakutenBooks({ kind: "item", isbn: isbn.data }, credentials);
    const listing = listings.find((candidate) => candidate.isbn === isbn.data);
    if (listing === undefined) {
      return providerUnavailable();
    }
    return Response.json({ listing }, { headers: { "Cache-Control": RAKUTEN_CDN_CACHE_CONTROL } });
  } catch {
    return providerUnavailable();
  }
}
