export type FeatureUseYn = "사용" | "미사용";
export type FeatureStatus = "전체" | FeatureUseYn;
export type FeatureSearchScope = "기능(L4)명" | "기능(L4) ID";
export type FeatureCompositionType = "Composite" | "Orchestration";

export interface FeatureInfoItem {
  id: string;
  no: number;
  featureId: string;
  featureName: string;
  compositionType: FeatureCompositionType;
  description: string;
  businessId: string;
  businessName: string;
  componentName: string;
  domainName: string;
  useYn: FeatureUseYn;
}

export type FeatureSortKey =
  | "no"
  | "featureId"
  | "featureName"
  | "compositionType"
  | "description"
  | "businessId"
  | "businessName"
  | "componentName"
  | "domainName"
  | "useYn";

export type FeatureSortDir = "asc" | "desc" | null;

export interface FeatureInfoListParams {
  status: FeatureStatus;
  domain: string;
  component: string;
  business: string;
  scope: FeatureSearchScope;
  keyword: string;
  sortKey: FeatureSortKey | null;
  sortDir: FeatureSortDir;
  page: number;
  size: number;
}

export interface FeatureInfoListResponse {
  items: FeatureInfoItem[];
  total: number;
}
