import { describe, expect, it } from "vitest";

import {
  buildBlockedRegistryRows,
  isGenericRobotsPathAllowed,
  parseRobotsGroups,
  validateBlockedHttpResponse,
} from "../../../scripts/import-dc-manga-gallery-list-2013";

const EMPTY_SHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

describe("DC manga gallery 2013 blocked importer", () => {
  it("honors the generic robots group without borrowing a named crawler policy", () => {
    const robots = [
      "User-agent: GPTBot",
      "Disallow: /",
      "User-agent: *",
      "Allow: /",
      "Disallow: /board/view/?id=cat",
    ].join("\n");

    expect(parseRobotsGroups(robots)).toHaveLength(2);
    expect(
      isGenericRobotsPathAllowed(
        robots,
        "https://gall.dcinside.com/board/view/?id=comic_new1&no=369444",
      ),
    ).toBe(true);
    expect(
      isGenericRobotsPathAllowed(robots, "https://gall.dcinside.com/board/view/?id=cat&no=1"),
    ).toBe(false);
  });

  it("freezes only the observed HTTP 200 zero-byte response", () => {
    expect(
      validateBlockedHttpResponse({
        requestedUrl: "https://gall.dcinside.com/board/view/?id=comic_new1&no=369444",
        finalUrl: "https://gall.dcinside.com/board/view/?id=comic_new1&no=369444",
        status: 200,
        contentType: "text/html; charset=UTF-8",
        contentLength: "0",
        body: new Uint8Array(),
      }),
    ).toMatchObject({ bodyByteLength: 0, bodySha256: EMPTY_SHA256 });

    expect(() =>
      validateBlockedHttpResponse({
        requestedUrl: "https://gall.dcinside.com/board/view/?id=comic_new1&no=369444",
        finalUrl: "https://gall.dcinside.com/board/view/?id=comic_new1&no=369444",
        status: 200,
        contentType: "text/html; charset=UTF-8",
        contentLength: "1",
        body: new Uint8Array([1]),
      }),
    ).toThrow(/source body is now available|Content-Length 0/u);
  });

  it("registers the umbrella and unavailable children without inferred items", () => {
    const rows = buildBlockedRegistryRows();
    const ids = rows.map((row) => row[0]);

    expect(rows).toHaveLength(18);
    expect(ids).toContain("dc-manga-gallery-list-2013-436084");
    expect(ids).toContain("dc-manga-gallery-list-2013-369601");
    expect(ids).toContain("dc-manga-gallery-list-2013-369604");
    expect(ids).not.toContain("dc-manga-gallery-list-2013-367832");
    expect(rows.every((row) => row[8] === "blocked" && row[11] === "")).toBe(true);
    expect(rows.find((row) => row[0]?.endsWith("369604"))?.[20]).toContain(
      "excluded-non-manga membership/exclusion 근거를 날조하지 않고",
    );
  });
});
