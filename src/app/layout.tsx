import type { Metadata } from "next";
import type { ReactNode } from "react";

import { strings } from "@/lib/strings";

import "./globals.css";

export const metadata: Metadata = {
  title: strings.appName,
  description: strings.metadata.description,
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
