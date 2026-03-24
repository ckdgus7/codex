import { useState, type CSSProperties, type TextareaHTMLAttributes, type ChangeEvent } from "react";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "style"> {
  label?: string;
  required?: boolean;
  indicator?: boolean;
  maxLength?: number;
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
}

export function Textarea({
  label,
  required,
  indicator = true,
  maxLength = 300,
  error,
  helperText,
  readOnly,
  disabled,
  style,
  wrapperStyle,
  value,
  defaultValue,
  onChange,
  ...rest
}: TextareaProps) {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState((defaultValue as string) ?? "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value ?? "") : internalValue;
  const charCount = currentValue.length;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  return (
    <div className="flex flex-col gap-1" style={wrapperStyle}>
      {(label || required) && (
        <div className="flex items-center gap-1">
          {label && <span className="font-sans text-sm font-medium leading-[18px] text-[#a1a1aa]">{label}</span>}
          {required && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#36bffa]" />}
        </div>
      )}
      <div
        className={cx(
          "flex min-h-[120px] flex-col items-start justify-between rounded border bg-white p-2 box-border",
          error ? "border-[#ee46bc]" : focused && !disabled && !readOnly ? "border-[#7a5af8]" : "border-[#e4e7ec]",
          readOnly && "bg-[#fafafa]",
          disabled && "bg-[#f4f4f5]"
        )}
        style={style}
      >
        <textarea
          {...rest}
          value={currentValue}
          readOnly={readOnly}
          disabled={disabled}
          maxLength={maxLength}
          onChange={handleChange}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          className="min-h-[96px] w-full flex-1 resize-none border-none bg-transparent p-0 font-sans text-base font-normal leading-6 text-[#3f3f46] outline-none box-border placeholder:text-[#a1a1aa]"
        />
        {indicator && (
          <div className="flex w-full shrink-0 items-center justify-end">
            <span className="font-sans text-xs font-normal leading-[18px] text-[#a1a1aa]">
              {charCount}/{maxLength}
            </span>
          </div>
        )}
      </div>
      {helperText && (
        <span className={cx("font-sans text-xs font-normal leading-[18px]", error ? "text-[#ee46bc]" : "text-[#a1a1aa]")}>
          {helperText}
        </span>
      )}
    </div>
  );
}
