import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { featureInfoKeys } from "@/features/ssf/model/feature-info.keys";
import { FEATURE_INFO_MOCK_DATA } from "@/features/ssf/model/feature-info.mock";
import type {
  FeatureInfoListParams,
  FeatureInfoListResponse,
} from "@/features/ssf/model/feature-info.types";

function normalizeParams(params: FeatureInfoListParams): FeatureInfoListParams {
  return {
    status: params.status ?? "전체",
    domain: params.domain ?? "전체",
    component: params.component ?? "전체",
    business: params.business ?? "전체",
    scope: params.scope ?? "기능(L4)명",
    keyword: params.keyword ?? "",
    sortKey: params.sortKey ?? null,
    sortDir: params.sortDir ?? null,
    page: typeof params.page === "number" && params.page > 0 ? params.page : 1,
    size: typeof params.size === "number" && params.size > 0 ? params.size : 10,
  };
}

export function useFeatureInfoListQuery(params: FeatureInfoListParams) {
  const normalized = normalizeParams(params);

  return useQuery<FeatureInfoListResponse>({
    queryKey: featureInfoKeys.list(normalized),
    queryFn: async () => {
      const keyword = normalized.keyword.trim().toLowerCase();

      const items = FEATURE_INFO_MOCK_DATA.filter((item) => {
        if (normalized.status === "사용" && item.useYn !== "사용") return false;
        if (normalized.status === "미사용" && item.useYn !== "미사용") return false;
        if (normalized.domain !== "전체" && item.domainName !== normalized.domain) return false;
        if (normalized.component !== "전체" && item.componentName !== normalized.component) return false;
        if (normalized.business !== "전체" && item.businessName !== normalized.business) return false;

        if (!keyword) return true;

        if (normalized.scope === "기능(L4) ID") {
          return item.featureId.toLowerCase().includes(keyword);
        }

        return item.featureName.toLowerCase().includes(keyword);
      });

      return {
        items,
        total: items.length,
      };
    },
    placeholderData: keepPreviousData,
  });
}
