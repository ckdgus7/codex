import { useState } from "react";
import type { CSSProperties } from "react";
import type { BusinessAreaItem } from "@/features/sbf/model/types";

interface BusinessAreaDetailProps {
  data: BusinessAreaItem;
}

function UserRoleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r="10" fill="#e4e4e7" />
      <circle cx="10" cy="8.5" r="3" fill="#a1a1aa" />
      <path
        d="M4.5 17C4.5 13.96 7 11.5 10 11.5s5.5 2.46 5.5 5.5"
        stroke="#a1a1aa"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function OrgSeparator() {
  return (
    <div
      style={{
        width: 4,
        height: 10,
        backgroundColor: "#d4d4d8",
        flexShrink: 0,
        borderRadius: 1,
        marginLeft: 4,
        marginRight: 4,
      }}
    />
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 4.5L11.5 9L7 13.5" stroke="#71717a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8L10 4" stroke="#71717a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 12L10 8L6 4" stroke="#71717a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronFirstIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 4V12" stroke="#71717a" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M12 12L8 8L12 4" stroke="#71717a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLastIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 4V12" stroke="#71717a" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4 4L8 8L4 12" stroke="#71717a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FONT_FAMILY = "Pretendard, sans-serif";

const MOCK_BUSINESS_FLOWS = [
  { id: "B0001", name: "고객인증" },
  { id: "B0002", name: "본인인증" },
  { id: "B0001", name: "업무승인 요청 및 처리" },
];

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

const s = {
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    width: "100%",
    fontFamily: FONT_FAMILY,
  } satisfies CSSProperties,

  fieldFull: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    width: "100%",
  } satisfies CSSProperties,

  fieldInline: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flexShrink: 0,
  } satisfies CSSProperties,

  label: {
    fontFamily: FONT_FAMILY,
    fontWeight: 500,
    fontSize: 12,
    lineHeight: "16px",
    color: "#a1a1aa",
    whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  value: {
    fontFamily: FONT_FAMILY,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: "24px",
    color: "#3f3f46",
  } satisfies CSSProperties,

  valueSmall: {
    fontFamily: FONT_FAMILY,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "20px",
    color: "#3f3f46",
  } satisfies CSSProperties,

  metaRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 40,
    width: "100%",
    flexWrap: "wrap" as const,
  } satisfies CSSProperties,

  authorValueRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  } satisfies CSSProperties,

  orgText: {
    fontFamily: FONT_FAMILY,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "20px",
    color: "#a1a1aa",
    whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  lifecycleCard: {
    border: "1px solid #e4e4e7",
    borderRadius: 8,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    width: "100%",
    boxSizing: "border-box" as const,
    backgroundColor: "#ffffff",
  } satisfies CSSProperties,

  flowSectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  } satisfies CSSProperties,

  flowSectionTitle: {
    fontFamily: FONT_FAMILY,
    fontWeight: 500,
    fontSize: 12,
    lineHeight: "16px",
    color: "#a1a1aa",
  } satisfies CSSProperties,

  flowPagination: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  } satisfies CSSProperties,

  flowPaginationText: {
    fontFamily: FONT_FAMILY,
    fontWeight: 400,
    fontSize: 12,
    lineHeight: "16px",
    color: "#71717a",
    whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  flowPerPageSelect: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    color: "#3f3f46",
    border: "1px solid #e4e4e7",
    borderRadius: 4,
    padding: "2px 4px",
    background: "#ffffff",
    cursor: "pointer",
    height: 24,
  } satisfies CSSProperties,

  flowPageNavBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 0,
    borderRadius: 4,
    flexShrink: 0,
  } satisfies CSSProperties,

  flowList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
  } satisfies CSSProperties,

  flowItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minHeight: 40,
    padding: "8px 12px 8px 8px",
    backgroundColor: "#ffffff",
    border: "1px solid #e4e4e7",
    borderRadius: 4,
    boxSizing: "border-box" as const,
    width: "100%",
  } satisfies CSSProperties,

  flowBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3px 10px",
    borderRadius: 12,
    border: "1px solid #12b76a",
    backgroundColor: "rgba(18, 183, 106, 0.05)",
    fontFamily: FONT_FAMILY,
    fontSize: 10,
    fontWeight: 500,
    lineHeight: "12px",
    color: "#12b76a",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
  } satisfies CSSProperties,

  flowName: {
    flex: 1,
    fontFamily: FONT_FAMILY,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "20px",
    color: "#3f3f46",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  flowLinkBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    border: "1px solid #71717a",
    borderRadius: 4,
    backgroundColor: "#ffffff",
    cursor: "pointer",
    flexShrink: 0,
    padding: 0,
  } satisfies CSSProperties,

  emptyFlow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    color: "#a1a1aa",
  } satisfies CSSProperties,
} as const;

