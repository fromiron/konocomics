import * as z from "zod/v4";
import type { CatalogV1 } from "../../domain/catalog/types";
import type { RecommendationContext } from "../../domain/recommendation/types";
import { catalogV1Schema } from "../../domain/catalog/schema";
import { recommendationContextSchema } from "../../domain/recommendation/context-schema";

export const assetHashSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const catalogManifestSchema = z.strictObject({
  schemaVersion: z.literal(1),
  catalogVersion: z.string().min(1),
  root: assetHashSchema,
  recommendationRoot: assetHashSchema,
  workCount: z.number().int().nonnegative(),
  catalogAverageRating: z.number().min(0).max(5),
});
export type CatalogManifest = z.infer<typeof catalogManifestSchema>;
export type CatalogNode =
  | { kind: "directory"; children: Record<string, string> }
  | { kind: "leaf"; catalog: CatalogV1; context: RecommendationContext };
export const catalogNodeSchema: z.ZodType<CatalogNode> = z.discriminatedUnion("kind", [
  z.strictObject({
    kind: z.literal("directory"),
    children: z.record(z.string().regex(/^[a-f0-9]$/), assetHashSchema),
  }),
  z.strictObject({
    kind: z.literal("leaf"),
    catalog: catalogV1Schema,
    context: recommendationContextSchema,
  }),
]);
export const CATALOG_ASSET_CACHE = "konocomics-catalog-assets-v1";
export const CATALOG_LEAF_MAX_BYTES = 64 * 1024;
export const RECOMMENDATION_LEAF_MAX_BYTES = 512 * 1024;
export function catalogNodeUrl(hash: string) {
  return `/catalog/nodes/${assetHashSchema.parse(hash)}.json`;
}
