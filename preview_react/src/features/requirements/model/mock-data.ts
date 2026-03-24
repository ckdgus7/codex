import type { Requirement } from "./types";

const statuses: Requirement["status"][] = ["작성 중", "검토 중", "반려", "승인", "완료"];

const titles = [
  "고객 관리 정책 수립",
  "AI 챗봇 응답 품질 개선 요구",
  "실시간 모니터링 대시보드 구축",
  "사용자 권한 관리 체계 개선",
  "데이터 파이프라인 최적화 요구",
  "모바일 앱 성능 개선 요청",
  "자동 배포 파이프라인 구축",
  "API 게이트웨이 보안 강화",
  "로그 수집 시스템 통합",
  "클라우드 비용 최적화 방안 수립",
  "레거시 서비스 아키텍처 전환",
  "서비스 장애 대응 프로세스 수립",
  "데이터베이스 마이그레이션 계획",
  "UI/UX 개선 사항 정리",
  "통합 검증 테스트 구축",
  "성능 테스트 자동화 프레임워크 구축",
  "보안 감사 로그 시스템 구축",
  "사용자 알림 프로세스 개선",
  "앱 관리 기능 개선",
  "서비스 메뉴 관리 체계 수립",
  "CI/CD 파이프라인 고도화",
  "마이크로서비스 분리 요구",
  "알림 서비스 통합 관리",
  "보고서 자동 생성 시스템",
  "데이터 이관 관리 시스템 구축",
  "백엔드 API 리팩터링",
  "프론트엔드 성능 최적화",
  "모니터링 알림 정책 수립",
  "사용자 피드백 수집 시스템",
  "배치 작업 스케줄링 개선",
  "캐시 전략 최적화",
  "에러 트래킹 시스템 구축",
  "데이터 백업 정책 수립",
  "API 문서화 자동화",
  "서비스 디스커버리 구축",
  "로드밸런서 설정 최적화",
];

const taskNames = [
  "앱 관리 기능 개선",
  "서비스 정책 수립",
  "보안 강화 프로젝트",
  "클라우드 전환 프로젝트",
  "AI 서비스 고도화",
];

const authors = [
  { name: "김다은", role: "SB기획 책임자", org: "Nova 추진팀" },
  { name: "이서준", role: "SB기획 책임자", org: "AI혁신팀" },
  { name: "박서진", role: "프로젝트 매니저", org: "플랫폼팀" },
  { name: "정유진", role: "시니어 개발자", org: "개발1팀" },
  { name: "최민호", role: "품질관리자", org: "QA팀" },
];

const timeAgo = [
  "1개월 전",
  "2주 전",
  "3일 전",
  "1일 전",
  "5시간 전",
  "2시간 전",
  "30분 전",
  "방금 전",
];

function generateReqId(index: number): string {
  return `RQ-BP-${5048 + index}`;
}

function generateTaskId(index: number): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return `TK-BP-${letters[index % 26]}0${10 + (index % 90)}`;
}

function generateDueDate(index: number): string {
  const base = new Date(2026, 1, 28);
  base.setDate(base.getDate() - index * 3);
  return base.toISOString().split("T")[0];
}

export function generateMockRequirements(count: number = 36): Requirement[] {
  return Array.from({ length: count }, (_, i) => {
    const author = authors[i % authors.length];

    return {
      id: `req-${i + 1}`,
      reqId: generateReqId(i),
      title: titles[i % titles.length],
      status: statuses[i % statuses.length],
      dueDate: generateDueDate(i),
      taskId: generateTaskId(i),
      taskName: taskNames[i % taskNames.length],
      updatedAt: timeAgo[i % timeAgo.length],
      author: author.name,
      authorRole: author.role,
      authorOrg: author.org,
    };
  });
}
