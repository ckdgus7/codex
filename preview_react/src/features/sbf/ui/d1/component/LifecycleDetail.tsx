import type { CSSProperties } from "react";
import type { LifecycleItem } from "@/features/sbf/model/types";

interface LifecycleDetailProps {
  data: LifecycleItem;
  isExternal?: boolean;
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
      }}
    />
  );
}

const s = {
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    width: "100%",
  } satisfies CSSProperties,

  wrapRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px 32px",
    width: "100%",
  } satisfies CSSProperties,

  fieldItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flexShrink: 0,
  } satisfies CSSProperties,

  fieldItemFull: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    width: "100%",
  } satisfies CSSProperties,

  label: {
    fontFamily: "Pretendard, sans-serif",
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "18px",
    color: "#a1a1aa",
    whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  value: {
    fontFamily: "Pretendard, sans-serif",
    fontWeight: 400,
    fontSize: 16,
    lineHeight: "24px",
    color: "#3f3f46",
  } satisfies CSSProperties,

  authorValueRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  } satisfies CSSProperties,

  orgText: {
    fontFamily: "Pretendard, sans-serif",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "20px",
    color: "#3f3f46",
    opacity: 0.3,
    whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  metaRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 32,
    width: "100%",
    flexWrap: "wrap" as const,
  } satisfies CSSProperties,
} as const;

export function LifecycleDetail({ data, isExternal = false }: LifecycleDetailProps) {
  const isHtml = /<[a-z][\s\S]*>/i.test(data.description);

  return (
    <div style={s.content}>
      <div style={s.wrapRow}>
        <div style={s.fieldItem}>
          <span style={s.label}>구분</span>
          <span style={s.value}>{data.category}</span>
        </div>
        <div style={s.fieldItem}>
          <span style={s.label}>Lifecycle(D1) 명</span>
          <span style={s.value}>{data.nameKo}</span>
        </div>
      </div>

      <div style={s.fieldItemFull}>
        <span style={s.label}>Lifecycle(D1) 설명</span>
        {isHtml ? (
          <div
            style={s.value}
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        ) : (
          <span style={s.value}>{data.description}</span>
        )}
      </div>

      {!isExternal && (
        <>
          <div style={{ ...s.wrapRow, gap: "16px 0" }}>
            <div style={s.fieldItem}>
              <span style={s.label}>사용여부</span>
              <span style={s.value}>{data.useYn}</span>
            </div>
          </div>

          <div style={s.metaRow}>
            <div style={s.fieldItem}>
              <span style={s.label}>작성자</span>
              <div style={s.authorValueRow}>
                <span style={s.value}>관리자</span>
                <UserRoleIcon />
                <OrgSeparator />
                <span style={s.orgText}>Nova 추진팀</span>
              </div>
            </div>
            <div style={s.fieldItem}>
              <span style={s.label}>작성일시</span>
              <span style={s.value}>2025-11-28 15:24</span>
            </div>
            <div style={s.fieldItem}>
              <span style={s.label}>마지막 수정일시</span>
              <span style={s.value}>2025-11-28 15:24</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
