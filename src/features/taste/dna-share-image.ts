/**
 * Draws the Manga DNA share card with the browser's Canvas 2D API. The caller passes fully
 * resolved text and values, so the card shows exactly what the dialog previews; the returned
 * PNG blob is both the preview and the saved file.
 *
 * Layout is a bento of rounded tiles on a dark, lightly grained ground. The top preferences sit
 * on the accent tile as one equal set whose strength is each row's bar; a stat tile carries the
 * analysed work count; a second tile names what is scarce in the liked works; and the analysed
 * works appear as chips whose count, with 「ほか N作品」, always adds up to the analysed count.
 * Values are drawn on the Manga DNA 0–4 track, never printed as numbers or percentages.
 */

export type DnaShareImageRow = Readonly<{
  label: string;
  /** 0–4 on the Manga DNA meter scale. */
  value: number;
}>;

export type DnaShareImageText = Readonly<{
  brand: readonly Readonly<{ text: string; accent: boolean }>[];
  kicker: string;
  eyebrow: string;
  preferences: readonly DnaShareImageRow[];
  analyzedCount: number;
  analyzedUnit: string;
  works: Readonly<{
    heading: string;
    /** Titles the reader chose to show, in display order. */
    titles: readonly string[];
    /** Chip for analysed works not named on the card (hidden or out of room). */
    moreLabel: (count: number) => string;
  }>;
  /** Scarce Axes; omitted when the summary confirms none. */
  restrained?: Readonly<{ heading: string; rows: readonly DnaShareImageRow[] }>;
  footerLead: string;
  footerLink: string;
}>;

export const DNA_SHARE_IMAGE_WIDTH = 1080;
export const DNA_SHARE_IMAGE_HEIGHT = 1350;

const MARGIN = 56;
const GAP = 20;
const RADIUS = 44;
const TILE_PADDING = 52;
const CONTENT_WIDTH = DNA_SHARE_IMAGE_WIDTH - MARGIN * 2;
const FONT_TIMEOUT_MS = 3000;
const GRAIN_SEED = 0x6b6f6e6f;
const CHIP_HEIGHT = 56;
const CHIP_GAP = 12;
const CHIP_PADDING = 24;
const CHIP_ROWS = 2;

// Characters Japanese typesetting keeps off the start of a line.
const NO_LINE_START = new Set([
  ..."、。，．・：；？！」』）】〕〉》ーぁぃぅぇぉっゃゅょァィゥェォッャュョ…",
]);

type Palette = Readonly<{
  canvas: string;
  surface: string;
  surfaceRaised: string;
  line: string;
  text: string;
  textStrong: string;
  textMuted: string;
  accent: string;
  onAccent: string;
}>;

const FALLBACK_PALETTE: Palette = {
  canvas: "#0b0f15",
  surface: "#121821",
  surfaceRaised: "#19202b",
  line: "#2a3342",
  text: "#dde2ea",
  textStrong: "#f5f7fa",
  textMuted: "#9aa3b2",
  accent: "#e0a857",
  onAccent: "#2a1f12",
};

function cssColor(
  context: CanvasRenderingContext2D,
  styles: CSSStyleDeclaration,
  token: string,
  fallback: string,
) {
  context.fillStyle = fallback;
  const value = styles.getPropertyValue(token).trim();
  // An unsupported color syntax leaves the fallback in place.
  if (value !== "") context.fillStyle = value;
  return context.fillStyle;
}

function readPalette(context: CanvasRenderingContext2D): Palette {
  const styles = window.getComputedStyle(document.documentElement);
  const read = (token: string, key: keyof Palette) =>
    cssColor(context, styles, token, FALLBACK_PALETTE[key]);
  return {
    canvas: read("--canvas", "canvas"),
    surface: read("--surface-1", "surface"),
    surfaceRaised: read("--surface-2", "surfaceRaised"),
    line: read("--line", "line"),
    text: read("--text", "text"),
    textStrong: read("--text-strong", "textStrong"),
    textMuted: read("--text-muted", "textMuted"),
    accent: read("--accent", "accent"),
    onAccent: read("--on-accent", "onAccent"),
  };
}

