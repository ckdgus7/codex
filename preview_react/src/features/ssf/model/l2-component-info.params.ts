import type {
  L2ComponentInfoListParams,
  L2ComponentSearchScope,
  L2ComponentSortDir,
  L2ComponentSortKey,
  L2ComponentStatus,
} from "./l2-component-info.types";

const STATUS_OPTIONS: L2ComponentStatus[] = ["전체", "사용", "미사용"];
const SCOPE_OPTIONS: L2ComponentSearchScope[] = ["전체", "컴포넌트(L2)명", "컴포넌트ID", "해당업무명"];
const SORT_KEY_OPTIONS: L2ComponentSortKey[] = [
  "no",
  "componentId",
  "nameKo",
  "nameEn",
  "description",
  "domainName",
  "plannerLeader",
  "designLeader",
  "useYn",
];

export function parseL2ComponentInfoSearchParams(searchParams: URLSearchParams): L2ComponentInfoListParams {
  const statusParam = searchParams.get("status");
  const scopeParam = searchParams.get("scope");
  const sortKeyParam = searchParams.get("sortKey") as L2ComponentSortKey | null;
  const sortDirParam = searchParams.get("sortDir") as L2ComponentSortDir | null;
  const pageParam = Number(searchParams.get("page"));
  const sizeParam = Number(searchParams.get("size"));

  return {
    status: STATUS_OPTIONS.includes(statusParam as L2ComponentStatus)
      ? (statusParam as L2ComponentStatus)
      : "전체",
    domain: searchParams.get("domain") ?? "전체",
    scope: SCOPE_OPTIONS.includes(scopeParam as L2ComponentSearchScope)
      ? (scopeParam as L2ComponentSearchScope)
      : "컴포넌트(L2)명",
    keyword: searchParams.get("keyword") ?? "",
    sortKey: SORT_KEY_OPTIONS.includes(sortKeyParam as L2ComponentSortKey)
      ? (sortKeyParam as L2ComponentSortKey)
      : null,
    sortDir: sortDirParam === "asc" || sortDirParam === "desc" ? sortDirParam : null,
    page: Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1,
    size: Number.isFinite(sizeParam) && sizeParam > 0 ? Math.floor(sizeParam) : 10,
  };
}

export function buildL2ComponentInfoSearchParams(
  prev: URLSearchParams,
  next: Partial<L2ComponentInfoListParams>
): URLSearchParams {
  const params = new URLSearchParams(prev);

  if (typeof next.keyword === "string") {
    if (next.keyword) params.set("keyword", next.keyword);
    else params.delete("keyword");
  }

  if (next.status) {
    params.set("status", next.status);
  }

  if (typeof next.domain === "string") {
    if (next.domain) params.set("domain", next.domain);
    else params.delete("domain");
  }

  if (next.scope) {
    params.set("scope", next.scope);
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
