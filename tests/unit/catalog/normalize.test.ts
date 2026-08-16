import { describe, expect, it } from "vitest";

import {
  createExternalWorkKey,
  isbnIdentityKey,
  isValidIsbn,
  normalizeIsbn,
  normalizeTitle,
} from "@/domain/catalog/normalize";

describe("normalizeTitle", () => {
  it.each([
    ["キングダム　０１巻", "キングダム", "きんぐだむ"],
    ["ｷﾝｸﾞﾀﾞﾑ 1", "キングダム", "きんぐだむ"],
    ["ｶｰﾄﾞｷｬﾌﾟﾀｰ・さくら 新装版 １", "カードキャプター さくら", "かーどきゃぷたー さくら"],
    ["AKIRA 完全版 上", "akira", "akira"],
    ["ＳＬＡＭ　ＤＵＮＫ 文庫版 10巻", "slam dunk", "slam dunk"],
    ["ダンジョン飯（電子版） 12", "ダンジョン飯", "だんじょん飯"],
    ["鬼滅の刃 23 特装版", "鬼滅の刃", "鬼滅の刃"],
    ["進撃の巨人 1-3巻セット", "進撃の巨人", "進撃の巨人"],
    ["２０世紀少年 完全版 1", "20世紀少年", "20世紀少年"],
    ["３月のライオン 12巻", "3月のライオン", "3月のらいおん"],
  ])("normalizes %s without deleting title-internal numbers", (input, canonical, kanaFolded) => {
    expect(normalizeTitle(input)).toEqual({ canonical, kanaFolded });
  });

  it("creates the external key from normalized title and first creator", () => {
    expect(createExternalWorkKey("キングダム 1", " 原 泰久 ")).toBe('["きんぐだむ","原 泰久"]');
  });
});

describe("ISBN normalization", () => {
  it("normalizes separators and validates ISBN-10 and ISBN-13 checksums", () => {
    expect(normalizeIsbn("978-0-306-40615-7")).toBe("9780306406157");
    expect(isValidIsbn("978-0-306-40615-7")).toBe(true);
    expect(isValidIsbn("0-306-40615-2")).toBe(true);
    expect(isValidIsbn("9780306406158")).toBe(false);
    expect(isbnIdentityKey("0-306-40615-2")).toBe("9780306406157");
    expect(isbnIdentityKey("978-0-306-40615-7")).toBe("9780306406157");
  });
});
