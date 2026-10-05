import type { CSSProperties } from "react";

import { landingStrings } from "@/lib/strings";

/** Where a glyph waits before the sentence assembles: viewport units, pixels and degrees. */
export type GlyphScatter = Readonly<{ x: number; y: number; z: number; turn: number }>;

/** Deterministic pseudo-random sequence (mulberry32), so the scatter is the same on every load. */
function sequence(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Scatter positions for `count` glyphs: spread across the screen (±42vw, ±38svh), some toward
 * and some away from the viewer, each turned. Neighbours alternate up and down so the line
 * reads as torn apart rather than shifted.
 */
export function glyphScatter(count: number, seed = 0x6b6f6e6f): GlyphScatter[] {
  const next = sequence(seed);
  return Array.from({ length: count }, (_, index) => {
    const side = index % 2 === 0 ? 1 : -1;
    return {
      x: Math.round((next() * 2 - 1) * 42),
      y: Math.round(side * (8 + next() * 30)),
      z: Math.round(-420 + next() * 900),
      turn: Math.round((next() * 2 - 1) * 110),
    };
  });
}

const phrases = landingStrings.how.titlePhrases;
const accent = landingStrings.how.titleAccent;

/** Each phrase split into glyphs with one running index and its accent flag. */
const glyphs = (() => {
  let index = 0;
  return phrases.map((phrase) => {
    const accentStart = phrase.indexOf(accent);
    return [...phrase].map((character, position) => ({
      character,
      index: index++,
      accent: accentStart >= 0 && position >= accentStart && position < accentStart + accent.length,
    }));
  });
})();

const scatter = glyphScatter(glyphs.flat().length);

/**
 * 「5作品を選ぶと、好みが言葉になる」 as a scroll scene: the glyphs start scattered through the
 * screen in depth and fly together into the sentence as the section scrolls by, the way five
 * separate favourites become one description of a taste. The heading's name is the whole
 * sentence; the glyphs are decoration. Without scroll timelines it is simply the sentence.
 */
export function HomeScrambleHeading({ id }: Readonly<{ id: string }>) {
  return (
    <section aria-labelledby={id} className="home-scramble">
      <div className="home-scramble__stage">
        <h2 className="home-scramble__sentence" id={id}>
          <span className="sr-only">{landingStrings.how.title}</span>
          {glyphs.map((phrase, phraseIndex) => (
            <span aria-hidden="true" className="home-scramble__phrase" key={phraseIndex}>
              {phrase.map(({ accent: isAccent, character, index }) => {
                const offset = scatter[index]!;
                return (
                  <span
                    className="home-scramble__glyph"
                    data-accent={isAccent ? "" : undefined}
                    key={index}
                    style={
                      {
                        "--glyph-x": offset.x,
                        "--glyph-y": offset.y,
                        "--glyph-z": offset.z,
                        "--glyph-turn": offset.turn,
                      } as CSSProperties
                    }
                  >
                    {character}
                  </span>
                );
              })}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
