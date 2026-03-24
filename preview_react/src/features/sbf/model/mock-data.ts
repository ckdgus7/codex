import type { LifecycleItem, BusinessAreaItem, BusinessFlowItem } from "./types";

export const LIFECYCLE_MOCK_DATA: LifecycleItem[] = [
  { no: 13, lifecycleId: "LC-013", nameKo: "서비스 폐기", nameEn: "Service Disposal", description: "서비스 수명 주기의 마지막 단계로, 서비스 폐기 및 데이터 보존 처리를 포함합니다.", category: "운영 지원", useYn: "사용" },
  { no: 12, lifecycleId: "LC-012", nameKo: "서비스 최적화", nameEn: "Service Optimization", description: "운영 중인 서비스의 성능 개선 및 비용 최적화 활동을 포함합니다.", category: "운영 지원", useYn: "사용" },
  { no: 11, lifecycleId: "LC-011", nameKo: "서비스 모니터링", nameEn: "Service Monitoring", description: "서비스 상태 및 품질을 실시간으로 모니터링하고 이상 감지 및 대응 활동을 포함합니다.", category: "IT Admin", useYn: "사용" },
  { no: 10, lifecycleId: "LC-010", nameKo: "서비스 운영", nameEn: "Service Operation", description: "출시된 서비스의 일상적인 운영 및 유지보수 활동을 포함합니다.", category: "운영 지원", useYn: "사용" },
  { no: 9, lifecycleId: "LC-009", nameKo: "서비스 출시", nameEn: "Service Launch", description: "서비스 출시 준비 및 실제 론칭 활동, 초기 고객 온보딩 등을 포함합니다.", category: "고객 여정", useYn: "사용" },
  { no: 8, lifecycleId: "LC-008", nameKo: "서비스 검증", nameEn: "Service Validation", description: "서비스 품질 검증 및 사용자 수용 테스트(UAT) 수행 활동을 포함합니다.", category: "IT Admin", useYn: "사용" },
  { no: 7, lifecycleId: "LC-007", nameKo: "서비스 구현", nameEn: "Service Implementation", description: "서비스 설계에 따른 실제 개발 및 구현 활동을 포함합니다.", category: "IT Admin", useYn: "미사용" },
  { no: 6, lifecycleId: "LC-006", nameKo: "서비스 설계", nameEn: "Service Design", description: "서비스 아키텍처 설계 및 세부 기능 설계 활동을 포함합니다.", category: "전략/기획", useYn: "사용" },
  { no: 5, lifecycleId: "LC-005", nameKo: "서비스 분석", nameEn: "Service Analysis", description: "서비스 요구사항 분석 및 비즈니스 요건 정의 활동을 포함합니다.", category: "전략/기획", useYn: "사용" },
  { no: 4, lifecycleId: "LC-004", nameKo: "서비스 기획", nameEn: "Service Planning", description: "신규 서비스 기획 및 비즈니스 케이스 수립 활동을 포함합니다.", category: "전략/기획", useYn: "사용" },
  { no: 3, lifecycleId: "LC-003", nameKo: "서비스 전략", nameEn: "Service Strategy", description: "서비스 포트폴리오 전략 수립 및 시장 분석 활동을 포함합니다.", category: "전략/기획", useYn: "미사용" },
  { no: 2, lifecycleId: "LC-002", nameKo: "서비스 혁신", nameEn: "Service Innovation", description: "기존 서비스의 혁신 방향 도출 및 신기술 적용 검토 활동을 포함합니다.", category: "고객 여정", useYn: "사용" },
  { no: 1, lifecycleId: "LC-001", nameKo: "서비스 공통", nameEn: "Service Common", description: "전체 서비스 수명 주기에 걸쳐 공통적으로 적용되는 기준 및 정책을 포함합니다.", category: "운영 지원", useYn: "사용" },
];

export function getLifecycleList(): LifecycleItem[] {
  return LIFECYCLE_MOCK_DATA;
}

export function getLifecycleDetail(lifecycleId: string): LifecycleItem | undefined {
  return LIFECYCLE_MOCK_DATA.find((d) => d.lifecycleId === lifecycleId);
}

