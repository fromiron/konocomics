import { Link } from "@tanstack/react-router";

import { CoverImage } from "@/components/cover/CoverImage";
import { landingStrings } from "@/lib/strings";

import { LeadReasonText, useSampleReason } from "./landing-sample-card";
import type { LandingSample } from "./landing-types";

const CAPTION_ANCHOR_COUNT = 2;

type HomeHeroResultProps = Readonly<{
  sample: LandingSample;
  coverUrl: string | null | undefined;
  onCoverVisible(): void;
}>;

/**
 * The hero page's last panel: the example profile's real recommendation, its cover beside an
 * inked speech balloon carrying the engine's lead reason. It is labelled as an example for
 * someone who likes the sample's first works, so it never reads as the visitor's own result.
 */
export function HomeHeroResult({ coverUrl, onCoverVisible, sample }: HomeHeroResultProps) {
  const work = sample.recommendation.work;
  const { lead, anchorTitle, anchorIndex } = useSampleReason(sample);

  return (
    <figure className="hh-result__body">
      <CoverImage
        className="hh-result__cover"
        coverUrl={coverUrl}
        creators={work.creators}
        onVisible={onCoverVisible}
        requestedSize={200}
        title={work.title}
      />
      <figcaption className="hh-result__caption">
        {landingStrings.sample.caption(
          sample.anchorWorks.slice(0, CAPTION_ANCHOR_COUNT).map((anchor) => anchor.title),
        )}
      </figcaption>
      <p className="hh-result__work">
        <Link
          aria-label={landingStrings.sample.detail(work.title)}
          className="hh-result__title"
          params={{ workId: work.id }}
          preload={false}
          to="/works/$workId"
        >
          {work.title}
        </Link>
        <span className="hh-result__creators">{work.creators.join("・")}</span>
      </p>
      {lead === undefined ? null : (
        <p className="hh-balloon">
          <LeadReasonText
            anchorIndex={anchorIndex}
            anchorTitle={anchorTitle}
            strongClassName="font-bold"
            text={lead.text}
          />
        </p>
      )}
    </figure>
  );
}
