import { useQuery } from "@tanstack/react-query";
import { getBusinessFlowList, getBusinessFlowDetail } from "@/features/sbf/model/mock-data";

export const businessFlowKeys = {
  all: ["sbf-business-flow"] as const,
  list: () => [...businessFlowKeys.all, "list"] as const,
  detail: (id: string) => [...businessFlowKeys.all, "detail", id] as const,
};

export function useBusinessFlowListQuery() {
  return useQuery({
    queryKey: businessFlowKeys.list(),
    queryFn: () => Promise.resolve(getBusinessFlowList()),
  });
}

export function useBusinessFlowDetailQuery(businessFlowId: string) {
  return useQuery({
    queryKey: businessFlowKeys.detail(businessFlowId),
    queryFn: () => Promise.resolve(getBusinessFlowDetail(businessFlowId)),
    enabled: !!businessFlowId,
  });
}
