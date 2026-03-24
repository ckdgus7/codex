import { useState, type CSSProperties } from "react";
import { Button } from "@/shared/ui/global/Button";
import { LifecycleDetail } from "@/features/sbf/ui/d1/component/LifecycleDetail";
import { LifecycleEditPopup } from "@/features/sbf/ui/d1/LifecycleEditPopup";
import { ReasonPopup } from "@/shared/ui/popup/ReasonPopup";
import type { LifecycleItem } from "@/features/sbf/model/types";
import { popupStyles } from "@/shared/ui/styles";

interface LifecycleDetailPopupProps {
  open: boolean;
  onClose: () => void;
  data: LifecycleItem | null;
  onDelete?: () => void;
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 5L15 15"
        stroke="#71717a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 5L5 15"
        stroke="#71717a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const s = {
  overlay: {
    ...popupStyles.overlay,
  } satisfies CSSProperties,

  popup: {
    width: 720,
    maxHeight: "90vh",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "Pretendard, sans-serif",
  } satisfies CSSProperties,

  header: {
    display: "flex",
    flexDirection: "column",
    padding: "32px 32px 16px 32px",
    flexShrink: 0,
  } satisfies CSSProperties,

  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  } satisfies CSSProperties,

  titleText: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: 24,
    fontWeight: 700,
    lineHeight: "32px",
    color: "#52525b",
    whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  closeBtn: {
    ...popupStyles.closeBtn,
  } satisfies CSSProperties,

  main: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 32px",
  } satisfies CSSProperties,

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px 32px 32px",
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

export function LifecycleDetailPopup({
  open,
  onClose,
  data,
  onDelete,
}: LifecycleDetailPopupProps) {
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [reasonPopupOpen, setReasonPopupOpen] = useState(false);

  if (!open || !data) return null;

  return (
    <>
      <div style={s.overlay} onClick={onClose}>
        <div style={s.popup} onClick={(e) => e.stopPropagation()}>
          <div style={s.header}>
            <div style={s.titleRow}>
              <span style={s.titleText}>Lifecycle(D1) 조회</span>
              <button style={s.closeBtn} onClick={onClose} aria-label="닫기">
                <CloseIcon />
              </button>
            </div>
          </div>

          <div style={s.main}>
            <LifecycleDetail data={data} />
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
                onClick={() => setEditPopupOpen(true)}
              >
                수정
              </Button>
            </div>
          </div>
        </div>
      </div>

      <LifecycleEditPopup
        open={editPopupOpen}
        onClose={() => setEditPopupOpen(false)}
        onSave={() => setEditPopupOpen(false)}
        initialData={data}
      />

      <ReasonPopup
        open={reasonPopupOpen}
        title="삭제"
        onCancel={() => setReasonPopupOpen(false)}
        onConfirm={() => {
          setReasonPopupOpen(false);
          onClose();
          onDelete?.();
        }}
      />
    </>
  );
}
