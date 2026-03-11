import type { L2ComponentInfoListParams } from "./l2-component-info.types";

export const l2ComponentInfoKeys = {
  all: ["l2-component-info"] as const,
  list: (params: L2ComponentInfoListParams) => ["l2-component-info", "list", params] as const,
  detail: (id: string) => ["l2-component-info", "detail", id] as const,
};
