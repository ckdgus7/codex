import type { FeatureInfoListParams } from "@/features/ssf/model/feature-info.types";

export const featureInfoKeys = {
  all: ["feature-info"] as const,
  list: (params: FeatureInfoListParams) => ["feature-info", "list", params] as const,
  detail: (id: string) => ["feature-info", "detail", id] as const,
};
