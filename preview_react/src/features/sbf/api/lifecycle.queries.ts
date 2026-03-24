import { useQuery } from "@tanstack/react-query";
import { getLifecycleList, getLifecycleDetail } from "@/features/sbf/model/mock-data";

export const lifecycleKeys = {
  all: ["sbf-lifecycle"] as const,
  list: () => [...lifecycleKeys.all, "list"] as const,
  detail: (id: string) => [...lifecycleKeys.all, "detail", id] as const,
};

export function useLifecycleListQuery() {
  return useQuery({
    queryKey: lifecycleKeys.list(),
    queryFn: () => Promise.resolve(getLifecycleList()),
  });
}

export function useLifecycleDetailQuery(lifecycleId: string) {
  return useQuery({
    queryKey: lifecycleKeys.detail(lifecycleId),
    queryFn: () => Promise.resolve(getLifecycleDetail(lifecycleId)),
    enabled: !!lifecycleId,
  });
}
