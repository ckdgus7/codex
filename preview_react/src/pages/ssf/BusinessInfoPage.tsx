import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useL3BusinessInfoListQuery } from "@/features/ssf/api/l3-business-info.queries";
import { L3BusinessInfoListView } from "@/features/ssf/ui/L3BusinessInfoListView";
import { L3_BUSINESS_INFO_MOCK_DATA } from "@/features/ssf/model/l3-business-info.mock";
import {
  buildL3BusinessInfoSearchParams,
  parseL3BusinessInfoSearchParams,
} from "@/features/ssf/model/l3-business-info.params";
import type {
  L3BusinessPeriod,
  L3BusinessSortKey,
} from "@/features/ssf/model/l3-business-info.types";

export function BusinessInfoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => parseL3BusinessInfoSearchParams(searchParams), [searchParams]);
  const [assigneeDraft, setAssigneeDraft] = useState(params.assignee);

  useEffect(() => {
    setAssigneeDraft(params.assignee);
  }, [params.assignee]);

  const { data, isLoading, isError } = useL3BusinessInfoListQuery(params);

  const assigneeOptions = useMemo(() => {
    const leaders = new Set<string>();
    L3_BUSINESS_INFO_MOCK_DATA.forEach((item) => {
      leaders.add(item.plannerLeader);
      leaders.add(item.designLeader);
    });
    return Array.from(leaders);
  }, []);

  const { pageItems, totalCount, totalPages, safePage } = useMemo(() => {
    const baseItems = data?.items ?? [];

    const sorted = [...baseItems].sort((a, b) => {
      if (!params.sortKey || !params.sortDir) return 0;
      const aValue = a[params.sortKey];
      const bValue = b[params.sortKey];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return params.sortDir === "asc" ? aValue - bValue : bValue - aValue;
      }

      return params.sortDir === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    const total = sorted.length;
    const pages = Math.max(1, Math.ceil(total / params.size));
    const page = Math.min(params.page, pages);
    const startIndex = (page - 1) * params.size;

    return {
      pageItems: sorted.slice(startIndex, startIndex + params.size),
      totalCount: total,
      totalPages: pages,
      safePage: page,
    };
  }, [data?.items, params.page, params.size, params.sortDir, params.sortKey]);

  const handleSort = (key: L3BusinessSortKey) => {
    if (params.sortKey === key) {
      if (params.sortDir === "asc") {
        setSearchParams((prev) =>
          buildL3BusinessInfoSearchParams(prev, { sortKey: key, sortDir: "desc" })
        );
        return;
      }

      if (params.sortDir === "desc") {
        setSearchParams((prev) =>
          buildL3BusinessInfoSearchParams(prev, { sortKey: null, sortDir: null })
        );
        return;
      }
    }

    setSearchParams((prev) =>
      buildL3BusinessInfoSearchParams(prev, { sortKey: key, sortDir: "asc" })
    );
  };

  return (
    <L3BusinessInfoListView
      items={pageItems}
      totalCount={totalCount}
      page={safePage}
      totalPages={totalPages}
      itemsPerPage={params.size}
      period={params.period}
      assignee={assigneeDraft}
      assigneeOptions={assigneeOptions}
      sortKey={params.sortKey}
      sortDir={params.sortDir}
      loading={isLoading}
      error={isError}
      onPeriodChange={(value: L3BusinessPeriod) => {
        setSearchParams((prev) =>
          buildL3BusinessInfoSearchParams(prev, { period: value, page: 1 })
        );
      }}
      onAssigneeChange={setAssigneeDraft}
      onSearch={() => {
        setSearchParams((prev) =>
          buildL3BusinessInfoSearchParams(prev, { page: 1, assignee: assigneeDraft.trim() })
        );
      }}
      onSort={handleSort}
      onPageChange={(page: number) => {
        setSearchParams((prev) =>
          buildL3BusinessInfoSearchParams(prev, { page })
        );
      }}
      onItemsPerPageChange={(size: number) => {
        setSearchParams((prev) =>
          buildL3BusinessInfoSearchParams(prev, { size, page: 1 })
        );
      }}
    />
  );
}
