// @vitest-environment jsdom

import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import type * as MotionReact from "motion/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CatalogV1, Work } from "@/domain/catalog/types";
import type { UserWorkRecord } from "@/domain/profile/types";
import { entrySource } from "@/features/landing/entry-source";
import { DnaSharePage } from "@/features/share/dna-share-page";
import type * as Rakuten from "@/infrastructure/rakuten";
import { dnaSharePageStrings, explanationLexicon, workDetailStrings } from "@/lib/strings";
import { createTestWork } from "../../helpers/catalog";

const strings = dnaSharePageStrings;
const isbn = "9780306406157";

const testState = vi.hoisted(() => ({
  userWorks: [] as UserWorkRecord[] | undefined,
  saveProviderCache: vi.fn(),
  requestRakutenBook: vi.fn(),
}));

vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof MotionReact>()),
  useInView: () => true,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
    params,
    to,
  }: {
    children: ReactNode;
    className?: string;
    params?: { workId: string };
    to: string;
  }) => (
    <a className={className} href={params === undefined ? to : `/works/${params.workId}`}>
      {children}
    </a>
  ),
}));

function work(id: string, title: string): Work {
  return { ...createTestWork({ id }), title };
}

const catalog: CatalogV1 = {
  schemaVersion: 1,
  catalogVersion: "v1-test",
  factorDictionaryVersion: "v1",
  works: [
    work("akira", "AKIRA"),
    work("a-silent-voice", "聲の形"),
    work("fire-punch", "ファイアパンチ"),
    work("jujutsu-kaisen", "呪術廻戦"),
  ],
  volumes: [
    {
      id: "fire-punch-v1",
      workId: "fire-punch",
      volumeNumber: 1,
      isbn,
      releaseDate: "2016-01-01",
      editionKind: "standard",
    },
  ],
  representativeVolumeByWorkId: { "fire-punch": "fire-punch-v1" },
};

vi.mock("@/features/catalog/catalog-provider", () => ({
  useCatalog: () => catalog,
  useCatalogIdentity: () => ({
    catalogVersion: catalog.catalogVersion,
    workIds: catalog.works.map((entry) => entry.id),
    profileWorkIds: catalog.works.map((entry) => entry.id),
  }),
}));

vi.mock("@/infrastructure/db", () => ({
  usePersistence: () => ({
    getProviderCache: () => Promise.resolve(null),
    saveProviderCache: testState.saveProviderCache,
    onboardingCompletedAt: null,
    onboardingDraft: null,
    userWorks: testState.userWorks,
  }),
}));

vi.mock("@/infrastructure/rakuten", async (importOriginal) => ({
  ...(await importOriginal<typeof Rakuten>()),
  requestRakutenBook: testState.requestRakutenBook,
}));

afterEach(() => {
  cleanup();
  testState.requestRakutenBook.mockReset();
});

const search =
  "?v=1&dna=4432&ax=93a2&top=012&w=akira,a-silent-voice,retired-work&e=01,1,&n=5&r=fire-punch:darkness,jujutsu-kaisen,retired-work:pacing";

describe("DnaSharePage", () => {
  it("renders the shared DNA, skipping works the Catalog no longer has", async () => {
    testState.requestRakutenBook.mockResolvedValue({
      title: "ファイアパンチ 1",
      author: "藤本タツキ",
      publisherName: "集英社",
      isbn,
      itemPrice: 500,
      itemUrl: "https://books.rakuten.co.jp/rb/1/",
      affiliateUrl:
        "https://hb.afl.rakuten.co.jp/hgc/x/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frb%2F1%2F",
      imageUrl: "https://thumbnail.image.rakuten.co.jp/fire-punch.jpg",
      reviewAverage: 4,
      reviewCount: 10,
    });
    render(<DnaSharePage search={search} />);

    expect(screen.getByRole("heading", { level: 1, name: strings.title })).toBeTruthy();
    expect(screen.getByText(strings.basis(5))).toBeTruthy();
    expect(entrySource()).toBe("share-card");

    const wheel = screen.getByRole("img", { name: /共有された Manga DNA ホイール/u });
    expect(wheel.getAttribute("aria-label")).toBe(
      strings.wheelLabel([
        `${explanationLexicon.factorLabels.darkness}: とても強め`,
        `${explanationLexicon.factorLabels.pacing}: とても強め`,
        `${explanationLexicon.factorLabels.mentalStress}: 強め`,
        `${explanationLexicon.factorLabels.strategy}: ほどほど`,
      ]),
    );
    expect(screen.getByText("『AKIRA』『聲の形』から")).toBeTruthy();
    expect(screen.getByText(strings.moreWorks(3))).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/retired-work|%/u);

    const recommendations = screen.getByRole("region", { name: strings.recommendationsHeading });
    const items = within(recommendations).getAllByRole("listitem");
    expect(items.map((item) => item.getAttribute("data-share-recommendation"))).toEqual([
      "fire-punch",
      "jujutsu-kaisen",
    ]);
    expect(
      within(items[0]!).getByText(strings.reasonChip(explanationLexicon.clusterLabels.toneLoad)),
    ).toBeTruthy();
    expect(within(items[1]!).queryByText(/が近い/u)).toBeNull();

    await waitFor(() =>
      expect(within(items[0]!).getByText(workDetailStrings.provider.affiliate)).toBeTruthy(),
    );
    expect(
      within(items[0]!)
        .getByRole("link", { name: /楽天ブックスを開く/u })
        .getAttribute("href"),
    ).toMatch(/^https:\/\/hb\.afl\.rakuten\.co\.jp\//u);
    expect(
      within(items[1]!)
        .getByRole("link", { name: /楽天ブックスで検索する/u })
        .getAttribute("href"),
    ).toMatch(/^https:\/\/books\.rakuten\.co\.jp\//u);
    expect(within(items[1]!).queryByText(workDetailStrings.provider.affiliate)).toBeNull();
    expect(testState.saveProviderCache).not.toHaveBeenCalled();

    expect(screen.getByRole("link", { name: strings.cta.byVisitor.new }).getAttribute("href")).toBe(
      "/onboarding",
    );
  });

  it("refuses a malformed link instead of rendering part of it", () => {
    render(<DnaSharePage search="?v=1&dna=4432&ax=93a&top=012&w=akira" />);

    expect(screen.getByRole("heading", { level: 1, name: strings.invalid.title })).toBeTruthy();
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByRole("link", { name: strings.cta.byVisitor.new })).toBeTruthy();
  });
});
