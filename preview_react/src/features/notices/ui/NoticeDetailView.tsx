import type { CSSProperties } from "react";
import { Breadcrumb } from "@/shared/ui/Breadcrumb";
import { Button } from "@/shared/ui/Button";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageTitle } from "@/shared/ui/PageTitle";
import { usePageHeader } from "@/shared/hooks/usePageHeader";
import type { NoticeDetail } from "../model/types";

const s = {
  outer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100%",
    fontFamily: "'Pretendard', sans-serif",
  } satisfies CSSProperties,
  main: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: 32,
    flex: 1,
  } satisfies CSSProperties,
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "160px minmax(0, 1fr)",
    borderTop: "1px solid #e4e4e7",
    borderBottom: "1px solid #e4e4e7",
    backgroundColor: "#ffffff",
  } satisfies CSSProperties,
  metaLabel: {
    minHeight: 56,
    padding: "16px 24px",
    borderBottom: "1px solid #e4e4e7",
    backgroundColor: "#fafafa",
    display: "flex",
    alignItems: "center",
    color: "#52525b",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: "20px",
  } satisfies CSSProperties,
  metaValue: {
    minHeight: 56,
    padding: "16px 24px",
    borderBottom: "1px solid #e4e4e7",
    display: "flex",
    alignItems: "center",
    color: "#18181b",
    fontSize: 14,
    lineHeight: "20px",
    wordBreak: "break-word",
  } satisfies CSSProperties,
  contentWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: "24px 0 0",
  } satisfies CSSProperties,
  contentTitle: {
    color: "#3f3f46",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: "20px",
  } satisfies CSSProperties,
  contentBody: {
    minHeight: 220,
    padding: "24px",
    borderRadius: 8,
    border: "1px solid #e4e4e7",
    backgroundColor: "#ffffff",
    color: "#3f3f46",
    fontSize: 16,
    lineHeight: "28px",
    whiteSpace: "pre-wrap",
  } satisfies CSSProperties,
  footer: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    paddingTop: 24,
  } satisfies CSSProperties,
} as const;

interface NoticeDetailViewProps {
  notice: NoticeDetail | null;
  loading: boolean;
  error: boolean;
  onBack: () => void;
}

export function NoticeDetailView({ notice, loading, error, onBack }: NoticeDetailViewProps) {
  const pageTitle = notice?.title ?? "공지사항 상세";
  const pageHeader = usePageHeader({
    title: pageTitle,
    onBack,
  });

  return (
    <div style={s.outer}>
      <PageHeader>
        <Breadcrumb items={[{ label: "게시판" }, { label: "공지사항" }]} />
        <PageTitle
          title={pageHeader.data.title}
          favoriteKey={pageHeader.data.title}
          onBack={pageHeader.onBack}
        />
      </PageHeader>

      <div style={s.main}>
        {loading ? (
          <div style={s.contentBody}>Loading...</div>
        ) : error ? (
          <div style={s.contentBody}>공지사항 상세 정보를 불러오는 중 오류가 발생했습니다.</div>
        ) : !notice ? (
          <div style={s.contentBody}>공지사항 정보가 없습니다.</div>
        ) : (
          <>
            <div style={s.metaGrid}>
              <div style={s.metaLabel}>구분</div>
              <div style={s.metaValue}>{notice.category}</div>
              <div style={s.metaLabel}>내용</div>
              <div style={s.metaValue}>{pageHeader.data.title}</div>
              <div style={s.metaLabel}>등록일</div>
              <div style={s.metaValue}>{notice.createdAt}</div>
              <div style={{ ...s.metaLabel, borderBottom: "none" }}>조회수</div>
              <div style={{ ...s.metaValue, borderBottom: "none" }}>{notice.views.toLocaleString()}</div>
            </div>

            <div style={s.contentWrap}>
              <div style={s.contentTitle}>본문</div>
              <div style={s.contentBody}>{notice.content}</div>
            </div>
          </>
        )}

        <div style={s.footer}>
          <div />
          <Button size="l" variant="outlined" color="positive" onClick={onBack}>
            목록
          </Button>
        </div>
      </div>
    </div>
  );
}
