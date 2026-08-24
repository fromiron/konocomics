import { describe, expect, it } from "vitest";

import {
  discoverBooksellerRecommendationPages,
  extractBooksellerRecommendations,
} from "../../../scripts/import-bookseller-recommendations";

describe("bookseller recommendation importer", () => {
  it("discovers every historical page and the 2026 full result from the official root", () => {
    const history = Array.from({ length: 20 }, (_, index) => 2006 + index).map(
      (year) =>
        `<p>〉〉${year}年度ランキングは<a href="https://hon-hikidashi.jp/event/${year}/">こちら</a></p>`,
    );
    const html = [
      ...history,
      "<h2>「全国書店員が選んだおすすめコミック2026」第4位以降の作品はこちら</h2>",
      '<p><a href="https://hon-hikidashi.jp/event/95563/">こちら</a></p>',
      "<h2>出版社コミック担当が選んだおすすめコミック2026</h2>",
    ].join("");

    expect(discoverBooksellerRecommendationPages(html)).toEqual({
      history: Array.from({ length: 20 }, (_, index) => ({
        year: 2006 + index,
        url: `https://hon-hikidashi.jp/event/${2006 + index}/`,
      })),
      currentDetailUrl: "https://hon-hikidashi.jp/event/95563/",
    });
  });

  it("keeps the general top 15 and excludes the later publisher-staff division", () => {
    const general = Array.from({ length: 15 }, (_, index) => index + 1).map(
      (rank) => `<h2>第${rank}位『一般作品${rank}』</h2>
        <div class="honyaclub"><a href="http://www.honyaclub.com/item/${rank}">detail</a>
        <dd>著者：一般作者${rank}</dd></div>`,
    );
    const html = [
      '<div class="article__contents">',
      ...general,
      "<h2>出版社コミック担当が選んだおすすめコミック2026 結果</h2>",
      "<h3>第1位『別部門作品』</h3><dd>著者：別部門作者</dd>",
      "</div>",
    ].join("");

    const items = extractBooksellerRecommendations(
      html,
      2026,
      "https://hon-hikidashi.jp/event/95563/",
    );
    expect(items).toHaveLength(15);
    expect(items[0]).toEqual({
      year: 2026,
      rank: 1,
      title: "一般作品1",
      creator: "一般作者1",
      detailUrl: "http://www.honyaclub.com/item/1",
    });
    expect(items.some((item) => item.title === "別部門作品")).toBe(false);
  });

  it("decodes mixed Shift_JIS query bytes without rewriting the source detail URL", () => {
    const areas = Array.from({ length: 15 }, (_, index) => index + 1).map((rank) => {
      const creator = rank === 3 ? "%95%8d%93c%97S%93l" : `作者${rank}`;
      return `<area href="https://www.honyaclub.com/shop/search?aut_n=${creator}&title=作品${rank}" alt="${rank}位 作品${rank}">`;
    });
    const items = extractBooksellerRecommendations(
      areas.join(""),
      2014,
      "https://www.honyaclub.com/shop/pages/osusume_comic2014.aspx?affiliate=osusumec14",
    );

    expect(items[2]).toMatchObject({
      rank: 3,
      title: "作品3",
      creator: "附田祐斗",
      detailUrl: "https://www.honyaclub.com/shop/search?aut_n=%95%8d%93c%97S%93l&title=作品3",
    });
  });
});
