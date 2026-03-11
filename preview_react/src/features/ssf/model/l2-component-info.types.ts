export type L2ComponentUseYn = "사용" | "미사용";
export type L2ComponentStatus = "전체" | L2ComponentUseYn;
export type L2ComponentSearchScope = "전체" | "컴포넌트(L2)명" | "컴포넌트ID" | "해당업무명";

export interface L2ComponentInfoItem {
  id: string;
  no: number;
  componentId: string;
  nameKo: string;
  nameEn: string;
  description: string;
  domainName: string;
  businessName: string;
  plannerLeader: string;
  designLeader: string;
  useYn: L2ComponentUseYn;
}

export type L2ComponentSortKey =
  | "no"
  | "componentId"
  | "nameKo"
  | "nameEn"
  | "description"
  | "domainName"
  | "plannerLeader"
  | "designLeader"
  | "useYn";

export type L2ComponentSortDir = "asc" | "desc" | null;

export interface L2ComponentInfoListParams {
  status: L2ComponentStatus;
  domain: string;
  scope: L2ComponentSearchScope;
  keyword: string;
  sortKey: L2ComponentSortKey | null;
  sortDir: L2ComponentSortDir;
  page: number;
  size: number;
}

export interface L2ComponentInfoListResponse {
  items: L2ComponentInfoItem[];
  total: number;
}
