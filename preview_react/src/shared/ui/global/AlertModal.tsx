import { type ReactNode, type ReactElement, useEffect } from "react";
import { Button } from "./Button";

type AlertType = "info" | "success" | "warning" | "error";

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  type?: AlertType;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  zIndex?: number;
}

function InfoIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="18" stroke="#7a5af8" strokeWidth="2.5" fill="none" />
      <line x1="26" y1="22" x2="26" y2="36" stroke="#7a5af8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="26" cy="17" r="1.5" fill="#7a5af8" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="18" stroke="#1ac057" strokeWidth="2.5" fill="none" />
      <path d="M18 26L23 31L34 20" stroke="#1ac057" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <path d="M26 8L46 44H6L26 8Z" stroke="#f79009" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <line x1="26" y1="22" x2="26" y2="33" stroke="#f79009" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="26" cy="38" r="1.5" fill="#f79009" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="18" stroke="#f04438" strokeWidth="2.5" fill="none" />
      <line x1="20" y1="20" x2="32" y2="32" stroke="#f04438" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="20" x2="20" y2="32" stroke="#f04438" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 8L16 16" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 8L8 16" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const ICON_MAP: Record<AlertType, () => ReactElement> = { info: InfoIcon, success: SuccessIcon, warning: WarningIcon, error: ErrorIcon };

export function AlertModal({ open, onClose, type = "info", message, confirmLabel, cancelLabel, onConfirm, onCancel, showCancel = false, zIndex = 9999 }: AlertModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const Icon = ICON_MAP[type];
  const resolvedConfirmLabel = confirmLabel ?? (showCancel ? "삭제" : "확인");
  const resolvedCancelLabel = cancelLabel ?? "취소";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40" style={{ zIndex }} onClick={onClose}>
      <div className="relative flex w-[440px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-6 shadow-[0px_12px_24px_0px_rgba(113,113,122,0.1)]" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="absolute right-2.5 top-2.5 flex items-center justify-center rounded border-none bg-none p-0" onClick={onClose} aria-label="닫기">
          <CloseIcon />
        </button>

        <div className="flex w-full flex-col items-center gap-4 overflow-x-hidden overflow-y-auto">
          <div className="flex shrink-0 items-center justify-center">
            <Icon />
          </div>
          <div className="w-full break-keep text-center font-sans text-base font-normal leading-6 text-[#71717a]">{message}</div>
          <div className="flex h-10 w-full shrink-0 items-start justify-center gap-4">
            {showCancel && (
              <Button size="l" variant="outlined" color="info" onClick={() => { onCancel?.(); onClose(); }}>
                {resolvedCancelLabel}
              </Button>
            )}
            <Button size="l" variant={showCancel ? "filled" : "outlined"} color={showCancel ? "positive" : "info"} onClick={() => { onConfirm?.(); onClose(); }}>
              {resolvedConfirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
