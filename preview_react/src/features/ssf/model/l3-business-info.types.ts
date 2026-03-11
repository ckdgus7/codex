export type L3BusinessPeriod = "1개월" | "3개월" | "6개월";

export type L3BusinessSortKey =
  | "no"
  | "businessId"
  | "businessName"
  | "componentId"
  | "domainName"
  | "plannerLeader"
  | "designLeader"
  | "useYn";

export type L3BusinessSortDir = "asc" | "desc" | null;

export type L3BusinessUseStatus = "사용" | "미사용";

export interface L3BusinessInfoItem {
  id: string;
  no: number;
  businessId: string;
  businessName: string;
  componentId: string;
  domainName: string;
  plannerLeader: string;
  designLeader: string;
  useYn: L3BusinessUseStatus;
  createdAt: string;
}

export interface L3BusinessInfoListParams {
  period: L3BusinessPeriod;
  assignee: string;
  sortKey: L3BusinessSortKey | null;
  sortDir: L3BusinessSortDir;
  page: number;
  size: number;
}

export interface L3BusinessInfoListResponse {
  items: L3BusinessInfoItem[];
  total: number;
}
