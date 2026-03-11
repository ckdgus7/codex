import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { l2ComponentInfoKeys } from "@/features/ssf/model/l2-component-info.keys";
import { L2_COMPONENT_INFO_MOCK_DATA } from "@/features/ssf/model/l2-component-info.mock";
import type {
  L2ComponentInfoListParams,
  L2ComponentInfoListResponse,
} from "@/features/ssf/model/l2-component-info.types";

function normalizeParams(params: L2ComponentInfoListParams): L2ComponentInfoListParams {
  return {
    status: params.status ?? "전체",
    domain: params.domain ?? "전체",
    scope: params.scope ?? "컴포넌트(L2)명",
    keyword: params.keyword ?? "",
    sortKey: params.sortKey ?? null,
    sortDir: params.sortDir ?? null,
    page: typeof params.page === "number" && params.page > 0 ? params.page : 1,
    size: typeof params.size === "number" && params.size > 0 ? params.size : 10,
  };
}

export function useL2ComponentInfoListQuery(params: L2ComponentInfoListParams) {
  const normalized = normalizeParams(params);

  return useQuery<L2ComponentInfoListResponse>({
    queryKey: l2ComponentInfoKeys.list(normalized),
    queryFn: async () => {
      const keyword = normalized.keyword.trim().toLowerCase();

      const items = L2_COMPONENT_INFO_MOCK_DATA.filter((item) => {
        if (normalized.status === "사용" && item.useYn !== "사용") return false;
        if (normalized.status === "미사용" && item.useYn !== "미사용") return false;
        if (normalized.domain !== "전체" && item.domainName !== normalized.domain) return false;

        if (!keyword) return true;

        if (normalized.scope === "컴포넌트(L2)명") {
          return item.nameKo.toLowerCase().includes(keyword) || item.nameEn.toLowerCase().includes(keyword);
        }

        if (normalized.scope === "컴포넌트ID") {
          return item.componentId.toLowerCase().includes(keyword);
        }

        if (normalized.scope === "해당업무명") {
          return item.businessName.toLowerCase().includes(keyword);
        }

        return [item.componentId, item.nameKo, item.nameEn, item.businessName].some((value) =>
          value.toLowerCase().includes(keyword)
        );
      });

      return {
        items,
        total: items.length,
      };
    },
    placeholderData: keepPreviousData,
  });
}
