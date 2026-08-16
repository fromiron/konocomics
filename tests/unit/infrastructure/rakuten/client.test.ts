import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildRakutenBooksSearchUrl,
  fetchRakutenBook,
  requestRakutenBook,
  searchRakutenBooks,
  type RakutenBookItem,
} from "@/infrastructure/rakuten";

const ITEM: RakutenBookItem = {
  title: "20世紀少年 1",
  author: "浦沢直樹",
  publisherName: "小学館",
  isbn: "9784091855312",
  itemPrice: 770,
  itemUrl: "https://books.rakuten.co.jp/rb/123/",
  availability: 1,
  reviewAverage: 4.5,
  reviewCount: 12,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Rakuten client", () => {
  it("builds the grounded Rakuten Books manga title fallback URL", () => {
    const url = new URL(buildRakutenBooksSearchUrl(" 20世紀少年 "));
    expect(url.origin).toBe("https://books.rakuten.co.jp");
    expect(url.pathname).toBe("/search");
    expect(url.searchParams.get("g")).toBe("001001");
    expect(url.searchParams.get("sitem")).toBe("20世紀少年");
  });

  it("encodes validated search and parses the strict transport response", async () => {
    const routeFetch = vi.fn(async () => Response.json({ items: [ITEM] }));
    vi.stubGlobal("fetch", routeFetch);

    await expect(searchRakutenBooks(" 20世紀少年 ")).resolves.toEqual([ITEM]);
    expect(routeFetch).toHaveBeenCalledWith(
      "/api/rakuten/search?title=20%E4%B8%96%E7%B4%80%E5%B0%91%E5%B9%B4",
      { headers: { Accept: "application/json" } },
    );
  });

  it("normalizes ISBN and returns an item DTO", async () => {
    const routeFetch = vi.fn(async () => Response.json({ listing: ITEM }));
    vi.stubGlobal("fetch", routeFetch);

    await expect(fetchRakutenBook("978-4-09-185531-2")).resolves.toEqual(ITEM);
    expect(routeFetch).toHaveBeenCalledWith(`/api/rakuten/item?isbn=${ITEM.isbn}`, {
      headers: { Accept: "application/json" },
    });
  });

  it("coalesces normalized ISBN requests and clears the in-flight entry after success", async () => {
    let resolveResponse!: (response: Response) => void;
    const response = new Promise<Response>((resolve) => {
      resolveResponse = resolve;
    });
    const routeFetch = vi
      .fn()
      .mockImplementationOnce(() => response)
      .mockResolvedValueOnce(Response.json({ listing: ITEM }));
    vi.stubGlobal("fetch", routeFetch);

    const first = requestRakutenBook("978-4-09-185531-2");
    const second = requestRakutenBook(ITEM.isbn);
    expect(second).toBe(first);
    expect(routeFetch).toHaveBeenCalledOnce();

    resolveResponse(Response.json({ listing: ITEM }));
    await expect(first).resolves.toEqual(ITEM);
    await expect(requestRakutenBook(ITEM.isbn)).resolves.toEqual(ITEM);
    expect(routeFetch).toHaveBeenCalledTimes(2);
  });

  it("clears a rejected in-flight request so a later call can retry", async () => {
    const routeFetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(Response.json({ listing: ITEM }));
    vi.stubGlobal("fetch", routeFetch);

    await expect(requestRakutenBook(ITEM.isbn)).rejects.toMatchObject({
      code: "provider_unavailable",
    });
    await expect(requestRakutenBook(ITEM.isbn)).resolves.toEqual(ITEM);
    expect(routeFetch).toHaveBeenCalledTimes(2);
  });

  it("rejects invalid input locally without network access", async () => {
    const routeFetch = vi.fn();
    vi.stubGlobal("fetch", routeFetch);

    await expect(searchRakutenBooks(" ")).rejects.toMatchObject({
      code: "invalid_request",
    });
    await expect(fetchRakutenBook("invalid")).rejects.toMatchObject({
      code: "invalid_request",
    });
    expect(routeFetch).not.toHaveBeenCalled();
  });

  it("does not retry provider failure and preserves the route error code", async () => {
    const routeFetch = vi.fn(async () =>
      Response.json({ error: "provider_unavailable" }, { status: 502 }),
    );
    vi.stubGlobal("fetch", routeFetch);

    await expect(fetchRakutenBook(ITEM.isbn)).rejects.toMatchObject({
      code: "provider_unavailable",
      status: 502,
    });
    expect(routeFetch).toHaveBeenCalledOnce();
  });

  it("classifies malformed success payloads without accepting extra fields", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ listing: { ...ITEM, extra: true } })),
    );

    await expect(fetchRakutenBook(ITEM.isbn)).rejects.toMatchObject({
      code: "invalid_response",
      status: 200,
    });
  });
});
