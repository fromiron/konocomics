import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { BookCover } from "@/components/cover/BookCover";
import type { Work } from "@/domain/catalog/types";
import { workDetailStrings } from "@/lib/strings";

export function SameAuthorBanner({
  author,
  work,
  coverUrl,
  onCoverVisible,
}: Readonly<{
  author: string;
  work: Work;
  coverUrl?: string | null;
  onCoverVisible: () => void;
}>) {
  return (
    <aside aria-labelledby="same-author-heading" className="same-author-banner">
      <Link
        aria-label={workDetailStrings.sameAuthor.open(work.title)}
        className="same-author-banner__link"
        params={{ workId: work.id }}
        to="/works/$workId"
      >
        <BookCover
          coverUrl={coverUrl}
          creators={work.creators}
          decorative
          onVisible={onCoverVisible}
          requestedSize={400}
          title={work.title}
        />
        <div className="same-author-banner__copy">
          <h2 className="same-author-banner__eyebrow" id="same-author-heading">
            {workDetailStrings.sameAuthor.heading(author)}
          </h2>
          <p className="same-author-banner__title">{work.title}</p>
          <span className="same-author-banner__action">
            {workDetailStrings.sameAuthor.view}
            <ChevronRight aria-hidden="true" size={20} />
          </span>
        </div>
      </Link>
    </aside>
  );
}