export const BUSINESS_AREA_MOCK_DATA: BusinessAreaItem[] = [
  { no: 13, businessAreaId: "BA-013", category: "운영 지원", lifecycleId: "LC-013", lifecycleNameKo: "서비스 폐기", nameKo: "데이터 아카이빙", description: "서비스 종료 후 데이터 보존 정책에 따라 데이터를 아카이빙하고 삭제 처리합니다.", useYn: "사용" },
  { no: 12, businessAreaId: "BA-012", category: "운영 지원", lifecycleId: "LC-012", lifecycleNameKo: "서비스 최적화", nameKo: "성능 최적화", description: "운영 중인 서비스의 응답 속도 및 처리량을 개선하는 활동을 수행합니다.", useYn: "사용" },
  { no: 11, businessAreaId: "BA-011", category: "IT Admin", lifecycleId: "LC-011", lifecycleNameKo: "서비스 모니터링", nameKo: "장애 대응", description: "실시간 모니터링을 통해 발생된 장애를 신속히 감지하고 복구 활동을 수행합니다.", useYn: "사용" },
  { no: 10, businessAreaId: "BA-010", category: "운영 지원", lifecycleId: "LC-010", lifecycleNameKo: "서비스 운영", nameKo: "유지보수 관리", description: "서비스 운영 중 발생하는 결함을 수정하고 기능 개선 요청을 처리합니다.", useYn: "사용" },
  { no: 9, businessAreaId: "BA-009", category: "고객 여정", lifecycleId: "LC-009", lifecycleNameKo: "서비스 출시", nameKo: "고객 온보딩", description: "신규 고객이 서비스를 원활히 사용할 수 있도록 안내하고 지원하는 활동입니다.", useYn: "사용" },
  { no: 8, businessAreaId: "BA-008", category: "IT Admin", lifecycleId: "LC-008", lifecycleNameKo: "서비스 검증", nameKo: "사용자 수용 테스트", description: "실제 사용자 환경에서 서비스 품질 및 요구사항 충족 여부를 검증합니다.", useYn: "사용" },
  { no: 7, businessAreaId: "BA-007", category: "IT Admin", lifecycleId: "LC-007", lifecycleNameKo: "서비스 구현", nameKo: "개발 및 단위 테스트", description: "설계 명세에 따라 서비스를 개발하고 단위 테스트를 수행합니다.", useYn: "미사용" },
  { no: 6, businessAreaId: "BA-006", category: "전략/기획", lifecycleId: "LC-006", lifecycleNameKo: "서비스 설계", nameKo: "아키텍처 설계", description: "서비스의 전체 시스템 아키텍처와 세부 기능 설계를 수행합니다.", useYn: "사용" },
  { no: 5, businessAreaId: "BA-005", category: "전략/기획", lifecycleId: "LC-005", lifecycleNameKo: "서비스 분석", nameKo: "요구사항 분석", description: "이해관계자 인터뷰 및 현황 분석을 통해 비즈니스 요구사항을 도출합니다.", useYn: "사용" },
  { no: 4, businessAreaId: "BA-004", category: "전략/기획", lifecycleId: "LC-004", lifecycleNameKo: "서비스 기획", nameKo: "서비스 로드맵 수립", description: "신규 서비스의 출시 계획 및 단계별 로드맵을 수립합니다.", useYn: "사용" },
  { no: 3, businessAreaId: "BA-003", category: "전략/기획", lifecycleId: "LC-003", lifecycleNameKo: "서비스 전략", nameKo: "시장 분석", description: "경쟁사 분석 및 시장 트렌드 조사를 통해 서비스 포지셔닝 전략을 수립합니다.", useYn: "미사용" },
  { no: 2, businessAreaId: "BA-002", category: "고객 여정", lifecycleId: "LC-002", lifecycleNameKo: "서비스 혁신", nameKo: "신기술 적용 검토", description: "AI, 클라우드 등 신기술 도입 방안을 검토하고 혁신 과제를 발굴합니다.", useYn: "사용" },
  { no: 1, businessAreaId: "BA-001", category: "운영 지원", lifecycleId: "LC-001", lifecycleNameKo: "서비스 공통", nameKo: "공통 정책 관리", description: "전체 서비스에 공통으로 적용되는 운영 정책 및 기준을 수립하고 관리합니다.", useYn: "사용" },
];

export function getBusinessAreaList(): BusinessAreaItem[] {
  return BUSINESS_AREA_MOCK_DATA;
}

export function getBusinessAreaDetail(businessAreaId: string): BusinessAreaItem | undefined {
  return BUSINESS_AREA_MOCK_DATA.find((d) => d.businessAreaId === businessAreaId);
}

