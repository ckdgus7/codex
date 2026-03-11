import type { L3BusinessInfoListParams } from "./l3-business-info.types";

export const l3BusinessInfoKeys = {
  all: ["l3-business-info"] as const,
  list: (params: L3BusinessInfoListParams) => [...l3BusinessInfoKeys.all, "list", params] as const,
};
