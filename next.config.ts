import type { NextConfig } from "next";

import catalogJson from "./src/data/generated/catalog-v1.json";
import { catalogAssetUrl } from "./src/lib/catalog-asset";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: catalogAssetUrl(catalogJson.catalogVersion),
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
