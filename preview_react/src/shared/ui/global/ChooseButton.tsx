import { type CSSProperties } from "react";

interface ChooseButtonOption {
  label: string;
  value: string;
}

interface ChooseButtonProps {
  value: string;
  onChange: (value: string) => void;
  options: ChooseButtonOption[];
  style?: CSSProperties;
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

export function ChooseButton({ value, onChange, options, style }: ChooseButtonProps) {
  const handleKeyDown = (e: React.KeyboardEvent, optionValue: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(optionValue);
    }
  };

  return (
    <div className="flex items-center overflow-hidden rounded-md" style={style} role="radiogroup">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={cx(
              "flex shrink-0 items-center justify-center border-none px-3 py-2 outline-none",
              isActive ? "bg-[#7a5af8]" : "bg-[#bdb4fe]"
            )}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, option.value)}
          >
            <span className="whitespace-nowrap font-sans text-base font-normal leading-6 text-[#fafaff]">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
