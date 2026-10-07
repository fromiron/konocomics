import { useId, type CSSProperties } from "react";

import { AXIS_IDS } from "@/domain/catalog/constants";
import { explanationLexicon, landingStrings } from "@/lib/strings";

import type { LandingSample } from "./landing-types";

/** Each glyph starts this far round from its place and turns home as the wheel spins once. */
const GLYPH_SCRAMBLE_DEG = 47;

/**
 * The Manga DNA axes as the spokes of a wheel, each label running outward from the rim. While
 * the section scrolls by, the wheel turns once and each scattered glyph swings into line until
 * every axis reads. Labels on the left half run inward and upright, so none reads upside down.
 * The sample profile's strongest axes are set in the accent. The axis list is the meaning; the
 * wheel is decoration over it.
 */
export function HomeAxisWheel({ sample }: Readonly<{ sample: LandingSample }>) {
  const headingId = useId();
  const highlighted = new Set(sample.axes.map((axis) => axis.axisId));
  const count = AXIS_IDS.length;
  const title = landingStrings.wheel.title(count);

  return (
    <section aria-labelledby={headingId} className="home-wheel">
      <div className="home-wheel__stage">
        <div className="home-wheel__center">
          <h2 className="home-wheel__title" id={headingId}>
            {/* The count is set large; the heading's name is the whole sentence. */}
            <span className="home-wheel__count">{count}</span>
            {title.slice(String(count).length)}
          </h2>
        </div>
        <p className="home-wheel__legend">
          <span aria-hidden="true" className="home-wheel__legend-dot" />
          {landingStrings.wheel.legend}
        </p>
        <ul aria-label={landingStrings.wheel.axesLabel} className="home-wheel__ring">
          {AXIS_IDS.map((axisId, spoke) => {
            const label = explanationLexicon.factorLabels[axisId];
            const angle = (360 / count) * spoke - 90;
            const normalized = ((angle % 360) + 360) % 360;
            const flip = normalized > 90 && normalized < 270 ? 1 : 0;
            const glyphs = [...label];
            return (
              <li
                aria-label={label}
                className="home-wheel__spoke"
                data-highlight={highlighted.has(axisId) ? "" : undefined}
                key={axisId}
                style={{ "--spoke-angle": `${String(angle)}deg` } as CSSProperties}
              >
                {glyphs.map((glyph, index) => (
                  <span
                    aria-hidden="true"
                    className="home-wheel__glyph"
                    key={index}
                    style={
                      {
                        "--glyph-slot": flip === 1 ? glyphs.length - 1 - index : index,
                        "--glyph-scramble": `${String((index + 1) * GLYPH_SCRAMBLE_DEG * (spoke % 2 === 0 ? 1 : -1))}deg`,
                        "--glyph-flip": flip,
                      } as CSSProperties
                    }
                  >
                    {glyph}
                  </span>
                ))}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
