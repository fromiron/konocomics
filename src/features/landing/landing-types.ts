import type { Work } from "@/domain/catalog/types";

export type LandingWork = Pick<Work, "id" | "title" | "creators" | "genres" | "status"> &
  Readonly<{ isbn?: string }>;
