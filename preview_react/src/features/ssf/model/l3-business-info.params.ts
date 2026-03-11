import type {
  L3BusinessInfoListParams,
  L3BusinessPeriod,
  L3BusinessSortDir,
  L3BusinessSortKey,
} from "./l3-business-info.types";

const PERIOD_OPTIONS: L3BusinessPeriod[] = ["1개월", "3개월", "6개월"];
const SORT_KEY_OPTIONS: L3BusinessSortKey[] = [
  "no",
  "businessId",
  "businessName",
  "componentId",
  "domainName",
  "plannerLeader",
  "designLeader",
  "useYn",
];

export function parseL3BusinessInfoSearchParams(searchParams: URLSearchParams): L3BusinessInfoListParams {
  const periodParam = searchParams.get("period") as L3BusinessPeriod | null;
  const sortKeyParam = searchParams.get("sortKey") as L3BusinessSortKey | null;
  const sortDirParam = searchParams.get("sortDir") as L3BusinessSortDir | null;
  const pageParam = Number(searchParams.get("page"));
  const sizeParam = Number(searchParams.get("size"));

  return {
    period: PERIOD_OPTIONS.includes(periodParam as L3BusinessPeriod)
      ? (periodParam as L3BusinessPeriod)
      : "3개월",
    assignee: searchParams.get("assignee") ?? "",
    sortKey: SORT_KEY_OPTIONS.includes(sortKeyParam as L3BusinessSortKey)
      ? (sortKeyParam as L3BusinessSortKey)
      : null,
    sortDir: sortDirParam === "asc" || sortDirParam === "desc" ? sortDirParam : null,
    page: Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1,
    size: Number.isFinite(sizeParam) && sizeParam > 0 ? Math.floor(sizeParam) : 10,
  };
}

export function buildL3BusinessInfoSearchParams(
  prev: URLSearchParams,
  next: Partial<L3BusinessInfoListParams>
): URLSearchParams {
  const params = new URLSearchParams(prev);

  if (next.period) {
    params.set("period", next.period);
  }

  if (typeof next.assignee === "string") {
    if (next.assignee) params.set("assignee", next.assignee);
    else params.delete("assignee");
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
