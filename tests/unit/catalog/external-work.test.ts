import { createHash } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  createExternalWorkDetailHref,
  createExternalWorkNormalizedKeyV1,
  deriveExternalWorkIdentityV1,
  parseExternalWorkNormalizedKeyV1,
  parseExternalWorkDetailQuery,
  parseExternalWorkId,
} from "@/domain/catalog/external-work";
import { normalizeExternalCreatorV1, normalizeExternalTitleV1 } from "@/domain/catalog/normalize";
import { createPlannedExternalWorkRecord, hasValidExternalWorkIdentity } from "@/infrastructure/db";
import type { RakutenBookItem } from "@/infrastructure/rakuten";

const EXTERNAL_ID =
  "ext:rakuten:v1:ebbfe45c6734e41f113df7284b2e63fbdef2d285229e699a5109e835a26b88b6" as const;

function sha256Hex(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function createRakutenItem(): RakutenBookItem {
  return {
    title: "キングダム 1",
    author: "原 泰久",
    publisherName: "集英社",
    isbn: "9784091855312",
    imageUrl: "https://thumbnail.image.rakuten.co.jp/external.jpg",
    itemUrl: "https://books.rakuten.co.jp/rb/external/",
    itemPrice: 770,
    availability: 1,
    reviewAverage: 4.5,
    reviewCount: 10,
  };
}

describe("external work identity v1", () => {
  it("freezes title, creator, canonical JSON, namespace, UTF-8 bytes, and full digest", async () => {
    const observedInputs: string[] = [];
    const identity = await deriveExternalWorkIdentityV1("キングダム 1", "原 泰久", (value) => {
      observedInputs.push(value);
      return sha256Hex(value);
    });

    expect(identity).toEqual({
      id: EXTERNAL_ID,
      normalizedKey: '["きんぐだむ","原 泰久"]',
    });
    expect(observedInputs).toEqual([
      'konocomics-external-work-id-v1\0rakuten\0["きんぐだむ","原 泰久"]',
    ]);
  });

  it("groups covered volume and edition variants without changing creator order", () => {
    expect(normalizeExternalTitleV1("ｷﾝｸﾞﾀﾞﾑ・新装版 ０１巻")).toBe("きんぐだむ");
    expect(normalizeExternalCreatorV1(" カタカナ・著者 ")).toBe("かたかな 著者");
    expect(createExternalWorkNormalizedKeyV1("キングダム 1", "原 泰久")).toBe(
      '["きんぐだむ","原 泰久"]',
    );
    expect(parseExternalWorkNormalizedKeyV1('["きんぐだむ","原 泰久"]')).toEqual([
      "きんぐだむ",
      "原 泰久",
    ]);
    expect(() => parseExternalWorkNormalizedKeyV1('[ "きんぐだむ", "原 泰久" ]')).toThrow(
      /not canonical/u,
    );
    expect(() => parseExternalWorkNormalizedKeyV1('["キングダム","原 泰久"]')).toThrow(
      /not canonical/u,
    );
    expect(() => normalizeExternalTitleV1(" 新装版 1巻 ")).toThrow(/title is empty/u);
    expect(() => normalizeExternalCreatorV1("　")).toThrow(/creator is empty/u);
  });

  it("freezes the current v1 edition-token substring boundaries", () => {
    expect(normalizeExternalTitleV1("完全版画集 1")).toBe("画集");
    expect(normalizeExternalTitleV1("セットアップ 1")).toBe("あっぷ");
    expect(normalizeExternalTitleV1("完全画集 1")).toBe("完全画集");
  });

  it("folds kana before removing the frozen edition tokens", async () => {
    const expectedIdentity = {
      id: "ext:rakuten:v1:f1b25200d25d899d365bdde0c10453d5133a448d846967e37d23b2fdd005758e",
      normalizedKey: '["作品","作者"]',
    } as const;

    expect(normalizeExternalTitleV1("作品 セット")).toBe("作品");
    expect(normalizeExternalTitleV1("作品 せっと")).toBe("作品");
    await expect(deriveExternalWorkIdentityV1("作品 セット", "作者", sha256Hex)).resolves.toEqual(
      expectedIdentity,
    );
    await expect(deriveExternalWorkIdentityV1("作品 せっと", "作者", sha256Hex)).resolves.toEqual(
      expectedIdentity,
    );
  });

  it("folds the frozen middle-dot variants to the same key and full digest", async () => {
    const titleWithGreekAnoTeleia = "キングダム·新装版 1";
    const creatorWithGreekAnoTeleia = "原·泰久";

    expect(normalizeExternalTitleV1(titleWithGreekAnoTeleia)).toBe("きんぐだむ");
    expect(normalizeExternalCreatorV1(creatorWithGreekAnoTeleia)).toBe("原 泰久");
    expect(
      createExternalWorkNormalizedKeyV1(titleWithGreekAnoTeleia, creatorWithGreekAnoTeleia),
    ).toBe('["きんぐだむ","原 泰久"]');
    await expect(
      deriveExternalWorkIdentityV1(titleWithGreekAnoTeleia, creatorWithGreekAnoTeleia, sha256Hex),
    ).resolves.toEqual({
      id: EXTERNAL_ID,
      normalizedKey: '["きんぐだむ","原 泰久"]',
    });
  });

  it("rejects unsupported identities and noncanonical digest implementations", async () => {
    expect(() => parseExternalWorkId(`ext:${"a".repeat(64)}`)).toThrow(/supported Rakuten v1/u);
    expect(() => parseExternalWorkId(`ext:rakuten:v2:${"a".repeat(64)}`)).toThrow(
      /supported Rakuten v1/u,
    );
    expect(() => parseExternalWorkId(`ext:rakuten:v1:${"A".repeat(64)}`)).toThrow(
      /supported Rakuten v1/u,
    );
    expect(() => parseExternalWorkId(`ext:rakuten:v1:${"a".repeat(63)}`)).toThrow(
      /supported Rakuten v1/u,
    );
    await expect(
      deriveExternalWorkIdentityV1("キングダム", "原 泰久", () => "ABC"),
    ).rejects.toThrow(/64 lowercase/u);
  });
});

describe("external detail URL", () => {
  it("serializes one canonical query value and rejects missing, duplicate, or malformed ids", () => {
    expect(createExternalWorkDetailHref(EXTERNAL_ID)).toBe(
      `/works/external?workId=${encodeURIComponent(EXTERNAL_ID)}`,
    );
    expect(parseExternalWorkDetailQuery(new URLSearchParams({ workId: EXTERNAL_ID }))).toEqual({
      kind: "valid",
      id: EXTERNAL_ID,
    });
    expect(parseExternalWorkDetailQuery(new URLSearchParams())).toEqual({ kind: "invalid" });
    expect(
      parseExternalWorkDetailQuery(
        new URLSearchParams(
          `workId=${encodeURIComponent(EXTERNAL_ID)}&workId=${encodeURIComponent(EXTERNAL_ID)}`,
        ),
      ),
    ).toEqual({ kind: "invalid" });
    expect(parseExternalWorkDetailQuery(new URLSearchParams({ workId: "external" }))).toEqual({
      kind: "invalid",
    });
  });
});

describe("external record creation", () => {
  it("creates a minimal planned record using only stable identity inputs", async () => {
    const record = await createPlannedExternalWorkRecord(
      createRakutenItem(),
      "2026-08-14T10:00:00+09:00",
    );

    expect(record).toEqual({
      id: EXTERNAL_ID,
      normalizedKey: '["きんぐだむ","原 泰久"]',
      title: "キングダム 1",
      creators: ["原 泰久"],
      isbnSamples: ["9784091855312"],
      coverUrl: "https://thumbnail.image.rakuten.co.jp/external.jpg",
      record: {
        workId: EXTERNAL_ID,
        readingState: "planned",
        updatedAt: "2026-08-14T10:00:00+09:00",
      },
    });
    expect(await hasValidExternalWorkIdentity(record)).toBe(true);
    expect(
      await hasValidExternalWorkIdentity({
        ...record,
        title: "表示名を更新した作品",
        creators: ["表示名を更新した作者"],
      }),
    ).toBe(true);
    expect(
      await hasValidExternalWorkIdentity({
        ...record,
        normalizedKey: '["別作品","別作者"]',
      }),
    ).toBe(false);
    expect(
      await hasValidExternalWorkIdentity({
        ...record,
        id: parseExternalWorkId(`ext:rakuten:v1:${"a".repeat(64)}`),
        record: {
          ...record.record,
          workId: `ext:rakuten:v1:${"a".repeat(64)}`,
        },
      }),
    ).toBe(false);
  });

  it("keeps identity stable across volume ISBN, cover, and timestamp changes", async () => {
    const first = await createPlannedExternalWorkRecord(
      createRakutenItem(),
      "2026-08-14T10:00:00+09:00",
    );
    const laterVolume = await createPlannedExternalWorkRecord(
      {
        ...createRakutenItem(),
        title: "キングダム 新装版 2巻",
        isbn: "9780306406157",
        imageUrl: "https://thumbnail.image.rakuten.co.jp/later-volume.jpg",
      },
      "2026-08-15T10:00:00+09:00",
    );

    expect(laterVolume).toMatchObject({
      id: first.id,
      normalizedKey: first.normalizedKey,
      title: "キングダム 新装版 2巻",
      isbnSamples: ["9780306406157"],
      coverUrl: "https://thumbnail.image.rakuten.co.jp/later-volume.jpg",
      record: {
        workId: first.id,
        updatedAt: "2026-08-15T10:00:00+09:00",
      },
    });
  });
});
