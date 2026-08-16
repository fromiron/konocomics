const CATALOG_ASSET_DIRECTORY = "catalog";

export function catalogAssetFilename(catalogVersion: string): string {
  return `catalog-v1.${encodeURIComponent(catalogVersion)}.json`;
}

export function catalogAssetUrl(catalogVersion: string): string {
  return `/${CATALOG_ASSET_DIRECTORY}/${catalogAssetFilename(catalogVersion)}`;
}
