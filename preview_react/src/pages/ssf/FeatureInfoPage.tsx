import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useFeatureInfoListQuery } from "@/features/ssf/api/feature-info.queries";
import { FEATURE_INFO_MOCK_DATA } from "@/features/ssf/model/feature-info.mock";
import {
  buildFeatureInfoSearchParams,
  parseFeatureInfoSearchParams,
} from "@/features/ssf/model/feature-info.params";
import type {
  FeatureSearchScope,
  FeatureSortKey,
  FeatureStatus,
} from "@/features/ssf/model/feature-info.types";
import { FeatureInfoListView } from "@/features/ssf/ui/FeatureInfoListView";

export function FeatureInfoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => parseFeatureInfoSearchParams(searchParams), [searchParams]);
  const [keywordDraft, setKeywordDraft] = useState(params.keyword);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setKeywordDraft(params.keyword);
  }, [params.keyword]);

  const { data, isLoading, isError } = useFeatureInfoListQuery(params);

  const domainOptions = useMemo(() => {
    const domains = new Set(FEATURE_INFO_MOCK_DATA.map((item) => item.domainName));
    return ["전체", ...Array.from(domains)];
  }, []);

  const componentOptions = useMemo(() => {
    const components = new Set(FEATURE_INFO_MOCK_DATA.map((item) => item.componentName));
    return ["전체", ...Array.from(components)];
  }, []);

  const businessOptions = useMemo(() => {
    const businesses = new Set(FEATURE_INFO_MOCK_DATA.map((item) => item.businessName));
    return ["전체", ...Array.from(businesses)];
  }, []);

  const { pageItems, totalCount, totalPages, safePage } = useMemo(() => {
    const sourceItems = data?.items ?? [];

    const sortedItems = [...sourceItems].sort((a, b) => {
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

    const nextTotalCount = sortedItems.length;
    const nextTotalPages = Math.max(1, Math.ceil(nextTotalCount / params.size));
    const nextPage = Math.min(params.page, nextTotalPages);
    const startIndex = (nextPage - 1) * params.size;

    return {
      pageItems: sortedItems.slice(startIndex, startIndex + params.size),
      totalCount: nextTotalCount,
      totalPages: nextTotalPages,
      safePage: nextPage,
    };
  }, [data?.items, params.page, params.size, params.sortDir, params.sortKey]);

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => pageItems.some((item) => item.id === id)));
  }, [pageItems]);

  const handleSort = (key: FeatureSortKey) => {
    if (params.sortKey === key) {
      if (params.sortDir === "asc") {
        setSearchParams((prev) =>
          buildFeatureInfoSearchParams(prev, { sortKey: key, sortDir: "desc" }),
        );
        return;
      }

      if (params.sortDir === "desc") {
        setSearchParams((prev) =>
          buildFeatureInfoSearchParams(prev, { sortKey: null, sortDir: null }),
        );
        return;
      }
    }

    setSearchParams((prev) => buildFeatureInfoSearchParams(prev, { sortKey: key, sortDir: "asc" }));
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  const handleToggleAllRows = () => {
    const pageIds = pageItems.map((item) => item.id);
    const isAllSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

    if (isAllSelected) {
      setSelectedIds((current) => current.filter((id) => !pageIds.includes(id)));
      return;
    }

    setSelectedIds((current) => Array.from(new Set([...current, ...pageIds])));
  };

  return (
    <FeatureInfoListView
      items={pageItems}
      totalCount={totalCount}
      page={safePage}
      totalPages={totalPages}
      itemsPerPage={params.size}
      statusFilter={params.status}
      domainFilter={params.domain}
      componentFilter={params.component}
      businessFilter={params.business}
      searchScope={params.scope}
      keyword={keywordDraft}
      sortKey={params.sortKey}
      sortDir={params.sortDir}
      loading={isLoading}
      error={isError}
      domainOptions={domainOptions}
      componentOptions={componentOptions}
      businessOptions={businessOptions}
      selectedIds={selectedIds}
      onStatusChange={(value: FeatureStatus) => {
        setSearchParams((prev) => buildFeatureInfoSearchParams(prev, { status: value, page: 1 }));
      }}
      onDomainChange={(value: string) => {
        setSearchParams((prev) =>
          buildFeatureInfoSearchParams(prev, { domain: value, component: "전체", business: "전체", page: 1 }),
        );
      }}
      onComponentChange={(value: string) => {
        setSearchParams((prev) =>
          buildFeatureInfoSearchParams(prev, { component: value, business: "전체", page: 1 }),
        );
      }}
      onBusinessChange={(value: string) => {
        setSearchParams((prev) => buildFeatureInfoSearchParams(prev, { business: value, page: 1 }));
      }}
      onSearchScopeChange={(value: FeatureSearchScope) => {
        setSearchParams((prev) => buildFeatureInfoSearchParams(prev, { scope: value, page: 1 }));
      }}
      onKeywordChange={setKeywordDraft}
      onSearch={() => {
        setSearchParams((prev) =>
          buildFeatureInfoSearchParams(prev, { page: 1, keyword: keywordDraft.trim() }),
        );
      }}
      onSort={handleSort}
      onPageChange={(page: number) => {
        setSearchParams((prev) => buildFeatureInfoSearchParams(prev, { page }));
      }}
      onItemsPerPageChange={(size: number) => {
        setSearchParams((prev) => buildFeatureInfoSearchParams(prev, { size, page: 1 }));
      }}
      onToggleRow={handleToggleRow}
      onToggleAllRows={handleToggleAllRows}
    />
  );
}
