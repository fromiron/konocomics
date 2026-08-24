import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  buildRakutenAdjudication,
  canonicalTitleIdentity,
  creatorsOverlap,
  isExactSafeStandardMatch,
  isStandardRakutenEdition,
  type RakutenAdjudicationInput,
} from "../../../scripts/adjudicate-rakuten-candidates";
import { canonicalCreatorList } from "../../../scripts/catalog/representative-volume-decisions";

function hashItems(items: unknown[]) {
  return createHash("sha256")
    .update(`${JSON.stringify({ outcome: "ok", items })}\n`)
    .digest("hex");
}

const source = {
  sourceId: "tsugimanga-2024-comics",
  sourceKind: "award",
  organization: "次にくるマンガ大賞",
  title: "2024 コミックス部門",
  url: "https://tsugimanga.jp/winner/2024/comics",
  publishedAt: "2024-08-28",
  retrievedAt: "2026-08-22",
  listNature: "official ranking",
  registryStatus: "adjudicating",
  snapshotUrl: "https://tsugimanga.jp/winner/2024/comics",
  snapshotSha256: "a".repeat(64),
  originalItemCount: "2",
  japaneseMangaItemCount: "",
  excludedWebtoonCount: "0",
  excludedAdultCount: "0",
  excludedNonJapaneseCount: "0",
  excludedNonMangaCount: "0",
  duplicateCount: "0",
  canonicalMappingCount: "0",
  unresolvedCount: "2",
  notes: "",
};
const baseItem = {
  title: "正反対な君と僕（1）",
  author: "阿賀沢 紅茶",
  publisherName: "集英社",
  isbn: "9784088831251",
  booksGenreId: "001001001008",
  salesDate: "2022年07月04日",
  itemUrl: "https://books.rakuten.co.jp/rb/17143325/",
};

function raw(sourceItemId: string, creator = "阿賀沢紅茶") {
  return {
    sourceItemId,
    sourceId: source.sourceId,
    sourceRowNumber: sourceItemId.endsWith("1") ? "1" : "2",
    rawPublicationClass: "comics",
    rawTitle: "正反対な君と僕",
    rawCreator: creator,
    rawMainGenre: "",
    rawSubgenre: "",
    rawRating: "",
    rawNotes: "",
    rawUpdatedAt: "2024-08-28",
  };
}

function input(items = [baseItem], creator = "阿賀沢紅茶"): RakutenAdjudicationInput {
  const rawItems = [
    raw("tsugimanga-2024-comics-001", creator),
    raw("tsugimanga-2024-comics-002", creator),
  ];
  return {
    sources: [source],
    rawItems,
    memberships: rawItems.map((row) => ({
      sourceItemId: row.sourceItemId,
      sourceId: row.sourceId,
      status: "unresolved" as const,
      candidateId: "",
      workId: "",
      decisionRef: "",
    })),
    cacheRecords: [
      {
        queryKey: "正反対な君と僕",
        queryTitle: "正反対な君と僕",
        sourceItemIds: rawItems.map((row) => row.sourceItemId),
        retrievedAt: "2026-08-22",
        outcome: "ok",
        responseSha256: hashItems(items),
        items,
      },
    ],
    goldWorks: [],
    goldAliases: [],
  };
}

