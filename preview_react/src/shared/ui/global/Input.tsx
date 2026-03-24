import { useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from "react";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

type InputSize = "m";
type InputPrefix = "search";

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
        stroke="#a1a1aa"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 21L16.65 16.65"
        stroke="#a1a1aa"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PREFIX_MAP: Record<InputPrefix, ReactNode> = {
  search: <SearchIcon />,
};

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "style" | "prefix"> {
  size?: InputSize;
  label?: string;
  required?: boolean;
  prefix?: InputPrefix;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  indicator?: string;
  error?: boolean;
  helperText?: string;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
}

const SIZE_CLASSES: Record<InputSize, { field: string; icon: string; input: string }> = {
  m: {
    field: "h-10 gap-2 p-2",
    icon: "h-6 w-6",
    input: "text-base font-normal leading-6",
  },
};

export function Input({
  size = "m",
  label,
  required = false,
  prefix,
  leftIcon,
  rightIcon,
  indicator,
  error = false,
  helperText,
  disabled = false,
  style,
  wrapperStyle,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const resolvedLeftIcon = leftIcon ?? (prefix ? PREFIX_MAP[prefix] : undefined);
  const sizeClasses = SIZE_CLASSES[size];

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
          "flex w-full items-center rounded border bg-white box-border transition-colors duration-150 ease-in-out",
          error ? "border-[#f04438]" : focused ? "border-[#7a5af8]" : "border-[#e4e7ec]",
          disabled && "bg-[#fafafa] opacity-60",
          sizeClasses.field
        )}
        style={style}
      >
        <div className="flex min-w-0 flex-1 items-center">
          {resolvedLeftIcon && (
            <span className={cx("flex shrink-0 items-center overflow-hidden", sizeClasses.icon)}>{resolvedLeftIcon}</span>
          )}
          <div className="flex min-w-0 flex-1 items-center px-2">
            <input
              disabled={disabled}
              className={cx(
                "m-0 w-full border-none bg-transparent p-0 font-sans text-[#18181b] outline-none box-border placeholder:text-[#a1a1aa]",
                sizeClasses.input
              )}
              onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
              }}
              {...rest}
            />
          </div>
        </div>
        {indicator != null && (
          <span className="flex shrink-0 items-center justify-end whitespace-nowrap px-1 font-sans text-xs font-normal leading-[18px] text-[#a1a1aa]">
            {indicator}
          </span>
        )}
        {rightIcon && <span className={cx("flex shrink-0 items-center overflow-hidden", sizeClasses.icon)}>{rightIcon}</span>}
      </div>
      {helperText && (
        <span className={cx("pl-1 font-sans text-xs font-normal leading-[18px]", error ? "text-[#f04438]" : "text-[#a1a1aa]")}>
          {helperText}
        </span>
      )}
    </div>
  );
}
