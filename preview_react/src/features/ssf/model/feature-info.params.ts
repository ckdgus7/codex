import type {
  FeatureInfoListParams,
  FeatureSearchScope,
  FeatureSortDir,
  FeatureSortKey,
  FeatureStatus,
} from "@/features/ssf/model/feature-info.types";

const STATUS_OPTIONS: FeatureStatus[] = ["전체", "사용", "미사용"];
const SCOPE_OPTIONS: FeatureSearchScope[] = ["기능(L4)명", "기능(L4) ID"];
const SORT_KEY_OPTIONS: FeatureSortKey[] = [
  "no",
  "featureId",
  "featureName",
  "compositionType",
  "description",
  "businessId",
  "businessName",
  "componentName",
  "domainName",
  "useYn",
];

export function parseFeatureInfoSearchParams(searchParams: URLSearchParams): FeatureInfoListParams {
  const statusParam = searchParams.get("status");
  const scopeParam = searchParams.get("scope");
  const sortKeyParam = searchParams.get("sortKey") as FeatureSortKey | null;
  const sortDirParam = searchParams.get("sortDir") as FeatureSortDir | null;
  const pageParam = Number(searchParams.get("page"));
  const sizeParam = Number(searchParams.get("size"));

  return {
    status: STATUS_OPTIONS.includes(statusParam as FeatureStatus)
      ? (statusParam as FeatureStatus)
      : "전체",
    domain: searchParams.get("domain") ?? "전체",
    component: searchParams.get("component") ?? "전체",
    business: searchParams.get("business") ?? "전체",
    scope: SCOPE_OPTIONS.includes(scopeParam as FeatureSearchScope)
      ? (scopeParam as FeatureSearchScope)
      : "기능(L4)명",
    keyword: searchParams.get("keyword") ?? "",
    sortKey: SORT_KEY_OPTIONS.includes(sortKeyParam as FeatureSortKey)
      ? (sortKeyParam as FeatureSortKey)
      : null,
    sortDir: sortDirParam === "asc" || sortDirParam === "desc" ? sortDirParam : null,
    page: Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1,
    size: Number.isFinite(sizeParam) && sizeParam > 0 ? Math.floor(sizeParam) : 10,
  };
}

export function buildFeatureInfoSearchParams(
  prev: URLSearchParams,
  next: Partial<FeatureInfoListParams>
): URLSearchParams {
  const params = new URLSearchParams(prev);

  if (next.status) {
    params.set("status", next.status);
  }

  if (typeof next.domain === "string") {
    if (next.domain) params.set("domain", next.domain);
    else params.delete("domain");
  }

  if (typeof next.component === "string") {
    if (next.component) params.set("component", next.component);
    else params.delete("component");
  }

  if (typeof next.business === "string") {
    if (next.business) params.set("business", next.business);
    else params.delete("business");
  }

  if (next.scope) {
    params.set("scope", next.scope);
  }

  if (typeof next.keyword === "string") {
    if (next.keyword) params.set("keyword", next.keyword);
    else params.delete("keyword");
  }

  if (next.sortKey !== undefined) {
    if (next.sortKey) params.set("sortKey", next.sortKey);
    else params.delete("sortKey");
  }

  if (next.sortDir !== undefined) {
    if (next.sortDir) params.set("sortDir", next.sortDir);
    else params.delete("sortDir");
  }

  if (typeof next.page === "number") {
    params.set("page", String(next.page));
  }

  if (typeof next.size === "number") {
    params.set("size", String(next.size));
  }

  return params;
}
