import type { FeatureInfoItem, FeatureUseYn } from "@/features/ssf/model/feature-info.types";

const SEEDS = [
  {
    featureName: "요구사항 저장",
    compositionType: "Composite",
    businessName: "요구사항 생성",
    componentName: "미납관리",
    domainName: "마케팅 & 오퍼링",
    useYn: "사용",
  },
  {
    featureName: "요구사항 임시저장",
    compositionType: "Orchestration",
    businessName: "요구사항 생성",
    componentName: "미납관리",
    domainName: "마케팅 & 오퍼링",
    useYn: "사용",
  },
  {
    featureName: "요구사항 이력생성",
    compositionType: "Orchestration",
    businessName: "요구사항 생성",
    componentName: "미납관리",
    domainName: "마케팅 & 오퍼링",
    useYn: "사용",
  },
  {
    featureName: "요구사항 반려저장",
    compositionType: "Composite",
    businessName: "요구사항 생성",
    componentName: "미납관리",
    domainName: "마케팅 & 오퍼링",
    useYn: "사용",
  },
  {
    featureName: "요구사항 검토",
    compositionType: "Orchestration",
    businessName: "요구사항 이관",
    componentName: "미납관리",
    domainName: "마케팅 & 오퍼링",
    useYn: "사용",
  },
  {
    featureName: "요구사항 분석",
    compositionType: "Composite",
    businessName: "요구사항 배포",
    componentName: "미납관리",
    domainName: "마케팅 & 오퍼링",
    useYn: "사용",
  },
  {
    featureName: "요구사항 요약",
    compositionType: "Composite",
    businessName: "요구사항 검색",
    componentName: "미납관리",
    domainName: "마케팅 & 오퍼링",
    useYn: "미사용",
  },
  {
    featureName: "요구사항 이행",
    compositionType: "Composite",
    businessName: "요구사항 업데이트",
    componentName: "미납관리",
    domainName: "마케팅 & 오퍼링",
    useYn: "사용",
  },
  {
    featureName: "요구사항 검증",
    compositionType: "Composite",
    businessName: "요구사항 검토",
    componentName: "미납관리",
    domainName: "마케팅 & 오퍼링",
    useYn: "사용",
  },
  {
    featureName: "요구사항 완료",
    compositionType: "Composite",
    businessName: "요구사항 보고",
    componentName: "미납관리",
    domainName: "마케팅 & 오퍼링",
    useYn: "사용",
  },
] as const satisfies ReadonlyArray<{
  featureName: string;
  compositionType: FeatureInfoItem["compositionType"];
  businessName: string;
  componentName: string;
  domainName: string;
  useYn: FeatureUseYn;
}>;

export const FEATURE_INFO_MOCK_DATA: FeatureInfoItem[] = Array.from({ length: 998 }, (_, index) => {
  const seed = SEEDS[index % SEEDS.length];
  const sequence = index + 1;
  const block = String(Math.floor(index / 10) + 1).padStart(4, "0");
  const suffix = `C${String((index % 10) + 1).padStart(3, "0")}`;

  return {
    id: `feature-${sequence}`,
    no: 99998 - index,
    featureId: `BP-AISKNC507-${block}-${suffix}`,
    featureName: seed.featureName,
    compositionType: seed.compositionType,
    description: `L4 요구상세 ${seed.featureName} 처리를 위한 업무 로직과 연계 조건을 정의합니다.`,
    businessId: `BZ-BILSKNC300-${String((index % 999) + 1).padStart(3, "0")}`,
    businessName: seed.businessName,
    componentName: seed.componentName,
    domainName: seed.domainName,
    useYn: seed.useYn,
  };
});
