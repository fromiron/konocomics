import { CoverImage, type CoverImageProps } from "./CoverImage";
import { cn } from "@/lib/utils";

type BookCoverProps = Omit<CoverImageProps, "fit" | "variant" | "matchSourceAspectRatio">;

export function BookCover({ className, ...props }: BookCoverProps) {
  return (
    <span className={cn("book-cover", className)}>
      <span className="book-cover__object">
        <img
          alt=""
          aria-hidden="true"
          className="book-cover__base"
          decoding="async"
          draggable={false}
          height={1024}
          loading="lazy"
          sizes="auto, 225px"
          src="/media/book-base-medium.webp"
          srcSet="/media/book-base-small.webp 256w, /media/book-base-medium.webp 512w, /media/book-base-large.webp 1024w"
          width={1024}
        />
        <span className="book-cover__projection">
          <CoverImage {...props} className="book-cover__face" />
        </span>
      </span>
    </span>
  );
}
