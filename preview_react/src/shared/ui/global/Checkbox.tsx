import { type CSSProperties } from "react";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

type CheckboxSize = "l" | "m" | "s";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: CheckboxSize;
  disabled?: boolean;
  style?: CSSProperties;
}

const SIZE_CLASSES: Record<CheckboxSize, { box: string; check: string; label: string }> = {
  l: {
    box: "h-6 w-6 rounded",
    check: "h-[10px] w-[14px]",
    label: "text-base font-normal leading-6",
  },
  m: {
    box: "h-5 w-5 rounded",
    check: "h-[9px] w-3",
    label: "text-sm font-normal leading-5",
  },
  s: {
    box: "h-[18px] w-[18px] rounded-[3px]",
    check: "h-2 w-[10px]",
    label: "text-xs font-normal leading-[18px]",
  },
};

function CheckmarkIcon({ size }: { size: CheckboxSize }) {
  return (
    <svg
      className={SIZE_CLASSES[size].check}
      viewBox="0 0 14 10"
      fill="none"
    >
      <path
        d="M1 5L5 9L13 1"
        stroke="#ffffff"
        strokeWidth={size === "s" ? 1.5 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  size = "m",
  disabled = false,
  style,
}: CheckboxProps) {
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <div
      className={cx(
        "flex select-none items-center justify-center gap-2 rounded cursor-pointer",
        disabled && "cursor-not-allowed opacity-60"
      )}
      style={style}
      onClick={() => {
        if (!disabled) {
          onChange(!checked);
        }
      }}
    >
      <div
        className={cx(
          "flex shrink-0 items-center justify-center box-border",
          sizeClasses.box,
          checked ? (disabled ? "bg-[#71717a]" : "bg-[#7a5af8]") : "border border-[#e4e7ec] bg-white"
        )}
      >
        {checked && <CheckmarkIcon size={size} />}
      </div>
      {label && <span className={cx("whitespace-nowrap font-sans text-[#3f3f46]", sizeClasses.label)}>{label}</span>}
    </div>
  );
}
