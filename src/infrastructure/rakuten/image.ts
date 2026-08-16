export type RakutenImageSize = 200 | 400 | 600;

export function rewriteRakutenImageUrl(source: string, size: RakutenImageSize): string {
  const hashIndex = source.indexOf("#");
  const base = hashIndex === -1 ? source : source.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : source.slice(hashIndex);
  const sizeValue = `${size}x${size}`;
  const sizedBase = /([?&])_ex=[^&#]*/u.test(base)
    ? base.replace(/([?&])_ex=[^&#]*/u, `$1_ex=${sizeValue}`)
    : `${base}${base.includes("?") ? "&" : "?"}_ex=${sizeValue}`;

  return `${sizedBase}${hash}`;
}
