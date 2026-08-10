const EDITION_TOKEN_PATTERN = /(完全版|新装版|文庫版|特装版|限定版|電子版|セット)/gu;
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
  return value.replace(/[・･]/gu, " ").replace(/\s+/gu, " ").trim();
}

export function foldKatakanaToHiragana(value: string) {
  return value.replace(/[ァ-ヶ]/gu, (character) => {
    const codePoint = character.codePointAt(0);
    return codePoint === undefined ? character : String.fromCodePoint(codePoint - 0x60);
  });
}

export function stripVolumeAndEditionTokens(value: string) {
  let normalized = normalizeSpacing(
    value.replace(EDITION_TOKEN_PATTERN, " ").replace(EMPTY_BRACKETS_PATTERN, " "),
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
  return `${normalizeTitle(title).kanaFolded}::${normalizeCreator(firstCreator)}`;
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
