import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useL2ComponentInfoListQuery } from "@/features/ssf/api/l2-component-info.queries";
import { L2ComponentInfoListView } from "@/features/ssf/ui/L2ComponentInfoListView";
import { L2_COMPONENT_INFO_MOCK_DATA } from "@/features/ssf/model/l2-component-info.mock";
import {
  buildL2ComponentInfoSearchParams,
  parseL2ComponentInfoSearchParams,
} from "@/features/ssf/model/l2-component-info.params";
import type {
  L2ComponentSearchScope,
  L2ComponentSortKey,
  L2ComponentStatus,
} from "@/features/ssf/model/l2-component-info.types";

export function L2ComponentInfoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => parseL2ComponentInfoSearchParams(searchParams), [searchParams]);
  const [keywordDraft, setKeywordDraft] = useState(params.keyword);

  useEffect(() => {
    setKeywordDraft(params.keyword);
  }, [params.keyword]);

  const { data, isLoading, isError } = useL2ComponentInfoListQuery(params);

  const domainOptions = useMemo(() => {
    const domains = new Set(L2_COMPONENT_INFO_MOCK_DATA.map((item) => item.domainName));
    return ["전체", ...Array.from(domains)];
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

  const handleSort = (key: L2ComponentSortKey) => {
    if (params.sortKey === key) {
      if (params.sortDir === "asc") {
        setSearchParams((prev) =>
          buildL2ComponentInfoSearchParams(prev, { sortKey: key, sortDir: "desc" })
        );
        return;
      }

      if (params.sortDir === "desc") {
        setSearchParams((prev) =>
          buildL2ComponentInfoSearchParams(prev, { sortKey: null, sortDir: null })
        );
        return;
      }
    }

    setSearchParams((prev) =>
      buildL2ComponentInfoSearchParams(prev, { sortKey: key, sortDir: "asc" })
    );
  };

  return (
    <L2ComponentInfoListView
      items={pageItems}
      totalCount={totalCount}
      page={safePage}
      totalPages={totalPages}
      itemsPerPage={params.size}
      statusFilter={params.status}
      domainFilter={params.domain}
      searchScope={params.scope}
      keyword={keywordDraft}
      sortKey={params.sortKey}
      sortDir={params.sortDir}
      loading={isLoading}
      error={isError}
      domainOptions={domainOptions}
      onStatusChange={(value: L2ComponentStatus) => {
        setSearchParams((prev) =>
          buildL2ComponentInfoSearchParams(prev, { status: value, page: 1 })
        );
      }}
      onDomainChange={(value: string) => {
        setSearchParams((prev) =>
          buildL2ComponentInfoSearchParams(prev, { domain: value, page: 1 })
        );
      }}
      onSearchScopeChange={(value: L2ComponentSearchScope) => {
        setSearchParams((prev) =>
          buildL2ComponentInfoSearchParams(prev, { scope: value, page: 1 })
        );
      }}
      onKeywordChange={setKeywordDraft}
      onSearch={() => {
        setSearchParams((prev) =>
          buildL2ComponentInfoSearchParams(prev, { page: 1, keyword: keywordDraft.trim() })
        );
      }}
      onSort={handleSort}
      onPageChange={(page: number) => {
        setSearchParams((prev) =>
          buildL2ComponentInfoSearchParams(prev, { page })
        );
      }}
      onItemsPerPageChange={(size: number) => {
        setSearchParams((prev) =>
          buildL2ComponentInfoSearchParams(prev, { size, page: 1 })
        );
      }}
    />
  );
}
