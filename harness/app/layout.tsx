import type { Metadata } from "next";
import type { ReactNode } from "react";

import { g2HarnessStrings } from "../../src/lib/strings";

import "./globals.css";

export const metadata: Metadata = {
  title: g2HarnessStrings.metadata.title,
  description: g2HarnessStrings.metadata.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
