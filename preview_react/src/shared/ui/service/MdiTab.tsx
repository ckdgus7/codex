import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useMdiStore } from "@/shared/model/mdi.store";
import type { MdiTabItem } from "@/shared/model/mdi.store";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function CloseIcon({ color = "#a1a1aa" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 4L6 8L10 12" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4L10 8L6 12" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface MdiTabProps {
  className?: string;
}

export function MdiTab({ className }: MdiTabProps) {
  const tabs = useMdiStore((s) => s.tabs);
  const activeTabId = useMdiStore((s) => s.activeTabId);
  const setActiveTab = useMdiStore((s) => s.setActiveTab);
  const removeTab = useMdiStore((s) => s.removeTab);
  const navigate = useNavigate();
  const tabListRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = tabListRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
  }, [tabs, checkScroll]);

  const scrollTabs = (dir: "left" | "right") => {
    const el = tabListRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
    setTimeout(checkScroll, 300);
  };

  const handleTabClick = (tab: MdiTabItem) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  const handleClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const wasActive = activeTabId === tabId;
    removeTab(tabId);
    if (wasActive) {
      const state = useMdiStore.getState();
      if (state.activeTabId) {
        const nextTab = state.tabs.find((t) => t.id === state.activeTabId);
        if (nextTab) {
          navigate(nextTab.path);
        }
      }
    }
  };

  if (tabs.length === 0) {
    return (
      <div className={cx("flex h-9 min-w-0 flex-1 items-center bg-[#fafafa] font-sans box-border", className)}>
        <div className="h-full pl-4 text-xs text-[#a1a1aa]">?¥Î¶∞ ??ù¥ ?ÜÏäµ?àÎã§.</div>
      </div>
    );
  }

  return (
    <div className={cx("flex h-9 min-w-0 flex-1 items-center bg-[#fafafa] font-sans box-border", className)}>
      <div className="flex min-w-0 flex-1 items-center overflow-hidden">
        <div ref={tabListRef} className="flex items-start overflow-hidden" onScroll={checkScroll}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                className={cx(
                  "flex h-9 max-w-[240px] shrink-0 cursor-pointer items-center gap-2 bg-white px-4 py-2 box-border",
                  "border-r border-[#e4e4e7]",
                  isActive ? "border-b-2 border-b-[#18181b]" : "border-b border-b-[#e4e4e7]"
                )}
                onClick={() => handleTabClick(tab)}
              >
                <span
                  className={cx(
                    "max-w-[156px] overflow-hidden text-ellipsis whitespace-nowrap font-sans text-sm font-normal leading-5",
                    isActive ? "text-[#18181b]" : "text-[#a1a1aa]"
                  )}
                >
                  {tab.label}
                </span>
                <button
                  className="flex h-4 w-4 shrink-0 items-center justify-center border-none bg-transparent p-0"
                  onClick={(e) => handleClose(e, tab.id)}
                  title="?´Í∏∞"
                >
                  <CloseIcon color={isActive ? "#71717a" : "#a1a1aa"} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {(canScrollLeft || canScrollRight) && (
        <div className="ml-auto flex shrink-0 items-center gap-0">
          <div className="mx-1 h-5 w-px bg-[#e4e4e7]" />
          <button
            className={cx(
              "flex h-7 w-7 items-center justify-center rounded border-none bg-transparent p-0",
              canScrollLeft ? "opacity-100" : "opacity-30"
            )}
            onClick={() => scrollTabs("left")}
            disabled={!canScrollLeft}
            title="?¥Ï†Ñ"
          >
            <ChevronLeftIcon />
          </button>
          <button
            className={cx(
              "flex h-7 w-7 items-center justify-center rounded border-none bg-transparent p-0",
              canScrollRight ? "opacity-100" : "opacity-30"
            )}
            onClick={() => scrollTabs("right")}
            disabled={!canScrollRight}
            title="?§Ïùå"
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  );
}
