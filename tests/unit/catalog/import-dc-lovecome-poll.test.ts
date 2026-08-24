import { expect, it } from "vitest";

import { extractDcLovecomePollResults } from "../../../scripts/import-dc-lovecome-poll";

it("extracts only aggregate titles and verifies them against raw lovecome votes", () => {
  const csv = [
    [
      "e",
      "이메일 주소",
      "1 순위 투표",
      "2 순위 투표",
      "",
      "",
      "제목",
      "1순위",
      "2순위",
      "총점",
      "총점 (1.2)",
      "총점(2, 1.5)",
      "총점 (1.5)",
    ],
    [
      "t1",
      "secret@example.com",
      "작품 A",
      "작품 B",
      "",
      "",
      "작품 A",
      "2",
      "1",
      "5",
      "3.4",
      "5.5",
      "4",
    ],
    ["t2", "", "작품 A", "작품 B", "", "", "작품 B", "1", "2", "4", "3.2", "5", "3.5"],
    ["t3", "", "작품 B", "작품 A", "", "", "", "", "", "", "", "", ""],
  ]
    .map((row) => row.map((value) => (value.includes(",") ? `"${value}"` : value)).join(","))
    .join("\n");

  const result = extractDcLovecomePollResults(Buffer.from(`${csv}\n`));

  expect(result).toEqual({
    respondentCount: 3,
    items: [
      {
        sourceRowNumber: 2,
        resultOrder: 1,
        title: "작품 A",
        firstChoiceVotes: 2,
        secondChoiceVotes: 1,
        score2To1: 5,
        score1Point2To1: 3.4,
        score2To1Point5: 5.5,
        score1Point5To1: 4,
      },
      {
        sourceRowNumber: 3,
        resultOrder: 2,
        title: "작품 B",
        firstChoiceVotes: 1,
        secondChoiceVotes: 2,
        score2To1: 4,
        score1Point2To1: 3.2,
        score2To1Point5: 5,
        score1Point5To1: 3.5,
      },
    ],
  });
  expect(JSON.stringify(result)).not.toContain("secret@example.com");
});