export function BusinessAreaDetail({ data }: BusinessAreaDetailProps) {
  const [perPage, setPerPage] = useState(10);
  const totalFlows = MOCK_BUSINESS_FLOWS.length;
  const pageCount = Math.max(1, Math.ceil(totalFlows / perPage));

  return (
    <div style={s.content}>
      <div style={s.fieldFull}>
        <span style={s.label}>업무영역(D2)</span>
        <span style={s.value}>{data.nameKo}</span>
      </div>

      <div style={s.fieldFull}>
        <span style={s.label}>업무영역(D2) 설명</span>
        <span style={{ ...s.value, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {data.description || <span style={{ color: "#a1a1aa" }}>-</span>}
        </span>
      </div>

      <div style={s.fieldInline}>
        <span style={s.label}>사용여부</span>
        <span style={s.value}>{data.useYn}</span>
      </div>

      <div style={s.metaRow}>
        <div style={s.fieldInline}>
          <span style={s.label}>작성자</span>
          <div style={s.authorValueRow}>
            <span style={s.valueSmall}>관리자</span>
            <UserRoleIcon />
            <OrgSeparator />
            <span style={s.orgText}>Nova 추진팀</span>
          </div>
        </div>
        <div style={s.fieldInline}>
          <span style={s.label}>작성일시</span>
          <span style={s.valueSmall}>2025-11-28 15:24</span>
        </div>
        <div style={s.fieldInline}>
          <span style={s.label}>마지막 수정일시</span>
          <span style={s.valueSmall}>2025-11-28 15:24</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
        <div style={s.flowSectionHeader}>
          <span style={s.flowSectionTitle}>업무Flow(D3)</span>
          <div style={s.flowPagination}>
            <span style={s.flowPaginationText}>Items per page:</span>
            <select
              style={s.flowPerPageSelect}
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
            >
              {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span style={s.flowPaginationText}>
              1-{Math.min(perPage, totalFlows)} of {totalFlows}
            </span>
            <button style={s.flowPageNavBtn} disabled={true} aria-label="첫 페이지">
              <ChevronFirstIcon />
            </button>
            <button style={s.flowPageNavBtn} disabled={true} aria-label="이전 페이지">
              <ChevronLeftIcon />
            </button>
            <span style={{ ...s.flowPaginationText, minWidth: 16, textAlign: "center" }}>1</span>
            <button style={s.flowPageNavBtn} disabled={pageCount <= 1} aria-label="다음 페이지">
              <ChevronRightIcon />
            </button>
            <button style={s.flowPageNavBtn} disabled={pageCount <= 1} aria-label="마지막 페이지">
              <ChevronLastIcon />
            </button>
          </div>
        </div>

        <div style={s.flowList}>
          {MOCK_BUSINESS_FLOWS.length === 0 ? (
            <div style={s.emptyFlow}>연결된 업무Flow가 없습니다.</div>
          ) : (
            MOCK_BUSINESS_FLOWS.map((flow, idx) => (
              <div key={idx} style={s.flowItem}>
                <span style={s.flowBadge}>{flow.id}</span>
                <span style={s.flowName}>{flow.name}</span>
                <button style={s.flowLinkBtn} title="상세보기">
                  <ArrowRightIcon />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