export const BUSINESS_FLOW_MOCK_DATA: BusinessFlowItem[] = [
  { no: 13, businessFlowId: "BF-013", category: "운영 지원", lifecycleId: "LC-013", lifecycleNameKo: "서비스 폐기", businessAreaId: "BA-013", businessAreaNameKo: "데이터 아카이빙", nameKo: "데이터 백업 및 삭제 처리", description: "서비스 종료 시 규정에 따른 데이터 백업 및 안전한 삭제 절차를 수행합니다.", useYn: "사용" },
  { no: 12, businessFlowId: "BF-012", category: "운영 지원", lifecycleId: "LC-012", lifecycleNameKo: "서비스 최적화", businessAreaId: "BA-012", businessAreaNameKo: "성능 최적화", nameKo: "성능 병목 구간 분석 및 개선", description: "운영 중 식별된 성능 병목 구간을 분석하고 튜닝 작업을 수행합니다.", useYn: "사용" },
  { no: 11, businessFlowId: "BF-011", category: "IT Admin", lifecycleId: "LC-011", lifecycleNameKo: "서비스 모니터링", businessAreaId: "BA-011", businessAreaNameKo: "장애 대응", nameKo: "장애 감지 및 복구 실행", description: "모니터링 알람 수신 후 장애 원인을 파악하고 복구 절차를 수행합니다.", useYn: "사용" },
  { no: 10, businessFlowId: "BF-010", category: "운영 지원", lifecycleId: "LC-010", lifecycleNameKo: "서비스 운영", businessAreaId: "BA-010", businessAreaNameKo: "유지보수 관리", nameKo: "결함 수정 및 패치 배포", description: "운영 중 발생한 결함을 분석하고 수정 후 프로덕션에 배포합니다.", useYn: "사용" },
  { no: 9, businessFlowId: "BF-009", category: "고객 여정", lifecycleId: "LC-009", lifecycleNameKo: "서비스 출시", businessAreaId: "BA-009", businessAreaNameKo: "고객 온보딩", nameKo: "신규 고객 온보딩 가이드 제공", description: "신규 가입 고객에게 서비스 이용 방법 및 주요 기능을 안내합니다.", useYn: "사용" },
  { no: 8, businessFlowId: "BF-008", category: "IT Admin", lifecycleId: "LC-008", lifecycleNameKo: "서비스 검증", businessAreaId: "BA-008", businessAreaNameKo: "사용자 수용 테스트", nameKo: "UAT 시나리오 계획 및 실행", description: "사용자 관점에서 서비스 기능 및 비기능 요건을 검증하는 테스트를 수행합니다.", useYn: "사용" },
  { no: 7, businessFlowId: "BF-007", category: "IT Admin", lifecycleId: "LC-007", lifecycleNameKo: "서비스 구현", businessAreaId: "BA-007", businessAreaNameKo: "개발 및 단위 테스트", nameKo: "기능 개발 및 단위 테스트 수행", description: "설계 명세에 따라 기능을 개발하고 단위 테스트로 품질을 검증합니다.", useYn: "미사용" },
  { no: 6, businessFlowId: "BF-006", category: "전략/기획", lifecycleId: "LC-006", lifecycleNameKo: "서비스 설계", businessAreaId: "BA-006", businessAreaNameKo: "아키텍처 설계", nameKo: "시스템 아키텍처 정의 및 검토", description: "서비스 요구사항 기반으로 시스템 아키텍처를 설계하고 검토합니다.", useYn: "사용" },
  { no: 5, businessFlowId: "BF-005", category: "전략/기획", lifecycleId: "LC-005", lifecycleNameKo: "서비스 분석", businessAreaId: "BA-005", businessAreaNameKo: "요구사항 분석", nameKo: "이해관계자 인터뷰 및 요구사항 수집", description: "이해관계자 인터뷰를 통해 비즈니스 요구사항을 수집하고 문서화합니다.", useYn: "사용" },
  { no: 4, businessFlowId: "BF-004", category: "전략/기획", lifecycleId: "LC-004", lifecycleNameKo: "서비스 기획", businessAreaId: "BA-004", businessAreaNameKo: "서비스 로드맵 수립", nameKo: "로드맵 작성 및 이해관계자 승인", description: "서비스 출시 단계별 계획을 작성하고 이해관계자의 승인을 획득합니다.", useYn: "사용" },
  { no: 3, businessFlowId: "BF-003", category: "전략/기획", lifecycleId: "LC-003", lifecycleNameKo: "서비스 전략", businessAreaId: "BA-003", businessAreaNameKo: "시장 분석", nameKo: "경쟁사 벤치마킹 분석 수행", description: "주요 경쟁사 서비스를 분석하여 차별화 전략 수립의 근거 자료를 작성합니다.", useYn: "미사용" },
  { no: 2, businessFlowId: "BF-002", category: "고객 여정", lifecycleId: "LC-002", lifecycleNameKo: "서비스 혁신", businessAreaId: "BA-002", businessAreaNameKo: "신기술 적용 검토", nameKo: "신기술 PoC 기획 및 수행", description: "AI·클라우드 등 신기술 적용 가능성을 검토하고 개념 검증(PoC)을 수행합니다.", useYn: "사용" },
  { no: 1, businessFlowId: "BF-001", category: "운영 지원", lifecycleId: "LC-001", lifecycleNameKo: "서비스 공통", businessAreaId: "BA-001", businessAreaNameKo: "공통 정책 관리", nameKo: "공통 운영 정책 수립 절차", description: "전체 서비스에 적용되는 공통 운영 정책과 기준을 수립하고 배포합니다.", useYn: "사용" },
];

export function getBusinessFlowList(): BusinessFlowItem[] {
  return BUSINESS_FLOW_MOCK_DATA;
}

export function getBusinessFlowDetail(businessFlowId: string): BusinessFlowItem | undefined {
  return BUSINESS_FLOW_MOCK_DATA.find((d) => d.businessFlowId === businessFlowId);
}
