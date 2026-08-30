const CATALOG_ASSET_DIRECTORY = "catalog";

export function catalogAssetFilename(catalogVersion: string): string {
  return `catalog-v1.${encodeURIComponent(catalogVersion)}.json`;
}

export function catalogAssetUrl(catalogVersion: string): string {
  return `/${CATALOG_ASSET_DIRECTORY}/${catalogAssetFilename(catalogVersion)}`;
}

export function recommendationContextAssetFilename(catalogVersion: string): string {
  return `recommendation-context-v1.${encodeURIComponent(catalogVersion)}.json`;
}

export function recommendationContextAssetUrl(catalogVersion: string): string {
  return `/${CATALOG_ASSET_DIRECTORY}/${recommendationContextAssetFilename(catalogVersion)}`;
}
