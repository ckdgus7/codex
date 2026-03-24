import { useState, useRef, useEffect, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

interface SelectOption {
  label: string;
  value: string;
}

interface SelectBoxBaseProps {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchHighlight?: boolean;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
}

interface SingleSelectBoxProps extends SelectBoxBaseProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
  maxSelections?: never;
  selectAllLabel?: never;
}

interface MultiSelectBoxProps extends SelectBoxBaseProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
  selectAllLabel?: string;
}

type SelectBoxProps = SingleSelectBoxProps | MultiSelectBoxProps;

function ChevronDownIcon({ rotated }: { rotated?: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={cx("shrink-0 transition-transform duration-150 ease-in-out", rotated && "rotate-180")}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="#71717a"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClearIcon({ size = 24, color = "#71717a" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} opacity="0.15" />
      <path d="M9 9L15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 9L9 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChipCloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4 4L8 8" stroke="#52525b" strokeWidth="1" strokeLinecap="round" />
      <path d="M8 4L4 8" stroke="#52525b" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
        stroke="#71717a"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 16L12.1 12.1" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MiniCheckbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={cx(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded box-border",
        checked ? "bg-[#7a5af8]" : "border border-[#e4e7ec] bg-white"
      )}
    >
      {checked && (
        <svg width="12" height="9" viewBox="0 0 14 10" fill="none">
          <path d="M1 5L5 9L13 1" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function HighlightedLabel({ label, searchText }: { label: string; searchText: string }) {
  if (!searchText) {
    return <span>{label}</span>;
  }

  const lowerLabel = label.toLowerCase();
  const lowerSearch = searchText.toLowerCase();
  const idx = lowerLabel.indexOf(lowerSearch);

  if (idx === -1) {
    return <span>{label}</span>;
  }

  const before = label.slice(0, idx);
  const match = label.slice(idx, idx + searchText.length);
  const after = label.slice(idx + searchText.length);

  return (
    <span>
      {before}
      <span className="font-bold text-[#7a5af8]">{match}</span>
      {after}
    </span>
  );
}

export function SelectBox(props: SelectBoxProps) {
  const {
    options,
    placeholder = "Select",
    label,
    required = false,
    disabled = false,
    error = false,
    helperText,
    searchable = false,
    searchPlaceholder = "Search",
    searchHighlight = true,
    style,
    wrapperStyle,
    multiple = false,
  } = props;

  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const inlineSearchRef = useRef<HTMLInputElement>(null);

  const isMultiple = multiple === true;
  const maxSelections = isMultiple ? (props as MultiSelectBoxProps).maxSelections : undefined;
  const selectAllLabel = isMultiple ? (props as MultiSelectBoxProps).selectAllLabel : undefined;

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: globalThis.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchText("");
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  useEffect(() => {
    if (!open || !searchable) return;

    if (isMultiple) {
      inlineSearchRef.current?.focus();
    } else {
      searchInputRef.current?.focus();
    }
  }, [open, searchable, isMultiple]);

  const singleValue = isMultiple ? "" : (props as SingleSelectBoxProps).value;
  const multiValue = isMultiple ? (props as MultiSelectBoxProps).value : [];

  const selectedOption = isMultiple ? null : options.find((o) => o.value === singleValue);
  const selectedOptions = isMultiple ? options.filter((o) => multiValue.includes(o.value)) : [];

  const filteredOptions = searchText
    ? options.filter((o) => o.label.toLowerCase().includes(searchText.toLowerCase()))
    : options;

  const allFilteredSelected =
    isMultiple && filteredOptions.length > 0 && filteredOptions.every((o) => multiValue.includes(o.value));

  const hasChips = isMultiple && selectedOptions.length > 0;
  const hasClearable = isMultiple ? multiValue.length > 0 : !!singleValue;
  const shouldHighlight = searchable && searchHighlight && searchText.length > 0;

  const handleToggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
    if (open) {
      setSearchText("");
    }
  };

  const handleSingleSelect = (optionValue: string) => {
    if (isMultiple) return;
    (props as SingleSelectBoxProps).onChange(optionValue);
    setOpen(false);
    setSearchText("");
  };

  const handleMultiToggle = (optionValue: string) => {
    if (!isMultiple) return;

    const current = (props as MultiSelectBoxProps).value;
    const onChange = (props as MultiSelectBoxProps).onChange;

    if (current.includes(optionValue)) {
      onChange(current.filter((v) => v !== optionValue));
      return;
    }

    if (maxSelections !== undefined && current.length >= maxSelections) {
      return;
    }

    onChange([...current, optionValue]);
  };

  const handleSelectAll = () => {
    if (!isMultiple) return;

    const onChange = (props as MultiSelectBoxProps).onChange;

    if (allFilteredSelected) {
      const filteredValues = filteredOptions.map((o) => o.value);
      onChange(multiValue.filter((v) => !filteredValues.includes(v)));
      return;
    }

    const newValues = [...multiValue];
    for (const option of filteredOptions) {
      if (!newValues.includes(option.value)) {
        if (maxSelections !== undefined && newValues.length >= maxSelections) {
          break;
        }
        newValues.push(option.value);
      }
    }
    onChange(newValues);
  };

  const handleChipRemove = (optionValue: string) => {
    if (!isMultiple) return;
    const onChange = (props as MultiSelectBoxProps).onChange;
    onChange(multiValue.filter((v) => v !== optionValue));
  };

  const handleClearAll = (e: ReactMouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (isMultiple) {
      (props as MultiSelectBoxProps).onChange([]);
    } else {
      (props as SingleSelectBoxProps).onChange("");
    }
    setSearchText("");
  };

  const isOptionSelected = (optionValue: string) => {
    if (isMultiple) {
      return multiValue.includes(optionValue);
    }
    return singleValue === optionValue;
  };

  return (
    <div className="flex w-full flex-col items-start gap-2" style={wrapperStyle} ref={containerRef}>
      {label && (
        <div className="flex items-center">
          <div className="flex items-center justify-center gap-1">
            <span className="whitespace-nowrap font-sans text-sm font-medium leading-[18px] text-[#52525b]">{label}</span>
            {required && <span className="h-1.5 w-1.5 shrink-0 rounded-[3px] bg-[#36bffa]" />}
          </div>
        </div>
      )}
      <div
        className={cx(
          "relative flex w-full items-center gap-2 rounded border bg-white p-2 box-border transition-colors duration-150 ease-in-out select-none",
          hasChips && "flex-wrap",
          disabled ? "cursor-not-allowed bg-[#fafafa] opacity-60" : "cursor-pointer",
          error ? "border-[#f04438]" : open ? "border-[#7a5af8]" : "border-[#e4e7ec]"
        )}
        style={style}
        onClick={handleToggle}
      >
        {hasChips ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 pl-1">
            {selectedOptions.map((opt) => (
              <div key={opt.value} className="flex max-w-[130px] shrink-0 items-center justify-center gap-1 rounded-md bg-[#fafaff] px-1.5 py-[3px]">
                <span className="max-w-[103px] overflow-hidden text-ellipsis whitespace-nowrap font-sans text-xs font-medium leading-3 text-[#52525b]">
                  {opt.label}
                </span>
                <span
                  className="flex h-3 w-3 shrink-0 items-center justify-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChipRemove(opt.value);
                  }}
                >
                  <ChipCloseIcon />
                </span>
              </div>
            ))}
            {searchable && open && (
              <input
                ref={inlineSearchRef}
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder={searchPlaceholder}
                className="min-w-10 w-[60px] shrink border-none bg-transparent p-0 font-sans text-base font-normal leading-6 text-[#3f3f46] outline-none placeholder:text-[#a1a1aa]"
              />
            )}
          </div>
        ) : searchable && isMultiple && open ? (
          <div className="flex min-h-0 min-w-0 flex-1 items-center px-2">
            <input
              ref={inlineSearchRef}
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder={searchPlaceholder}
              className="w-full flex-1 border-none bg-transparent p-0 font-sans text-base font-normal leading-6 text-[#3f3f46] outline-none placeholder:text-[#a1a1aa]"
            />
          </div>
        ) : (
          <div className="flex min-h-0 min-w-0 flex-1 items-center px-2">
            <span
              className={cx(
                "overflow-hidden text-ellipsis whitespace-nowrap font-sans text-base font-normal leading-6",
                selectedOption ? "text-[#18181b]" : "text-[#a1a1aa]"
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
        )}
        {hasClearable && !disabled && (
          <span className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center overflow-hidden" onClick={handleClearAll}>
            <ClearIcon />
          </span>
        )}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden">
          <ChevronDownIcon rotated={open} />
        </span>
        {open && (
          <div
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-[1000] max-h-[296px] overflow-y-auto rounded border border-[#e4e7ec] bg-white py-2 shadow-[0px_16px_32px_rgba(23,37,76,0.12)] box-border"
            onClick={(e) => e.stopPropagation()}
          >
            {searchable && !isMultiple && (
              <div className="flex items-center gap-2 border-b border-[#e4e7ec] px-3 py-2">
                <SearchIcon />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="flex-1 border-none bg-transparent p-0 font-sans text-sm font-normal leading-5 text-[#18181b] outline-none placeholder:text-[#a1a1aa]"
                />
              </div>
            )}
            {isMultiple && selectAllLabel && filteredOptions.length > 0 && (
              <div
                className={cx(
                  "flex h-10 cursor-pointer items-center gap-2.5 border-b border-[#e4e7ec] px-4 py-2 font-sans text-base leading-6 text-[#3f3f46]",
                  allFilteredSelected ? "bg-[#ede9fe] font-medium" : "font-medium hover:bg-[#f4f4f5]"
                )}
                onClick={handleSelectAll}
              >
                <MiniCheckbox checked={allFilteredSelected} />
                <span>{selectAllLabel}</span>
              </div>
            )}
            {filteredOptions.length === 0 ? (
              <div className="flex h-10 cursor-default items-center gap-2.5 px-4 py-2 font-sans text-base font-normal leading-6 text-[#a1a1aa]">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const selected = isOptionSelected(option.value);
                const atLimit = !selected && isMultiple && maxSelections !== undefined && multiValue.length >= maxSelections;

                return (
                  <div
                    key={option.value}
                    className={cx(
                      "flex h-10 items-center gap-2.5 px-4 py-2 font-sans text-base font-normal leading-6 text-[#3f3f46]",
                      selected ? "bg-[#ede9fe] font-medium" : !atLimit && "hover:bg-[#f4f4f5]",
                      atLimit ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (atLimit) return;
                      if (isMultiple) {
                        handleMultiToggle(option.value);
                      } else {
                        handleSingleSelect(option.value);
                      }
                    }}
                  >
                    {isMultiple && <MiniCheckbox checked={selected} />}
                    <span className="overflow-hidden text-ellipsis">
                      {shouldHighlight ? <HighlightedLabel label={option.label} searchText={searchText} /> : option.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      {helperText && (
        <span className={cx("pl-1 font-sans text-xs font-normal leading-[18px]", error ? "text-[#f04438]" : "text-[#a1a1aa]")}>
          {helperText}
        </span>
      )}
    </div>
  );
}
