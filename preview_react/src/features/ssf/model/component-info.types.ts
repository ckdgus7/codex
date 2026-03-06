export type ComponentPeriod = "1개월" | "3개월" | "6개월";

export interface ComponentInfoItem {
  id: string;
  no: number;
  componentId: string;
  componentName: string;
  managerName: string;
  managerOrg: string;
  systemCode: string;
  businessName: string;
  createdBy: string;
  updatedBy: string;
  useYn: "사용" | "미사용";
  createdAt: string;
}

export interface ComponentInfoListParams {
  keyword: string;
  period: ComponentPeriod;
}

export interface ComponentInfoListResponse {
  items: ComponentInfoItem[];
  total: number;
}
