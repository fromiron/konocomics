import { describe, expect, it } from "vitest";

import { extractMangaTaishoPage } from "../../../scripts/import-mangataisho-archive";

describe("Manga Taisho archive parser", () => {
  it("keeps repeated source entries and declines malformed title boundaries", () => {
    const payload = extractMangaTaishoPage(
      [
        '<div class="ttl_maname"><a href="/winner">『Winner』Author W</a></div>',
        '２位:<a href="/nominee">『Repeated』Author R</a>',
        "マンガ大賞2025一次選考作品リスト",
        '<div class="list_area"><ul>',
        '<li><a href="/first">『Repeated』Author R</a></li>',
        "<li>『Unclosed Author U</li>",
        "</ul></div>",
      ].join(""),
      2025,
      "https://www.mangataisho.com/archives/index.html",
    );

    expect(payload.items).toHaveLength(4);
    expect(payload.items.filter((item) => item.title === "Repeated")).toHaveLength(2);
    expect(payload.items[3]).toMatchObject({
      section: "一次選考作品リスト",
      rawText: "『Unclosed Author U",
      title: "",
      creator: "",
    });
  });

  it("extracts the current winner and unranked second-round nominees", () => {
    const payload = extractMangaTaishoPage(
      [
        "マンガ大賞2026 大賞決定！",
        '<div class="name_taisho">『Current Winner』</div>',
        '<div class="name_sakusya">Author W</div>',
        '<div class="img_taisho"><a href="https://example.com/winner">cover</a></div>',
        "<ul><li>",
        '<a href="https://example.com/nominee">cover</a>',
        '<div class="list_ttl_nominate">『Current Nominee』</div>',
        '<div class="list_name_nominate">Author N</div>',
        "</li></ul>",
        '<div class="list_area_top"><ul>',
        '<li><a href="/first">『First Work』Author F</a></li>',
        "</ul></div>",
      ].join(""),
      2026,
      "https://www.mangataisho.com/",
    );

    expect(payload.items).toMatchObject([
      { section: "大賞", rank: "大賞", title: "Current Winner", creator: "Author W" },
      {
        section: "二次ノミネート",
        rank: "",
        title: "Current Nominee",
        creator: "Author N",
      },
      {
        section: "一次選考作品リスト",
        rank: "",
        title: "First Work",
        creator: "Author F",
      },
    ]);
  });
});
