import { useState, useRef, useEffect, type CSSProperties } from "react";

const DATEPICKER_STYLE_ID = "datepicker-native-hide";
function ensureNativePickerHidden() {
  if (typeof document === "undefined") return;
  if (document.getElementById(DATEPICKER_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = DATEPICKER_STYLE_ID;
  style.textContent = `
    input[type="date"]::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }
    input[type="date"]::-webkit-inner-spin-button { display: none; }
  `;
  document.head.appendChild(style);
}

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="3.5" width="15" height="14" rx="2" stroke="#71717a" strokeWidth="1.5" />
      <path d="M2.5 7.5H17.5" stroke="#71717a" strokeWidth="1.5" />
      <path d="M6.5 2V5" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.5 2V5" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function DatePicker({ value, onChange, placeholder = "YYYY-MM-DD", label, required = false, disabled = false, error = false, helperText, style, wrapperStyle }: DatePickerProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ensureNativePickerHidden();
  }, []);

  const handleFieldClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.showPicker?.();
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-2" style={wrapperStyle}>
      {label && (
        <div className="flex items-center">
          <div className="flex items-center justify-center gap-1">
            <span className="whitespace-nowrap font-sans text-sm font-medium leading-[18px] text-[#a1a1aa]">{label}</span>
            {required && <span className="h-1.5 w-1.5 shrink-0 rounded-[3px] bg-[#36bffa]" />}
          </div>
        </div>
      )}
      <div
        className={cx(
          "flex h-10 w-full cursor-pointer items-center gap-2 rounded border bg-white p-2 box-border transition-colors duration-150 ease-in-out",
          error ? "border-[#f04438]" : focused ? "border-[#7a5af8]" : "border-[#e4e7ec]",
          disabled && "cursor-not-allowed bg-[#fafafa] opacity-60"
        )}
        style={style}
        onClick={handleFieldClick}
      >
        <div className="flex min-h-0 min-w-0 flex-1 items-center">
          <div className="relative flex min-h-0 min-w-0 flex-1 items-center px-2">
            <input
              ref={inputRef}
              type="date"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder={placeholder}
              className={cx(
                "m-0 w-full border-none bg-transparent p-0 font-sans text-base font-normal leading-6 outline-none box-border",
                value ? "text-[#18181b]" : "text-[#a1a1aa]",
                disabled && "cursor-not-allowed"
              )}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
        </div>
        <span className={cx("flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden", disabled && "cursor-not-allowed")}>
          <CalendarIcon />
        </span>
      </div>
      {helperText && <span className={cx("pl-1 font-sans text-xs font-normal leading-[18px]", error ? "text-[#f04438]" : "text-[#a1a1aa]")}>{helperText}</span>}
    </div>
  );
}
