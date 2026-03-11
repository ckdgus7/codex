import type { L2ComponentInfoItem, L2ComponentUseYn } from "./l2-component-info.types";

const BASE_ROWS = [
  {
    componentId: "SKNC001",
    nameKo: "공통 플랫폼 관리",
    nameEn: "Common Platform Management",
    description: "서비스 제공을 위해 플랫폼 전반적으로 사용되는 공통 기능들의 관리 활동 전체를 말합니다.",
    domainName: "마케팅 & 오퍼링",
    businessName: "플랫폼 공통",
    plannerLeader: "이태규",
    designLeader: "조우찬",
    useYn: "사용",
  },
  {
    componentId: "SKNC100",
    nameKo: "충성도 관리",
    nameEn: "Loyalty Management",
    description: "고객 행동을 유도하고 보상 정책을 운영하기 위한 충성도 프로그램 기능을 제공합니다.",
    domainName: "마케팅 & 오퍼링",
    businessName: "마케팅 운영",
    plannerLeader: "강신영",
    designLeader: "안재홍",
    useYn: "미사용",
  },
  {
    componentId: "SKNC200",
    nameKo: "채널 영업지원",
    nameEn: "Channel Sales Enablement",
    description: "대리점 라이프사이클 및 성과 관리를 지원하며 영업 활동 데이터를 통합 관리합니다.",
    domainName: "마케팅 & 오퍼링",
    businessName: "채널 운영",
    plannerLeader: "박진성",
    designLeader: "박찬희",
    useYn: "사용",
  },
  {
    componentId: "SKNC250",
    nameKo: "파트너 정산 관리",
    nameEn: "Partner Settlement Management",
    description: "다양한 파트너 계약/정산 유형을 관리하고 정산 결과를 추적합니다.",
    domainName: "마케팅 & 오퍼링",
    businessName: "제휴 정산",
    plannerLeader: "박진성",
    designLeader: "박찬희",
    useYn: "사용",
  },
  {
    componentId: "SKNC300",
    nameKo: "미납 관리",
    nameEn: "Dunning Management",
    description: "미납 고객 대상 독촉, 분할 납부, 상태 추적과 관련된 업무를 지원합니다.",
    domainName: "마케팅 & 오퍼링",
    businessName: "수납/미납",
    plannerLeader: "박진성",
    designLeader: "박찬희",
    useYn: "사용",
  },
  {
    componentId: "SKNC400",
    nameKo: "재무 관리",
    nameEn: "Invoice Financial Management",
    description: "매출 항목별 금액을 회계 관점으로 변환하고 정산 자료를 제공합니다.",
    domainName: "마케팅 & 오퍼링",
    businessName: "재무 정산",
    plannerLeader: "박진성",
    designLeader: "박찬희",
    useYn: "사용",
  },
  {
    componentId: "SKNC416",
    nameKo: "리포팅 및 분석",
    nameEn: "Reporting and Analytics",
    description: "고객/제품/판매 데이터를 분석해 통계와 리포트를 제공합니다.",
    domainName: "마케팅 & 오퍼링",
    businessName: "분석 리포팅",
    plannerLeader: "박지용",
    designLeader: "고영민",
    useYn: "사용",
  },
  {
    componentId: "SKNC500",
    nameKo: "거래처 관리",
    nameEn: "Account Management",
    description: "거래처 조직, 담당자, 계약 정보를 통합 관리하여 영업 운영을 지원합니다.",
    domainName: "마케팅 & 오퍼링",
    businessName: "거래처 운영",
    plannerLeader: "강신영",
    designLeader: "안재홍",
    useYn: "사용",
  },
  {
    componentId: "SKNC501",
    nameKo: "콘텐츠 관리",
    nameEn: "Contents Management",
    description: "콘텐츠 등록/수정/배포 및 이력 관리를 위한 기능을 제공합니다.",
    domainName: "마케팅 & 오퍼링",
    businessName: "콘텐츠 운영",
    plannerLeader: "강신영",
    designLeader: "안재홍",
    useYn: "사용",
  },
  {
    componentId: "SKNC502",
    nameKo: "개인화",
    nameEn: "Personalization",
    description: "고객 행동/선호 데이터를 분석해 맞춤형 서비스와 마케팅 메시지를 제공합니다.",
    domainName: "마케팅 & 오퍼링",
    businessName: "개인화 추천",
    plannerLeader: "강신영",
    designLeader: "안재홍",
    useYn: "사용",
  },
] as const satisfies ReadonlyArray<{
  componentId: string;
  nameKo: string;
  nameEn: string;
  description: string;
  domainName: string;
  businessName: string;
  plannerLeader: string;
  designLeader: string;
  useYn: L2ComponentUseYn;
}>;

export const L2_COMPONENT_INFO_MOCK_DATA: L2ComponentInfoItem[] = Array.from(
  { length: 64 },
  (_, index) => {
    const seed = BASE_ROWS[index % BASE_ROWS.length];
    const no = 998 - index;
    const id = `${seed.componentId}-${String(index + 1).padStart(3, "0")}`;

    return {
      id,
      no,
      componentId: seed.componentId,
      nameKo: seed.nameKo,
      nameEn: seed.nameEn,
      description: seed.description,
      domainName: seed.domainName,
      businessName: seed.businessName,
      plannerLeader: seed.plannerLeader,
      designLeader: seed.designLeader,
      useYn: seed.useYn,
    };
  }
);
