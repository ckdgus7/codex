import { useState } from "react";

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2.667 8L8 3.333L13.333 8"
        stroke="#a1a1aa"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 7v4.667a.667.667 0 00.667.667h2V10h2.666v2.334h2A.667.667 0 0012 11.667V7"
        stroke="#a1a1aa"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DividerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 4L10 8L6 12"
        stroke="#d4d4d8"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav className="flex h-4 items-center gap-0">
      <div className="flex h-4 w-4 items-center justify-center">
        <HomeIcon />
      </div>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const isHovered = hoveredIndex === i;

        return (
          <span key={i} className="flex items-center">
            <div className="flex h-4 w-4 items-center justify-center">
              <DividerIcon />
            </div>
            <span
              className={[
                "font-sans text-xs leading-4 whitespace-nowrap",
                isLast ? "cursor-pointer font-medium text-[#3f3f46]" : "cursor-default font-normal text-[#a1a1aa]",
                isLast && isHovered ? "underline" : "no-underline",
              ].join(" ")}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={isLast && item.onClick ? item.onClick : undefined}
            >
              {item.label}
            </span>
          </span>
        );
      })}
    </nav>
  );
}
