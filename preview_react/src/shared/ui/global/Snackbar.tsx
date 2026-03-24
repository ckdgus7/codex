import { useEffect, useCallback, type CSSProperties, type ReactNode } from "react";

type SnackbarType = "info" | "positive" | "negative" | "error" | "warning" | "success";

interface SnackbarProps {
  open: boolean;
  onClose: () => void;
  message: ReactNode;
  type?: SnackbarType;
  duration?: number;
  style?: CSSProperties;
}

const BG_COLORS: Record<SnackbarType, string> = {
  info: "#71717a",
  positive: "#7a5af8",
  negative: "#f04438",
  error: "#ee46bc",
  warning: "#f79009",
  success: "#1ac057",
};

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 8L16 16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 8L8 16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Snackbar({ open, onClose, message, type = "info", duration = 3000, style }: SnackbarProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open || duration <= 0) return;
    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, handleClose]);

  if (!open) return null;

  return (
    <div className="fixed bottom-10 left-1/2 z-[10000] flex w-[480px] -translate-x-1/2 items-start gap-4 rounded-lg px-6 pb-4 pt-4 box-border" style={{ backgroundColor: BG_COLORS[type], ...style }}>
      <p className="min-h-px min-w-px flex-1 font-sans text-base font-normal leading-6 text-white">{message}</p>
      <button type="button" className="flex shrink-0 items-start rounded-full border-none bg-none p-0" onClick={handleClose} aria-label="닫기">
        <CloseIcon />
      </button>
    </div>
  );
}
