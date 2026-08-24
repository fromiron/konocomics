import { describe, expect, it } from "vitest";

import { splitShogakukanAwardItem } from "../../../scripts/import-shogakukan-manga-award";

describe("Shogakukan Manga Award import", () => {
  it("splits a source row into canonical work items without losing row provenance", () => {
    const item = {
      round: 21,
      sourceRowNumber: 1,
      entryType: "work" as const,
      title: "『ポーの一族』 『11人いる！』",
      creator: "萩尾望都",
      publication: "別冊少女コミック・小学館 | 別冊少女コミック・小学館",
    };

    expect(splitShogakukanAwardItem(item)).toEqual([
      { item, title: "ポーの一族", publication: "別冊少女コミック・小学館" },
      { item, title: "11人いる！", publication: "別冊少女コミック・小学館" },
    ]);
  });

  it("keeps non-work award rows intact for explicit exclusion review", () => {
    const item = {
      round: 27,
      sourceRowNumber: 4,
      entryType: "special-award-non-work" as const,
      title: "『魔物語』などの原作活動に対して特別賞",
      creator: "小池一夫",
      publication: "",
    };

    expect(splitShogakukanAwardItem(item)).toEqual([
      { item, title: "魔物語などの原作活動に対して特別賞", publication: "" },
    ]);
  });
});
