import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/global/Button";
import { Textarea } from "@/shared/ui/global/Textarea";

interface ReasonPopupProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
  cancelLabel?: string;
  confirmLabel?: string;
  placeholder?: string;
  label?: string;
  maxLength?: number;
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 5L15 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 5L5 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ReasonPopup({
  open,
  title,
  onCancel,
  onConfirm,
  cancelLabel = "취소",
  confirmLabel = "확인",
  placeholder,
  label,
  maxLength = 300,
}: ReasonPopupProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div
        className="flex w-[880px] max-w-[calc(100vw-32px)] flex-col rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pb-4 pt-8">
          <div className="flex w-full items-center justify-between">
            <span className="text-2xl font-bold leading-8 text-[#52525b]">{title}</span>
            <button className="flex h-8 w-8 items-center justify-center rounded bg-transparent p-0" onClick={onCancel} aria-label="닫기">
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="flex flex-col px-8 py-6">
          <Textarea
            label={label ?? `${title} 사유`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={placeholder ?? `${title} 사유를 입력해주세요.`}
            maxLength={maxLength}
            indicator
            style={{ minHeight: 120 }}
          />
        </div>

        <div className="flex items-center justify-between px-8 pb-8 pt-4">
          <div>
            <Button size="l" variant="outlined" color="info" onClick={onCancel}>
              {cancelLabel}
            </Button>
          </div>
          <div>
            <Button size="l" variant="filled" color="positive" onClick={() => onConfirm(reason)}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
