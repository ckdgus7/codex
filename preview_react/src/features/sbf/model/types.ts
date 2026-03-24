export interface LifecycleItem {
  no: number;
  lifecycleId: string;
  nameKo: string;
  nameEn: string;
  description: string;
  category: string;
  useYn: string;
}

export type LifecycleSortKey = keyof LifecycleItem;
export type SortDir = "asc" | "desc" | null;

export interface BusinessAreaItem {
  no: number;
  businessAreaId: string;
  category: string;
  lifecycleId: string;
  lifecycleNameKo: string;
  nameKo: string;
  description: string;
  useYn: string;
}

export type BusinessAreaSortKey = keyof BusinessAreaItem;

export interface BusinessFlowItem {
  no: number;
  businessFlowId: string;
  category: string;
  lifecycleId: string;
  lifecycleNameKo: string;
  businessAreaId: string;
  businessAreaNameKo: string;
  nameKo: string;
  description: string;
  useYn: string;
}

export type BusinessFlowSortKey = keyof BusinessFlowItem;
