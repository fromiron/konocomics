import manifestJson from "virtual:catalog-runtime";
import { catalogManifestSchema } from "./catalog-assets-schema";
export const runtimeManifest = catalogManifestSchema.parse(manifestJson);