function fontFamilies() {
  const sans = window.getComputedStyle(document.body).fontFamily || "sans-serif";
  const display =
    window.getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() ||
    sans;
  return { sans, display };
}

async function loadFonts(families: { sans: string; display: string }, text: string) {
  if (document.fonts === undefined) return;
  // Loading with the card's own text pulls exactly the Japanese subsets the card needs.
  const loads = [400, 500, 700, 800].flatMap((weight) => [
    document.fonts.load(`${String(weight)} 40px ${families.sans}`, text),
    document.fonts.load(`${String(weight)} 40px ${families.display}`, text),
  ]);
  let timer: number | undefined;
  await Promise.race([
    Promise.allSettled(loads),
    new Promise<void>((resolve) => {
      timer = window.setTimeout(resolve, FONT_TIMEOUT_MS);
    }),
  ]);
  window.clearTimeout(timer);
}

/** Splits text into at most `maxLines` lines that fit `maxWidth`, ending with … when cut. */
export function wrapText(
  measure: (text: string) => number,
  text: string,
  maxWidth: number,
  maxLines: number,
) {
  const characters = [...text];
  const lines: string[] = [];
  let line = "";
  for (const character of characters) {
    const candidate = line + character;
    if (measure(candidate) <= maxWidth || line === "") {
      line = candidate;
      continue;
    }
    // Carry the previous character along when this one may not start a line.
    if (NO_LINE_START.has(character) && [...line].length > 1) {
      const kept = [...line];
      const carried = kept.pop() ?? "";
      lines.push(kept.join(""));
      line = carried + character;
    } else {
      lines.push(line);
      line = character;
    }
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && line !== "") lines.push(line);
  if ([...lines.join("")].length < characters.length && lines.length > 0) {
    let last = [...(lines[lines.length - 1] ?? "")];
    while (last.length > 0 && measure(`${last.join("")}…`) > maxWidth) last = last.slice(0, -1);
    lines[lines.length - 1] = `${last.join("")}…`;
  }
  return lines;
}

/**
 * Places chips left to right on up to `maxRows` rows, keeping room on the last row for a
 * trailing chip of `reserve` width. Returns how many leading chips fit.
 */
export function fitChips(
  widths: readonly number[],
  maxWidth: number,
  gap: number,
  maxRows: number,
  reserve: number,
) {
  let row = 1;
  let rowWidth = 0;
  for (const [index, chipWidth] of widths.entries()) {
    const needed = rowWidth === 0 ? chipWidth : rowWidth + gap + chipWidth;
    const limit = row === maxRows ? maxWidth - (reserve > 0 ? gap + reserve : 0) : maxWidth;
    if (needed <= limit) {
      rowWidth = needed;
      continue;
    }
    if (row === maxRows) return index;
    row += 1;
    rowWidth = chipWidth;
  }
  return widths.length;
}

/** Deterministic 32-bit PRNG, so preview and saved file carry the same grain. */
function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function setLetterSpacing(context: CanvasRenderingContext2D, value: string) {
  // Older engines ignore the property; the card still reads without tracking.
  if ("letterSpacing" in context) context.letterSpacing = value;
}

