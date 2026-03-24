import { useState, type CSSProperties } from "react";
import { Button } from "@/shared/ui/global/Button";
import { ReasonPopup } from "@/shared/ui/popup/ReasonPopup";
import { BusinessAreaDetail } from "@/features/sbf/ui/d2/component/BusinessAreaDetail";
import type { BusinessAreaItem } from "@/features/sbf/model/types";
import { popupStyles } from "@/shared/ui/styles";

interface BusinessAreaDetailPopupProps {
  open: boolean;
  onClose: () => void;
  data: BusinessAreaItem | null;
  onDelete?: (reason: string) => void;
  onEdit?: () => void;
}

const FONT_FAMILY = "Pretendard, sans-serif";

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 5L15 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 5L5 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const s = {
  overlay: {
    ...popupStyles.overlay,
    zIndex: 9999,
  } satisfies CSSProperties,

  popup: {
    width: 880,
    maxHeight: "90vh",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: FONT_FAMILY,
  } satisfies CSSProperties,

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "28px 32px 20px 32px",
    flexShrink: 0,
  } satisfies CSSProperties,

  titleText: {
    fontFamily: FONT_FAMILY,
    fontSize: 24,
    fontWeight: 700,
    lineHeight: "32px",
    color: "#18181b",
    whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  closeBtn: {
    ...popupStyles.closeBtn,
  } satisfies CSSProperties,

  main: {
    flex: 1,
    overflowY: "auto",
    padding: "0 32px 24px 32px",
  } satisfies CSSProperties,

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px 28px 32px",
    flexShrink: 0,
  } satisfies CSSProperties,

  footerLeft: {
    display: "flex",
    alignItems: "center",
  } satisfies CSSProperties,

  footerRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  } satisfies CSSProperties,
} as const;

export function BusinessAreaDetailPopup({
  open,
  onClose,
  data,
  onDelete,
  onEdit,
}: BusinessAreaDetailPopupProps) {
  const [reasonPopupOpen, setReasonPopupOpen] = useState(false);

  if (!open || !data) return null;

  return (
    <>
      <div style={s.overlay} onClick={onClose}>
        <div style={s.popup} onClick={(e) => e.stopPropagation()}>
          <div style={s.header}>
            <span style={s.titleText}>업무영역(D2) 조회</span>
            <button style={s.closeBtn} onClick={onClose} aria-label="닫기">
              <CloseIcon />
            </button>
          </div>

          <div style={s.main}>
            <BusinessAreaDetail data={data} />
          </div>

          <div style={s.footer}>
            <div style={s.footerLeft}>
              <Button size="l" variant="outlined" color="info" onClick={onClose}>
                닫기
              </Button>
            </div>
            <div style={s.footerRight}>
              <Button
                size="l"
                variant="filled"
                color="negative"
                onClick={() => setReasonPopupOpen(true)}
              >
                삭제
              </Button>
              <Button
                size="l"
                variant="outlined"
                color="info"
                onClick={onEdit}
              >
                수정
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ReasonPopup
        open={reasonPopupOpen}
        title="삭제"
        confirmLabel="삭제"
        cancelLabel="닫기"
        placeholder="삭제 사유를 입력할 수 있습니다."
        label="삭제 사유"
        onCancel={() => setReasonPopupOpen(false)}
        onConfirm={(reason) => {
          setReasonPopupOpen(false);
          onClose();
          onDelete?.(reason);
        }}
      />
    </>
  );
}
