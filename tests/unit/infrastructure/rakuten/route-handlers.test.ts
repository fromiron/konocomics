import { afterEach, describe, expect, it, vi } from "vitest";

import { GET as getItem } from "@/app/api/rakuten/item/route";
import { GET as searchItems } from "@/app/api/rakuten/search/route";
import { RAKUTEN_CDN_CACHE_CONTROL } from "@/infrastructure/rakuten/server";

const ISBN = "9784091855312";
const OTHER_ISBN = "9784091380135";

function upstreamItem(isbn = ISBN) {
  return {
    title: "20世紀少年 1",
    author: "浦沢直樹",
    publisherName: "小学館",
    isbn,
    itemCaption: "世界の終わりが始まる。",
    salesDate: "2000年01月",
    itemPrice: 770,
    itemUrl: "https://books.rakuten.co.jp/rb/123/",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/example",
    largeImageUrl: "https://thumbnail.image.rakuten.co.jp/book.jpg?_ex=200x200&foo=bar",
    chirayomiUrl: "https://books.rakuten.co.jp/event/chirayomi/123/",
    availability: 1,
    reviewAverage: 4.5,
    reviewCount: 12,
    internalField: "must not escape",
  };
}

function enableCredentials() {
  vi.stubEnv("RAKUTEN_APPLICATION_ID", "application-id");
  vi.stubEnv("RAKUTEN_ACCESS_KEY", "access-key");
  vi.stubEnv("RAKUTEN_AFFILIATE_ID", "affiliate-id");
  vi.stubEnv("RAKUTEN_ALLOWED_ORIGIN", "https://konocomics.vercel.app");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("Rakuten Route Handlers", () => {
  it("validates search input before any provider request", async () => {
    enableCredentials();
    const providerFetch = vi.fn();
    vi.stubGlobal("fetch", providerFetch);

    for (const url of [
      "http://localhost/api/rakuten/search",
      "http://localhost/api/rakuten/search?title=%20%20",
      `http://localhost/api/rakuten/search?title=${"a".repeat(101)}`,
    ]) {
      const response = await searchItems(new Request(url));
      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({ error: "invalid_request" });
    }
    expect(providerFetch).not.toHaveBeenCalled();
  });

  it("validates and normalizes ISBN before any provider request", async () => {
    enableCredentials();
    const providerFetch = vi.fn();
    vi.stubGlobal("fetch", providerFetch);

    for (const isbn of ["", "9784091855313", "not-an-isbn"]) {
      const response = await getItem(
        new Request(`http://localhost/api/rakuten/item?isbn=${encodeURIComponent(isbn)}`),
      );
      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({ error: "invalid_request" });
    }
    expect(providerFetch).not.toHaveBeenCalled();
  });

  it("keeps credentials server-side, minimizes fields, rewrites the image, and sets CDN policy", async () => {
    enableCredentials();
    const providerFetch = vi.fn(async (url: URL, init: RequestInit) => {
      void url;
      void init;
      return Response.json({
        Items: [{ ...upstreamItem(), availability: "1", reviewAverage: "4.5" }],
        providerInternal: "must not escape",
      });
    });
    vi.stubGlobal("fetch", providerFetch);

    const response = await searchItems(
      new Request(
        "http://localhost/api/rakuten/search?title=20%E4%B8%96%E7%B4%80%E5%B0%91%E5%B9%B4",
        { headers: { "User-Agent": "test-browser" } },
      ),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe(RAKUTEN_CDN_CACHE_CONTROL);
    await expect(response.json()).resolves.toEqual({
      items: [
        {
          title: "20世紀少年 1",
          author: "浦沢直樹",
          publisherName: "小学館",
          isbn: ISBN,
          itemCaption: "世界の終わりが始まる。",
          salesDate: "2000年01月",
          itemPrice: 770,
          itemUrl: "https://books.rakuten.co.jp/rb/123/",
          affiliateUrl: "https://hb.afl.rakuten.co.jp/example",
          imageUrl: "https://thumbnail.image.rakuten.co.jp/book.jpg?_ex=600x600&foo=bar",
          chirayomiUrl: "https://books.rakuten.co.jp/event/chirayomi/123/",
          availability: 1,
          reviewAverage: 4.5,
          reviewCount: 12,
        },
      ],
    });

    expect(providerFetch).toHaveBeenCalledOnce();
    const [requestUrl, requestInit] = providerFetch.mock.calls[0]!;
    const upstreamUrl = new URL(String(requestUrl));
    expect(upstreamUrl.origin).toBe("https://openapi.rakuten.co.jp");
    expect(upstreamUrl.searchParams.get("applicationId")).toBe("application-id");
    expect(upstreamUrl.searchParams.get("affiliateId")).toBe("affiliate-id");
    expect(upstreamUrl.searchParams.get("title")).toBe("20世紀少年");
    expect(upstreamUrl.searchParams.get("outOfStockFlag")).toBe("1");
    expect(upstreamUrl.searchParams.has("accessKey")).toBe(false);
    expect(requestInit.headers).toEqual({
      Accept: "application/json",
      accessKey: "access-key",
      Origin: "https://konocomics.vercel.app",
      Referer: "https://konocomics.vercel.app/",
      "User-Agent": "test-browser",
    });
  });

  it("returns one transport listing without inventing cache identity or timestamps", async () => {
    enableCredentials();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ items: [{ ...upstreamItem(), availability: "" }] })),
    );

    const response = await getItem(
      new Request("http://localhost/api/rakuten/item?isbn=978-4-09-185531-2"),
    );
    expect(response.status).toBe(200);
    const payload = (await response.json()) as { listing: Record<string, unknown> };
    expect(payload.listing.isbn).toBe(ISBN);
    expect(payload.listing).not.toHaveProperty("workId");
    expect(payload.listing).not.toHaveProperty("fetchedAt");
    expect(payload.listing).not.toHaveProperty("commercialExpiresAt");
    expect(payload.listing).not.toHaveProperty("metadataExpiresAt");
    expect(payload.listing).not.toHaveProperty("availability");
  });

  it("selects the exact requested ISBN and rejects mismatched-only provider results", async () => {
    enableCredentials();
    const providerFetch = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({ items: [upstreamItem(OTHER_ISBN), upstreamItem(ISBN)] }),
      )
      .mockResolvedValueOnce(Response.json({ items: [upstreamItem(OTHER_ISBN)] }));
    vi.stubGlobal("fetch", providerFetch);

    const exactMatch = await getItem(new Request(`http://localhost/api/rakuten/item?isbn=${ISBN}`));
    expect(exactMatch.status).toBe(200);
    await expect(exactMatch.json()).resolves.toMatchObject({ listing: { isbn: ISBN } });

    const mismatchedOnly = await getItem(
      new Request(`http://localhost/api/rakuten/item?isbn=${ISBN}`),
    );
    expect(mismatchedOnly.status).toBe(502);
    await expect(mismatchedOnly.json()).resolves.toEqual({ error: "provider_unavailable" });
  });

  it("maps missing server credentials and upstream failures to the exact 502 contract", async () => {
    const providerFetch = vi.fn();
    vi.stubGlobal("fetch", providerFetch);

    const missingCredentials = await searchItems(
      new Request("http://localhost/api/rakuten/search?title=%E6%BC%AB%E7%94%BB"),
    );
    expect(missingCredentials.status).toBe(502);
    await expect(missingCredentials.json()).resolves.toEqual({ error: "provider_unavailable" });
    expect(providerFetch).not.toHaveBeenCalled();

    enableCredentials();
    vi.stubEnv("RAKUTEN_ALLOWED_ORIGIN", "https://konocomics.vercel.app/path");
    const invalidOrigin = await getItem(
      new Request(`http://localhost/api/rakuten/item?isbn=${ISBN}`),
    );
    expect(invalidOrigin.status).toBe(502);
    expect(providerFetch).not.toHaveBeenCalled();

    enableCredentials();
    providerFetch.mockResolvedValueOnce(new Response(null, { status: 503 }));
    const upstreamFailure = await getItem(
      new Request(`http://localhost/api/rakuten/item?isbn=${ISBN}`),
    );
    expect(upstreamFailure.status).toBe(502);
    await expect(upstreamFailure.json()).resolves.toEqual({ error: "provider_unavailable" });
  });

  it("maps a malformed provider payload and an empty item result to 502", async () => {
    enableCredentials();
    const providerFetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ items: [{ title: "missing fields" }] }))
      .mockResolvedValueOnce(Response.json({ items: [] }));
    vi.stubGlobal("fetch", providerFetch);

    const malformed = await searchItems(
      new Request("http://localhost/api/rakuten/search?title=%E6%BC%AB%E7%94%BB"),
    );
    expect(malformed.status).toBe(502);
    await expect(malformed.json()).resolves.toEqual({ error: "provider_unavailable" });

    const empty = await getItem(new Request(`http://localhost/api/rakuten/item?isbn=${ISBN}`));
    expect(empty.status).toBe(502);
    await expect(empty.json()).resolves.toEqual({ error: "provider_unavailable" });
  });

  it("aborts the provider request at five seconds and returns 502", async () => {
    vi.useFakeTimers();
    enableCredentials();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url: URL, init: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init.signal?.addEventListener("abort", () => {
              reject(new DOMException("Aborted", "AbortError"));
            });
          }),
      ),
    );

    const pending = searchItems(
      new Request("http://localhost/api/rakuten/search?title=%E6%BC%AB%E7%94%BB"),
    );
    await vi.advanceTimersByTimeAsync(5_000);
    const response = await pending;

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: "provider_unavailable" });
  });
});
