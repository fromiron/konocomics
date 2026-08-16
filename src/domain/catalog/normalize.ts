const EDITION_TOKEN_PATTERN = /(完全版|新装版|文庫版|特装版|限定版|電子版|セット)/gu;
const EXTERNAL_V1_EDITION_TOKEN_PATTERN = /(完全版|新装版|文庫版|特装版|限定版|電子版|せっと)/gu;
const EMPTY_BRACKETS_PATTERN = /[([（【]\s*[)\]）】]/gu;
const VOLUME_SUFFIX_PATTERNS = [
  /\s*\d{1,3}\s*[-~〜–—]\s*\d{1,3}\s*巻?\s*$/u,
  /\s*第?\s*\d{1,3}\s*巻\s*$/u,
  /\s*巻\s*\d{1,3}\s*$/u,
  /\s*[([（【]\s*\d{1,3}\s*[)\]）】]\s*$/u,
  /\s+(?:上|下)\s*$/u,
  /(?<=[^\d])\d{1,3}\s*$/u,
] as const;

function normalizeSpacing(value: string) {
  return value
    .replace(/[・･·]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

export function foldKatakanaToHiragana(value: string) {
  return value.replace(/[ァ-ヶ]/gu, (character) => {
    const codePoint = character.codePointAt(0);
    return codePoint === undefined ? character : String.fromCodePoint(codePoint - 0x60);
  });
}

function stripVolumeAndEditionTokensWithPattern(value: string, editionPattern: RegExp) {
  let normalized = normalizeSpacing(
    value.replace(editionPattern, " ").replace(EMPTY_BRACKETS_PATTERN, " "),
  );
  let previous = "";

  while (previous !== normalized) {
    previous = normalized;
    for (const pattern of VOLUME_SUFFIX_PATTERNS) {
      normalized = normalizeSpacing(normalized.replace(pattern, ""));
    }
  }

  return normalized;
}

export function stripVolumeAndEditionTokens(value: string) {
  return stripVolumeAndEditionTokensWithPattern(value, EDITION_TOKEN_PATTERN);
}

export type NormalizedTitle = {
  canonical: string;
  kanaFolded: string;
};

export function normalizeTitle(value: string): NormalizedTitle {
  const canonical = stripVolumeAndEditionTokens(value.normalize("NFKC").toLocaleLowerCase("ja"));

  return {
    canonical,
    kanaFolded: foldKatakanaToHiragana(canonical),
  };
}

export function normalizeCreator(value: string) {
  return normalizeSpacing(value.normalize("NFKC").toLocaleLowerCase("ja"));
}

export function createExternalWorkKey(title: string, firstCreator: string) {
  return JSON.stringify([
    normalizeExternalTitleV1(title),
    normalizeExternalCreatorV1(firstCreator),
  ]);
}

export function normalizeExternalTitleV1(value: string) {
  const normalized = stripVolumeAndEditionTokensWithPattern(
    foldKatakanaToHiragana(value.normalize("NFKC").toLowerCase()),
    EXTERNAL_V1_EDITION_TOKEN_PATTERN,
  );
  if (normalized.length === 0) {
    throw new TypeError("External work title is empty after v1 normalization");
  }
  return normalized;
}

export function normalizeExternalCreatorV1(value: string) {
  const normalized = foldKatakanaToHiragana(
    normalizeSpacing(value.normalize("NFKC").toLowerCase()),
  );
  if (normalized.length === 0) {
    throw new TypeError("External work creator is empty after v1 normalization");
  }
  return normalized;
}

export function normalizeIsbn(value: string) {
  return value.normalize("NFKC").replace(/[-\s]/gu, "").toUpperCase();
}

export function isbnIdentityKey(value: string) {
  const isbn = normalizeIsbn(value);
  if (!/^\d{9}[\dX]$/u.test(isbn) || !isValidIsbn(isbn)) {
    return isbn;
  }

  const stem = `978${isbn.slice(0, 9)}`;
  const total = [...stem].reduce(
    (sum, digit, index) => sum + Number(digit) * (index % 2 === 0 ? 1 : 3),
    0,
  );
  return `${stem}${(10 - (total % 10)) % 10}`;
}

export function isValidIsbn(value: string) {
  const isbn = normalizeIsbn(value);

  if (/^\d{13}$/u.test(isbn)) {
    const digits = [...isbn].map(Number);
    const total = digits.reduce((sum, digit, index) => sum + digit * (index % 2 === 0 ? 1 : 3), 0);
    return total % 10 === 0;
  }

  if (/^\d{9}[\dX]$/u.test(isbn)) {
    const total = [...isbn].reduce((sum, character, index) => {
      const digit = character === "X" ? 10 : Number(character);
      return sum + digit * (10 - index);
    }, 0);
    return total % 11 === 0;
  }

  return false;
}