export async function renderDnaShareImage(text: DnaShareImageText): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = DNA_SHARE_IMAGE_WIDTH;
  canvas.height = DNA_SHARE_IMAGE_HEIGHT;
  const context = canvas.getContext("2d");
  if (context === null) throw new Error("Canvas 2D is unavailable");

  const families = fontFamilies();
  await loadFonts(
    families,
    [
      ...text.brand.map((part) => part.text),
      text.kicker,
      text.eyebrow,
      ...text.preferences.map((row) => row.label),
      text.analyzedUnit,
      text.works.heading,
      ...text.works.titles,
      text.works.moreLabel(0),
      text.restrained?.heading ?? "",
      ...(text.restrained?.rows.map((row) => row.label) ?? []),
      text.footerLead,
      text.footerLink,
      "0123456789+…",
    ].join(""),
  );
  const palette = readPalette(context);
  const font = (weight: number, size: number, family = families.sans) =>
    `${String(weight)} ${String(size)}px ${family}`;
  const width = (value: string) => context.measureText(value).width;
  const right = MARGIN + CONTENT_WIDTH;

  const tile = (x: number, y: number, w: number, h: number, fill: string) => {
    context.fillStyle = fill;
    context.beginPath();
    context.roundRect(x, y, w, h, RADIUS);
    context.fill();
  };
  const meter = (
    x: number,
    y: number,
    length: number,
    height: number,
    value: number,
    trackFill: string,
    trackAlpha: number,
    fill: string,
  ) => {
    context.save();
    context.globalAlpha = trackAlpha;
    context.fillStyle = trackFill;
    context.beginPath();
    context.roundRect(x, y, length, height, height / 2);
    context.fill();
    context.restore();
    const filled = (Math.min(4, Math.max(0, value)) / 4) * length;
    if (filled <= 0) return;
    context.fillStyle = fill;
    context.beginPath();
    context.roundRect(x, y, Math.max(filled, height), height, height / 2);
    context.fill();
  };

  // Ground: canvas, a warm light from the top right, a cool one bottom left, and fine grain.
  context.fillStyle = palette.canvas;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const warm = context.createRadialGradient(1000, 90, 0, 1000, 90, 760);
  warm.addColorStop(0, palette.accent);
  warm.addColorStop(1, "transparent");
  context.globalAlpha = 0.24;
  context.fillStyle = warm;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const cool = context.createRadialGradient(60, 1320, 0, 60, 1320, 760);
  cool.addColorStop(0, palette.surfaceRaised);
  cool.addColorStop(1, "transparent");
  context.globalAlpha = 1;
  context.fillStyle = cool;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const random = mulberry32(GRAIN_SEED);
  context.fillStyle = palette.textStrong;
  for (let index = 0; index < 9000; index += 1) {
    context.globalAlpha = 0.02 + random() * 0.035;
    context.fillRect(random() * canvas.width, random() * canvas.height, 1.6, 1.6);
  }
  context.globalAlpha = 1;
  context.textBaseline = "alphabetic";

  // Header: wordmark and a pill with the card's name.
  let x = MARGIN + 4;
  context.font = font(700, 38, families.display);
  for (const part of text.brand) {
    context.fillStyle = part.accent ? palette.accent : palette.textStrong;
    context.fillText(part.text, x, 104);
    x += width(part.text);
  }
  context.font = font(700, 22, families.display);
  setLetterSpacing(context, "5px");
  const kickerWidth = width(text.kicker) + 44;
  context.strokeStyle = palette.line;
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(right - kickerWidth, 66, kickerWidth, 50, 25);
  context.stroke();
  context.fillStyle = palette.text;
  context.fillText(text.kicker, right - kickerWidth + 22, 99);
  setLetterSpacing(context, "0px");

  // Work chips are measured first: their row count sets the works tile height.
  context.font = font(700, 28);
  const worksInner = CONTENT_WIDTH - TILE_PADDING * 2;
  const chipLabels = text.works.titles.map(
    (title) => wrapText(width, title, worksInner - CHIP_PADDING * 2 - 200, 1)[0] ?? "",
  );
  const chipWidths = chipLabels.map((label) => width(label) + CHIP_PADDING * 2);
  const moreWidth = (count: number) => width(text.works.moreLabel(count)) + CHIP_PADDING * 2;
  const reserveCandidate = moreWidth(text.analyzedCount);
  let shown = fitChips(chipWidths, worksInner, CHIP_GAP, CHIP_ROWS, 0);
  let unnamed = text.analyzedCount - shown;
  if (unnamed > 0) {
    shown = fitChips(chipWidths, worksInner, CHIP_GAP, CHIP_ROWS, reserveCandidate);
    unnamed = text.analyzedCount - shown;
  }
  const chips = [
    ...chipLabels.slice(0, shown).map((label, index) => ({
      label,
      width: chipWidths[index] ?? 0,
      quiet: false,
    })),
    ...(unnamed > 0
      ? [{ label: text.works.moreLabel(unnamed), width: moreWidth(unnamed), quiet: true }]
      : []),
  ];
  const chipRows: (typeof chips)[] = [[]];
  let rowWidth = 0;
  for (const chip of chips) {
    const current = chipRows[chipRows.length - 1] ?? [];
    const needed = current.length === 0 ? chip.width : rowWidth + CHIP_GAP + chip.width;
    if (current.length > 0 && needed > worksInner) {
      chipRows.push([chip]);
      rowWidth = chip.width;
    } else {
      current.push(chip);
      rowWidth = needed;
    }
  }

  // Bottom-up geometry: footer, works tile, stat row; the accent tile takes the rest.
  const footerY = DNA_SHARE_IMAGE_HEIGHT - 60;
  const worksHeight = 40 + 30 + 28 + chipRows.length * (CHIP_HEIGHT + CHIP_GAP) - CHIP_GAP + 40;
  const worksTop = footerY - 60 - worksHeight;
  const statHeight = 280;
  const statTop = worksTop - GAP - statHeight;
  const heroTop = 150;
  const heroHeight = statTop - GAP - heroTop;

  // Accent tile: the top preferences as one equal set.
  tile(MARGIN, heroTop, CONTENT_WIDTH, heroHeight, palette.accent);
  const heroX = MARGIN + TILE_PADDING;
  const heroInner = CONTENT_WIDTH - TILE_PADDING * 2;
  const rankWidth = 88;
  const labelX = heroX + rankWidth;
  const labelWidth = heroInner - rankWidth;
  context.fillStyle = palette.onAccent;
  context.globalAlpha = 0.7;
  context.font = font(700, 30);
  context.fillText(text.eyebrow, heroX, heroTop + TILE_PADDING + 24);
  context.globalAlpha = 1;
  const rowsTop = heroTop + TILE_PADDING + 56;
  const rowsBottom = heroTop + heroHeight - TILE_PADDING;
  const rowHeight = (rowsBottom - rowsTop) / Math.max(3, text.preferences.length);
  // One shared size: the largest that fits every label and leaves each row room for its bar.
  let labelSize = Math.min(80, Math.floor(rowHeight * 0.56));
  const allFit = () =>
    text.preferences.every((row) => {
      context.font = font(800, labelSize);
      return width(row.label) <= labelWidth;
    });
  while (labelSize > 44 && !allFit()) labelSize -= 2;
  for (const [index, row] of text.preferences.entries()) {
    const rowTop = rowsTop + index * rowHeight;
    const baseline = rowTop + labelSize * 0.98;
    context.save();
    context.globalAlpha = 0.5;
    context.fillStyle = palette.onAccent;
    context.font = font(700, 32, families.display);
    context.fillText(`0${String(index + 1)}`, heroX, baseline);
    context.restore();
    context.fillStyle = palette.onAccent;
    context.font = font(800, labelSize);
    const [line = ""] = wrapText(width, row.label, labelWidth, 1);
    context.fillText(line, labelX, baseline);
    meter(
      labelX,
      baseline + 22,
      labelWidth,
      8,
      row.value,
      palette.onAccent,
      0.18,
      palette.onAccent,
    );
  }

  // Stat row: analysed work count, and what the liked works have little of.
  const hasRestrained = text.restrained !== undefined && text.restrained.rows.length > 0;
  const statWidth = hasRestrained ? 320 : CONTENT_WIDTH;
  tile(MARGIN, statTop, statWidth, statHeight, palette.surfaceRaised);
  const count = String(text.analyzedCount);
  // The numeral stays above the unit line: its cap height fits the tile's free height.
  let countSize = Math.floor((statHeight - TILE_PADDING * 2 - 56) / 0.74);
  context.font = font(700, countSize, families.display);
  while (countSize > 90 && width(count) > statWidth - TILE_PADDING * 2) {
    countSize -= 10;
    context.font = font(700, countSize, families.display);
  }
  context.fillStyle = palette.accent;
  context.fillText(count, heroX - 8, statTop + TILE_PADDING + countSize * 0.74);
  context.fillStyle = palette.text;
  context.font = font(700, 30);
  context.fillText(text.analyzedUnit, heroX, statTop + statHeight - TILE_PADDING + 4);

  if (hasRestrained && text.restrained !== undefined) {
    const tileX = MARGIN + statWidth + GAP;
    const tileWidth = CONTENT_WIDTH - statWidth - GAP;
    tile(tileX, statTop, tileWidth, statHeight, palette.surfaceRaised);
    const innerX = tileX + TILE_PADDING;
    const innerWidth = tileWidth - TILE_PADDING * 2;
    context.fillStyle = palette.textMuted;
    context.font = font(700, 26);
    context.fillText(text.restrained.heading, innerX, statTop + TILE_PADDING + 20);
    const rowsStart = statTop + TILE_PADDING + 40;
    const rowSpan = (statHeight - TILE_PADDING * 2 - 40 + 12) / 3;
    const labelColumn = innerWidth * 0.56;
    for (const [index, row] of text.restrained.rows.entries()) {
      const baseline = rowsStart + rowSpan * index + rowSpan / 2 + 10;
      context.fillStyle = palette.textStrong;
      context.font = font(700, 30);
      const [line = ""] = wrapText(width, row.label, labelColumn - 20, 1);
      context.fillText(line, innerX, baseline);
      meter(
        innerX + labelColumn,
        baseline - 14,
        innerWidth - labelColumn,
        12,
        row.value,
        palette.line,
        1,
        palette.textMuted,
      );
    }
  }

  // Works tile: every analysed work is either a named chip or counted in 「ほか N作品」.
  tile(MARGIN, worksTop, CONTENT_WIDTH, worksHeight, palette.surface);
  context.fillStyle = palette.textMuted;
  context.font = font(700, 26);
  context.fillText(text.works.heading, heroX, worksTop + 40 + 26);
  context.font = font(700, 28);
  let chipY = worksTop + 40 + 30 + 28;
  for (const row of chipRows) {
    let chipX = heroX;
    for (const chip of row) {
      context.beginPath();
      context.roundRect(chipX, chipY, chip.width, CHIP_HEIGHT, CHIP_HEIGHT / 2);
      if (chip.quiet) {
        context.strokeStyle = palette.line;
        context.lineWidth = 2;
        context.stroke();
        context.fillStyle = palette.textMuted;
      } else {
        context.fillStyle = palette.surfaceRaised;
        context.fill();
        context.fillStyle = palette.text;
      }
      context.fillText(chip.label, chipX + CHIP_PADDING, chipY + 38);
      chipX += chip.width + CHIP_GAP;
    }
    chipY += CHIP_HEIGHT + CHIP_GAP;
  }

  // Footer: invitation and the fixed entry domain.
  context.font = font(700, 30, families.display);
  const linkWidth = width(text.footerLink);
  context.fillStyle = palette.accent;
  context.fillText(text.footerLink, right - linkWidth - 4, footerY);
  context.font = font(500, 28);
  context.fillStyle = palette.textMuted;
  const [footerLead = ""] = wrapText(width, text.footerLead, CONTENT_WIDTH - linkWidth - 48, 1);
  context.fillText(footerLead, MARGIN + 4, footerY);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob === null) reject(new Error("The card image could not be encoded"));
      else resolve(blob);
    }, "image/png");
  });
}
