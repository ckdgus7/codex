import type { CSSProperties, ReactNode, ButtonHTMLAttributes, HTMLAttributes } from "react";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

type ButtonSize = "l" | "m" | "s";
type ButtonVariant = "filled" | "outlined" | "text";
type ButtonColor = "positive" | "negative" | "warning" | "success" | "info";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "className"> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  wrapperStyle?: HTMLAttributes<HTMLDivElement>["style"];
}

const SIZE_CLASSES: Record<ButtonSize, { button: string; icon: string; text: string }> = {
  l: {
    button: "h-10 p-2",
    icon: "h-6 w-6",
    text: "px-1.5 text-base font-bold leading-6",
  },
  m: {
    button: "h-8 p-1.5",
    icon: "h-5 w-5",
    text: "px-1.5 text-sm font-medium leading-5",
  },
  s: {
    button: "h-6 p-1",
    icon: "h-[18px] w-[18px]",
    text: "px-1.5 text-xs font-normal leading-[18px]",
  },
};

const VARIANT_CLASSES: Record<ButtonVariant, Record<ButtonColor, string>> = {
  filled: {
    positive: "bg-[#7a5af8] text-white",
    negative: "bg-[#f04438] text-white",
    warning: "bg-[#f79009] text-white",
    success: "bg-[#1ac057] text-white",
    info: "bg-[#71717a] text-white",
  },
  outlined: {
    positive: "border border-[#7a5af8] bg-white text-[#7a5af8]",
    negative: "border border-[#f04438] bg-white text-[#f04438]",
    warning: "border border-[#f79009] bg-white text-[#f79009]",
    success: "border border-[#1ac057] bg-white text-[#1ac057]",
    info: "border border-[#71717a] bg-white text-[#71717a]",
  },
  text: {
    positive: "bg-transparent text-[#7a5af8]",
    negative: "bg-transparent text-[#f04438]",
    warning: "bg-transparent text-[#f79009]",
    success: "bg-transparent text-[#1ac057]",
    info: "bg-transparent text-[#71717a]",
  },
};

export function Button({
  size = "l",
  variant = "filled",
  color = "positive",
  leadingIcon,
  trailingIcon,
  children,
  disabled = false,
  style,
  className,
  wrapperStyle,
  ...rest
}: ButtonProps) {
  const sizeClasses = SIZE_CLASSES[size];

  return (
    <div className={className} style={wrapperStyle}>
      <button
        disabled={disabled}
        style={style}
        className={cx(
          "inline-flex items-center justify-center rounded border-0 font-sans box-border outline-none transition-opacity duration-150 ease-in-out",
          "disabled:cursor-not-allowed disabled:opacity-40",
          sizeClasses.button,
          VARIANT_CLASSES[variant][color]
        )}
        {...rest}
      >
        {leadingIcon && (
          <span className={cx("flex shrink-0 items-center justify-center overflow-hidden", sizeClasses.icon)}>
            {leadingIcon}
          </span>
        )}
        {children != null && <span className={cx("text-center whitespace-nowrap", sizeClasses.text)}>{children}</span>}
        {trailingIcon && (
          <span className={cx("flex shrink-0 items-center justify-center overflow-hidden", sizeClasses.icon)}>
            {trailingIcon}
          </span>
        )}
      </button>
    </div>
  );
}
