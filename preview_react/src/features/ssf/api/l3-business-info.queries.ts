import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { l3BusinessInfoKeys } from "@/features/ssf/model/l3-business-info.keys";
import { L3_BUSINESS_INFO_MOCK_DATA } from "@/features/ssf/model/l3-business-info.mock";
import type {
  L3BusinessInfoListParams,
  L3BusinessInfoListResponse,
  L3BusinessPeriod,
} from "@/features/ssf/model/l3-business-info.types";

function normalizeParams(params: L3BusinessInfoListParams): L3BusinessInfoListParams {
  return {
    period: params.period ?? "3개월",
    assignee: params.assignee ?? "",
    sortKey: params.sortKey ?? null,
    sortDir: params.sortDir ?? null,
    page: typeof params.page === "number" && params.page > 0 ? params.page : 1,
    size: typeof params.size === "number" && params.size > 0 ? params.size : 10,
  };
}

function periodToDays(period: L3BusinessPeriod) {
  if (period === "1개월") return 30;
  if (period === "3개월") return 90;
  return 180;
}

export function useL3BusinessInfoListQuery(params: L3BusinessInfoListParams) {
  const normalized = normalizeParams(params);

  return useQuery<L3BusinessInfoListResponse>({
    queryKey: l3BusinessInfoKeys.list(normalized),
    queryFn: async () => {
      const assignee = normalized.assignee.trim();
      const maxDays = periodToDays(normalized.period);
      const now = Date.now();

      const items = L3_BUSINESS_INFO_MOCK_DATA.filter((item) => {
        const diffDays = Math.floor((now - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > maxDays) return false;
        if (!assignee) return true;
        return item.plannerLeader === assignee || item.designLeader === assignee;
      });

      return {
        items,
        total: items.length,
      };
    },
    placeholderData: keepPreviousData,
  });
}
