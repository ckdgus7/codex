import type { L3BusinessInfoItem, L3BusinessUseStatus } from "./l3-business-info.types";

const BUSINESS_NAMES = [
  "신용정보 연동",
  "미납관리대상 기준등록",
  "미납원부 생성/배정",
  "미납이벤트 생성관리",
  "정산 내역 관리",
  "수납 일정 관리",
  "채권 회수 관리",
  "연체 고객 분류",
  "상환 계획 등록",
  "관리 수수료 설정",
];

const DOMAIN_NAMES = ["미납관리", "신용정보", "수납관리", "채권관리", "정산관리"];

const COMPONENT_IDS = ["SKNC300", "SKNC310", "SKNC320", "SKNC330", "SKNC340"];

const PLANNER_LEADERS = ["홍길동", "이순신", "강감찬", "장보고", "김유신"];
const DESIGN_LEADERS = ["이명숙", "김철수", "이영희", "박지성", "최윤정"];

const BASE_NO = 998;

function formatBusinessId(componentId: string, index: number) {
  const serial = String(index + 1).padStart(4, "0");
  return `BZ-BIL${componentId}-${serial}`;
}

function createDateOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const L3_BUSINESS_INFO_MOCK_DATA: L3BusinessInfoItem[] = Array.from({ length: 120 }).map(
  (_, index) => {
    const componentId = COMPONENT_IDS[index % COMPONENT_IDS.length];
    const businessName = BUSINESS_NAMES[index % BUSINESS_NAMES.length];
    const domainName = DOMAIN_NAMES[index % DOMAIN_NAMES.length];
    const plannerLeader = PLANNER_LEADERS[index % PLANNER_LEADERS.length];
    const designLeader = DESIGN_LEADERS[index % DESIGN_LEADERS.length];
    const useYn: L3BusinessUseStatus = index % 3 === 0 ? "미사용" : "사용";

    return {
      id: `business-${index + 1}`,
      no: BASE_NO - index,
      businessId: formatBusinessId(componentId, index),
      businessName,
      componentId,
      domainName,
      plannerLeader,
      designLeader,
      useYn,
      createdAt: createDateOffset(index * 2),
    };
  }
);
