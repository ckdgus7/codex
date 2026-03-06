import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { componentInfoKeys } from "@/features/ssf/model/component-info.keys";
import { COMPONENT_INFO_MOCK_DATA } from "@/features/ssf/model/component-info.mock";
import type { ComponentInfoListParams, ComponentInfoListResponse, ComponentPeriod } from "@/features/ssf/model/component-info.types";

function normalizeParams(params: ComponentInfoListParams): ComponentInfoListParams {
  return {
    keyword: params.keyword ?? "",
    period: params.period ?? "3개월",
  };
}

function toPeriodDays(period: ComponentPeriod) {
  switch (period) {
    case "1개월":
      return 30;
    case "3개월":
      return 90;
    case "6개월":
      return 180;
    default:
      return 90;
  }
}

export function useComponentInfoListQuery(params: ComponentInfoListParams) {
  const normalized = normalizeParams(params);

  return useQuery<ComponentInfoListResponse>({
    queryKey: componentInfoKeys.list(normalized),
    queryFn: async () => {
      const keyword = normalized.keyword.trim().toLowerCase();
      const now = new Date();
      const dayLimit = toPeriodDays(normalized.period);

      const items = COMPONENT_INFO_MOCK_DATA.filter((item) => {
        const createdAt = new Date(item.createdAt);
        const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > dayLimit) return false;

        if (!keyword) return true;
        return [
          item.componentId,
          item.componentName,
          item.managerName,
          item.managerOrg,
          item.systemCode,
          item.businessName,
          item.createdBy,
          item.updatedBy,
        ].some((value) => value.toLowerCase().includes(keyword));
      });

      return {
        items,
        total: items.length,
      };
    },
    placeholderData: keepPreviousData,
  });
}
