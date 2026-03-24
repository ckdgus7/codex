import type { CSSProperties } from "react";

type RadioSize = "l" | "m" | "s";

interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  size?: RadioSize;
  disabled?: boolean;
  direction?: "horizontal" | "vertical";
  gap?: number;
  name?: string;
  style?: CSSProperties;
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

const SIZE_CLASSES: Record<RadioSize, { circle: string; dot: string; label: string; gap: string }> = {
  l: { circle: "h-6 w-6 rounded-full", dot: "h-2 w-2 rounded", label: "text-base leading-6", gap: "gap-2" },
  m: { circle: "h-5 w-5 rounded-full", dot: "h-2 w-2 rounded", label: "text-sm leading-5", gap: "gap-2" },
  s: { circle: "h-[18px] w-[18px] rounded-full", dot: "h-1.5 w-1.5 rounded-[3px]", label: "text-xs leading-[18px]", gap: "gap-2" },
};

function RadioItem({ option, selected, size, globalDisabled, onChange }: { option: RadioOption; selected: boolean; size: RadioSize; globalDisabled: boolean; onChange: (value: string) => void }) {
  const isDisabled = globalDisabled || option.disabled;
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <div className={cx("flex select-none items-center justify-center rounded", sizeClasses.gap, isDisabled ? "cursor-not-allowed" : "cursor-pointer")} onClick={() => !isDisabled && onChange(option.value)}>
      <div className={cx(
        "relative flex shrink-0 items-center justify-center overflow-hidden box-border",
        sizeClasses.circle,
        selected ? (isDisabled ? "bg-[#71717a] opacity-60" : "bg-[#7a5af8]") : (isDisabled ? "border border-[#e4e7ec] bg-white opacity-60" : "border border-[#e4e7ec] bg-white")
      )}>
        <div className={cx("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", sizeClasses.dot, selected ? "bg-white opacity-100" : "bg-[#71717a] opacity-30")} />
      </div>
      <span className={cx("whitespace-nowrap font-sans font-normal text-[#3f3f46]", sizeClasses.label)}>{option.label}</span>
    </div>
  );
}

export function RadioGroup({ value, onChange, options, size = "m", disabled = false, direction = "horizontal", gap = 16, style }: RadioGroupProps) {
  return (
    <div className={cx("flex", direction === "horizontal" ? "flex-row items-center" : "flex-col items-start")} style={{ gap, ...style }}>
      {options.map((option) => (
        <RadioItem key={option.value} option={option} selected={value === option.value} size={size} globalDisabled={disabled} onChange={onChange} />
      ))}
    </div>
  );
}
