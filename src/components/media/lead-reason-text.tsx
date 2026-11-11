/** The lead reason as plain text, with the anchor work it names in bold. */
export function LeadReasonText({
  text,
  anchorTitle,
  anchorIndex,
  strongClassName,
}: Readonly<{
  text: string;
  anchorTitle: string | undefined;
  anchorIndex: number;
  strongClassName: string;
}>) {
  if (anchorTitle === undefined || anchorIndex < 0) return text;
  return (
    <>
      {text.slice(0, anchorIndex)}
      <strong className={strongClassName}>{anchorTitle}</strong>
      {text.slice(anchorIndex + anchorTitle.length)}
    </>
  );
}
