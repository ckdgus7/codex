import { type CSSProperties } from "react";

type ToggleSize = "l" | "m" | "s";
type LabelPosition = "left" | "right";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: LabelPosition;
  size?: ToggleSize;
  disabled?: boolean;
  style?: CSSProperties;
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

const SIZE_CLASSES: Record<ToggleSize, { track: string; knob: string; label: string; gap: string; pad: string }> = {
  l: { track: "w-10 rounded-xl", knob: "h-4 w-4 rounded-[10px]", label: "text-base leading-6", gap: "gap-2", pad: "p-1" },
  m: { track: "w-9 rounded-[10px]", knob: "h-[14px] w-[14px] rounded-lg", label: "text-sm leading-5", gap: "gap-2", pad: "p-[3px]" },
  s: { track: "w-8 rounded-[10px]", knob: "h-3 w-3 rounded-lg", label: "text-xs leading-[18px]", gap: "gap-2", pad: "p-[3px]" },
};

export function Toggle({ checked, onChange, label, labelPosition = "right", size = "m", disabled = false, style }: ToggleProps) {
  const sizeClasses = SIZE_CLASSES[size];
  const labelElement = label ? <span className={cx("whitespace-nowrap font-sans font-normal text-[#3f3f46]", sizeClasses.label)}>{label}</span> : null;

  return (
    <div className={cx("flex select-none items-center justify-center rounded", sizeClasses.gap, disabled ? "cursor-not-allowed" : "cursor-pointer")} style={style} onClick={() => !disabled && onChange(!checked)}>
      {labelPosition === "left" && labelElement}
      <div className={cx(
        "flex shrink-0 items-center overflow-hidden box-border",
        sizeClasses.track,
        sizeClasses.pad,
        checked ? (disabled ? "justify-end bg-[#71717a] opacity-60" : "justify-end bg-[#7a5af8]") : (disabled ? "justify-start border border-[#e4e7ec] bg-[#fcfcfd]" : "justify-start border border-[#e4e7ec] bg-white")
      )}>
        <div className={cx(sizeClasses.knob, checked ? "bg-white" : disabled ? "bg-[#e4e4e7] opacity-50" : "bg-[#71717a] opacity-30")} />
      </div>
      {labelPosition === "right" && labelElement}
    </div>
  );
}
