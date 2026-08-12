import type { Metadata } from "next";
import type { ReactNode } from "react";

import { strings } from "../../src/lib/strings";

import "./globals.css";

export const metadata: Metadata = {
  title: strings.g2Harness.metadata.title,
  description: strings.g2Harness.metadata.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
