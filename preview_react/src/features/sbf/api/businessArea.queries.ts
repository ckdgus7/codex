import { useQuery } from "@tanstack/react-query";
import { getBusinessAreaList, getBusinessAreaDetail } from "@/features/sbf/model/mock-data";

export const businessAreaKeys = {
  all: ["sbf-business-area"] as const,
  list: () => [...businessAreaKeys.all, "list"] as const,
  detail: (id: string) => [...businessAreaKeys.all, "detail", id] as const,
};

export function useBusinessAreaListQuery() {
  return useQuery({
    queryKey: businessAreaKeys.list(),
    queryFn: () => Promise.resolve(getBusinessAreaList()),
  });
}

export function useBusinessAreaDetailQuery(businessAreaId: string) {
  return useQuery({
    queryKey: businessAreaKeys.detail(businessAreaId),
    queryFn: () => Promise.resolve(getBusinessAreaDetail(businessAreaId)),
    enabled: !!businessAreaId,
  });
}
