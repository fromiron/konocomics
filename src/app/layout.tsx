import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { AppShell } from "@/components/nav/app-shell";
import catalogJson from "@/data/generated/catalog-v1.json";
import { catalogV1Schema } from "@/domain/catalog/schema";
import { catalogIdentityFromCatalog } from "@/features/catalog/catalog-identity";
import { CatalogIdentityProvider } from "@/features/catalog/catalog-provider";
import { PersistenceProvider } from "@/infrastructure/db";
import { coreStrings } from "@/lib/strings";

import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-jp",
  preload: false,
  fallback: ["Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
  adjustFontFallback: true,
});

const spaceGrotesk = Space_Grotesk({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: coreStrings.appName,
  description: coreStrings.metadata.description,
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const catalogResult = catalogV1Schema.safeParse(catalogJson);
const currentCatalogIdentity = catalogResult.success
  ? catalogIdentityFromCatalog(catalogResult.data)
  : null;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body className={`${notoSansJp.variable} ${spaceGrotesk.variable}`}>
        <CatalogIdentityProvider identity={currentCatalogIdentity}>
          <PersistenceProvider>
            <AppShell>{children}</AppShell>
          </PersistenceProvider>
        </CatalogIdentityProvider>
      </body>
    </html>
  );
}