describe("Rakuten candidate adjudication", () => {
  it("normalizes title and creator but rejects invalid ISBN, non-manga, and non-standard editions", () => {
    expect(creatorsOverlap("原作：阿賀沢紅茶（集英社）", "阿賀沢 紅茶")).toBe(true);
    expect(creatorsOverlap("河内遥", "河内遙")).toBe(true);
    expect(canonicalCreatorList("沖田 ×華")).toBe("沖田×華");
    expect(isStandardRakutenEdition("正反対な君と僕（1）")).toBe(true);
    expect(isStandardRakutenEdition("正反対な君と僕 完全版（1）")).toBe(false);
    expect(isStandardRakutenEdition("正反対な君と僕 電子書籍版")).toBe(false);
    expect(isExactSafeStandardMatch(raw("tsugimanga-2024-comics-001"), baseItem)).toBe(true);
    expect(
      isExactSafeStandardMatch(raw("tsugimanga-2024-comics-001"), {
        ...baseItem,
        isbn: "9784088831252",
      }),
    ).toBe(false);
    expect(
      isExactSafeStandardMatch(raw("tsugimanga-2024-comics-001"), {
        ...baseItem,
        booksGenreId: "001029001004",
      }),
    ).toBe(false);
  });

  it("folds documented shortened titles into their publisher canonical identity", () => {
    expect(canonicalTitleIdentity("とめはねっ！", "河合克敏")).toMatchObject({
      titleKey: "とめはねっ! 鈴里高校書道部",
      canonicalTitle: "とめはねっ！ 鈴里高校書道部",
    });
    expect(canonicalTitleIdentity("チェーザレ", "惣領 冬実")).toMatchObject({
      titleKey: "ちぇーざれ 破壊の創造者",
      canonicalTitle: "チェーザレ 破壊の創造者",
    });
    expect(canonicalTitleIdentity("チェーザレ", "別作者")).toEqual({
      titleKey: "ちぇーざれ",
    });
  });

  it("groups a shortened publisher title with its full canonical work", () => {
    const value = input();
    value.rawItems = value.rawItems.map((row, index) => ({
      ...row,
      rawTitle: index === 0 ? "チェーザレ 破壊の創造者" : "チェーザレ",
      rawCreator: "惣領冬実",
    }));
    value.cacheRecords = [
      {
        queryKey: "ちぇーざれ 破壊の創造者",
        queryTitle: "チェーザレ 破壊の創造者",
        sourceItemIds: [value.rawItems[0]!.sourceItemId],
        retrievedAt: "2026-08-22",
        outcome: "ok",
        responseSha256: hashItems([
          {
            ...baseItem,
            title: "チェーザレ 破壊の創造者（1）",
            author: "惣領 冬実",
            publisherName: "講談社",
            isbn: "9784063722017",
            itemUrl: "https://books.rakuten.co.jp/rb/4141702/",
          },
        ]),
        items: [
          {
            ...baseItem,
            title: "チェーザレ 破壊の創造者（1）",
            author: "惣領 冬実",
            publisherName: "講談社",
            isbn: "9784063722017",
            itemUrl: "https://books.rakuten.co.jp/rb/4141702/",
          },
        ],
      },
      {
        queryKey: "ちぇーざれ",
        queryTitle: "チェーザレ",
        sourceItemIds: [value.rawItems[1]!.sourceItemId],
        retrievedAt: "2026-08-22",
        outcome: "ok",
        responseSha256: hashItems([
          {
            ...baseItem,
            title: "チェーザレ（7）",
            author: "惣領 冬実",
            publisherName: "講談社",
            isbn: "9784063757507",
            itemUrl: "https://books.rakuten.co.jp/rb/6104280/",
          },
        ]),
        items: [
          {
            ...baseItem,
            title: "チェーザレ（7）",
            author: "惣領 冬実",
            publisherName: "講談社",
            isbn: "9784063757507",
            itemUrl: "https://books.rakuten.co.jp/rb/6104280/",
          },
        ],
      },
    ];

    const output = buildRakutenAdjudication(value);

    expect(output.candidates).toHaveLength(1);
    expect(output.candidates[0]?.canonicalTitleJa).toBe("チェーザレ 破壊の創造者");
    expect(output.mappings.map((row) => row.mappingType)).toEqual(["included", "duplicate"]);
    expect(output.mappings[1]?.notes).toContain(
      "; canonicalTitleEvidenceUrl=https://www.kodansha.co.jp/titles/1000002705.",
    );
  });

  it("groups one normalized title and Rakuten author with included then duplicate membership", () => {
    const output = buildRakutenAdjudication(input());
    const jointCreatorOutput = buildRakutenAdjudication(
      input([{ ...baseItem, author: "阿賀沢 紅茶 × 別作家" }], "阿賀沢紅茶;別作家"),
    );

    expect(output.candidates).toHaveLength(1);
    expect(output.mappings.map((row) => row.mappingType)).toEqual(["included", "duplicate"]);
    expect(output.memberships.map((row) => row.status)).toEqual(["included", "duplicate"]);
    expect(output.candidates[0]?.candidateId).toMatch(/^candidate-[a-f0-9]{20}$/u);
    expect(output.candidates[0]?.notes).toContain("Library-only candidate");
    expect(output.rakutenMatches[0]).toMatchObject({
      isbn: "9784088831251",
      editionKind: "standard",
      isRepresentative: "true",
    });
    expect(output.sources[0]).toMatchObject({
      duplicateCount: "1",
      canonicalMappingCount: "1",
      unresolvedCount: "0",
    });
    expect(jointCreatorOutput.candidates[0]?.creatorsJa).toBe("阿賀沢 紅茶;別作家");
  });

  it("preserves an audited Work year across incremental adjudication", () => {
    const initial = buildRakutenAdjudication(input());
    const existing = { ...initial.candidates[0]!, firstPublishedYear: "2020" };
    const output = buildRakutenAdjudication({ ...input(), existingCandidates: [existing] });

    expect(output.candidates[0]?.firstPublishedYear).toBe("2020");
  });

  it("keeps an officially documented vertical-scroll work out of promotion", () => {
    const value = input();
    value.sources = [{ ...source, sourceId: "tsugimanga-2021-web" }];
    value.rawItems = value.rawItems.map((row) => ({
      ...row,
      sourceId: "tsugimanga-2021-web",
      rawTitle: "ReLIFE",
      rawCreator: "夜宵草",
    }));
    value.memberships = value.rawItems.map((row) => ({
      sourceItemId: row.sourceItemId,
      sourceId: row.sourceId,
      status: "unresolved" as const,
      candidateId: "",
      workId: "",
      decisionRef: "",
    }));
    value.cacheRecords = [];

    const output = buildRakutenAdjudication(value);

    expect(output.candidates).toEqual([]);
    expect(output.memberships.every((row) => row.status === "excluded-webtoon")).toBe(true);
    expect(output.exclusions).toHaveLength(2);
    expect(
      output.exclusions.every((row) => row["evidenceUrl"]?.includes("nhn-comico.com") === true),
    ).toBe(true);
  });

  it("reuses a Gold work ID only when normalized title and creator both match", () => {
    const value = input();
    value.goldWorks = [
      {
        id: "opposites-you-and-me",
        title: "正反対の君と僕",
        titleKana: "セイハンタイナキミトボク",
        creators: "阿賀沢紅茶",
        status: "completed",
        firstPublishedYear: "2022",
        annotationReviewMethod: "authorizedModelPanel",
        annotationReviewReference: "reviews/gold.md",
      },
    ];
    value.goldAliases = [{ workId: "opposites-you-and-me", alias: "正反対な君と僕" }];

    const output = buildRakutenAdjudication(value);

    expect(output.mappings.every((row) => row.workId === "opposites-you-and-me")).toBe(true);
    expect(output.annotationStatuses[0]).toMatchObject({
      workId: "opposites-you-and-me",
      reviewStatus: "authorizedModelPanel",
      reviewReference: "reviews/gold.md",
    });
  });

  it("leaves ambiguous author matches unresolved", () => {
    const secondAuthorItem = {
      ...baseItem,
      author: "別作家",
      isbn: "9780306406157",
      itemUrl: "https://books.rakuten.co.jp/rb/other/",
    };
    const output = buildRakutenAdjudication(
      input([baseItem, secondAuthorItem], "阿賀沢紅茶;別作家"),
    );

    expect(output.candidates).toEqual([]);
    expect(output.mappings).toEqual([]);
    expect(output.memberships.every((row) => row.status === "unresolved")).toBe(true);
  });
});
