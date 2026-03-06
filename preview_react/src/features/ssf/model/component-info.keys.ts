import type { ComponentInfoListParams } from "./component-info.types";

export const componentInfoKeys = {
  all: ["component-info"] as const,
  list: (params: ComponentInfoListParams) => ["component-info", "list", params] as const,
  detail: (id: string) => ["component-info", "detail", id] as const,
};
