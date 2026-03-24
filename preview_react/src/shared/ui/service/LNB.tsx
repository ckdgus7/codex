import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useFavoritesStore } from "@/shared/model/favorites.store";
import { useMenuStore } from "@/shared/model/menu.store";
import type { LnbItem } from "@/shared/model/menu.store";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 44;
const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

const GNB_ICONS: Record<string, string> = {
  "요구관리": "R",
  "UI 관리": "U",
  "기능관리": "F",
  "게시판": "N",
  "SSF관리": "S",
  "SBF 관리": "B",
  "워크스페이스": "W",
  "업무 기준 정보 관리": "I",
};

const LNB_ICONS: Record<string, string> = {
  "요구사항": "R",
  "요구사항 명세 작성": "S",
  "요구사항 검토자 배정": "A",
  "요구사항 검토": "V",
  "요구상세": "D",
  "요구상세 승인": "P",
  "요구사항 반려 검토": "X",
  "업무 Flow 설계": "F",
  "애플리케이션 설계": "A",
  "SB기획": "S",
  "UI디자인": "U",
  "퍼블리싱": "P",
  "기능설계": "F",
  "상세기능 설계": "D",
  "공지사항": "N",
  "Q&A": "Q",
  "도메인(L1)정보 관리": "D",
  "컴포넌트(L2)정보 관리": "C",
  "업무(L3)정보 관리": "B",
  "기능(L4)정보 관리": "F",
  "SSF탐색기": "S",
  "Lifecycle(D1) 관리": "L",
  "업무영역(D2) 관리": "A",
  "업무Flow(D3) 관리": "F",
  "SBF 탐색기": "S",
  "사용자관리": "U",
  "서비스 이용약관 관리": "T",
  "개인정보 처리방침 관리": "P",
  "업무Flow 관리": "F",
  "화면 기준 정보 관리": "V",
  "개발 진척 관리": "G",
  "과제 관리": "P",
};

function HeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-50">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke="#3f3f46"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

function CollapseSidebarIcon({ direction = "left" }: { direction?: "left" | "right" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {direction === "left" ? (
        <>
          <path d="M15 6L9 12L15 18" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="4" y1="4" x2="4" y2="20" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M9 6L15 12L9 18" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="20" y1="4" x2="20" y2="20" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

interface LNBProps {
  activeItem?: string;
  activeGnb?: string;
  onItemClick?: (item: string) => void;
}

export function LNB({ activeItem = "Q&A", activeGnb = "게시판", onItemClick }: LNBProps) {
  const navigate = useNavigate();
  const fetchMenu = useMenuStore((st) => st.fetchMenu);
  const menuItems = useMenuStore((st) => st.menuItems);
  const favorites = useFavoritesStore((st) => st.favorites);
  const removeFavorite = useFavoritesStore((st) => st.removeFavorite);

  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => {
    if (activeGnb) {
      setExpandedSections((prev) => ({ ...prev, [activeGnb]: true }));
    }
  }, [activeGnb]);

  const toggleSection = useCallback((gnbName: string) => {
    setExpandedSections((prev) => ({ ...prev, [gnbName]: !prev[gnbName] }));
  }, []);

  const handleItemClick = useCallback((menuItem: LnbItem) => {
    navigate(menuItem.path);
    onItemClick?.(menuItem.name);
  }, [navigate, onItemClick]);

  const handleFavoriteClick = useCallback((name: string) => {
    for (const gnb of menuItems) {
      const found = gnb.lnb.find((item) => item.name === name);
      if (found) {
        navigate(found.path);
        onItemClick?.(found.name);
        return;
      }
    }
  }, [menuItems, navigate, onItemClick]);

  if (collapsed) {
    return (
      <aside style={{ width: SIDEBAR_COLLAPSED_WIDTH, minWidth: SIDEBAR_COLLAPSED_WIDTH }} className="relative flex h-full flex-col overflow-hidden border-r border-[#e4e4e7] bg-white font-sans box-border transition-[width,min-width] duration-200 ease-in-out">
        <div className="flex shrink-0 flex-col items-center justify-center px-[10px] py-4">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#18181b]">
            <span className="text-[11px] font-bold leading-none text-white">N</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {menuItems.map((gnb) => (
            <div key={gnb.id} className="flex flex-col gap-0.5 border-t border-[#e4e4e7] px-0 py-2">
              <div
                className="flex cursor-pointer select-none items-center justify-center px-0 py-3"
                onClick={() => {
                  setCollapsed(false);
                  setExpandedSections((prev) => ({ ...prev, [gnb.gnbName]: true }));
                }}
                title={gnb.gnbName}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-base font-semibold opacity-50">{GNB_ICONS[gnb.gnbName] || "M"}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-center justify-center p-4">
          <button className="flex h-6 w-6 items-center justify-center rounded border-none bg-transparent p-0" onClick={() => setCollapsed(false)} title="사이드바 펼치기">
            <CollapseSidebarIcon direction="right" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH }} className="relative flex h-full flex-col border-r border-[#e4e4e7] bg-white font-sans box-border transition-[width,min-width] duration-200 ease-in-out">
      <div className="flex shrink-0 flex-col items-center justify-center p-4">
        <div className="flex items-start gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#18181b]">
            <span className="text-[11px] font-bold leading-none text-white">N</span>
          </div>
          <div className="flex w-[164px] flex-col gap-1 text-[#71717a]">
            <span className="text-base font-semibold leading-5">NOVA</span>
            <span className="text-[28px] font-black leading-8">AI DevOps</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {menuItems.map((gnb) => {
          const isExpanded = !!expandedSections[gnb.gnbName];
          const isGnbActive = gnb.gnbName === activeGnb;
          return (
            <div key={gnb.id} className="flex flex-col gap-0.5 border-t border-[#e4e4e7] px-0.5 py-2">
              <div className="flex cursor-pointer select-none items-center gap-2 px-2 py-3" onClick={() => toggleSection(gnb.gnbName)}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-base font-semibold opacity-50">{GNB_ICONS[gnb.gnbName] || "M"}</span>
                <span className={cx("flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-5", isGnbActive ? "font-bold text-[#18181b]" : "font-normal text-[#3f3f46]")}>{gnb.gnbName}</span>
              </div>
              {isExpanded && (
                <div className="flex flex-col gap-px">
                  {gnb.lnb.map((item) => {
                    const isActive = item.name === activeItem;
                    return (
                      <div key={item.path} className={cx("flex cursor-pointer items-center gap-1.5 rounded px-2 py-2 pl-[14px]", isActive && "bg-[#f4f4f5]")} onClick={() => handleItemClick(item)}>
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[13px] font-semibold opacity-50">{LNB_ICONS[item.name] || "-"}</span>
                        <span className={cx("flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-[18px]", isActive ? "font-semibold text-[#18181b]" : "font-normal text-[#3f3f46]")}>{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex shrink-0 flex-col gap-2 border-t border-[#e4e4e7] px-4 py-6">
        <div className="flex items-center gap-1">
          <HeartIcon />
          <span className="text-xs font-bold leading-[18px] text-[#3f3f46]">즐겨찾기</span>
        </div>
        {favorites.length === 0 ? (
          <div className="rounded bg-[#fafafa] p-4 text-center text-xs font-normal leading-[18px] text-[#71717a]">
            즐겨찾기에<br />등록된 화면이 없습니다.
          </div>
        ) : (
          <div className="flex flex-wrap">
            {favorites.map((item) => (
              <div key={item} className="mb-1 mr-1 inline-flex cursor-pointer items-center gap-1 rounded bg-[#f4f4f5] px-2.5 py-1 text-xs text-[#3f3f46]" onClick={() => handleFavoriteClick(item)}>
                <span>{item}</span>
                <span
                  className="cursor-pointer text-[10px] leading-none text-[#a1a1aa]"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(item);
                  }}
                >
                  ×
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-end p-4">
        <button className="flex h-6 w-6 items-center justify-center rounded border-none bg-transparent p-0" onClick={() => setCollapsed(true)} title="사이드바 접기">
          <CollapseSidebarIcon direction="left" />
        </button>
      </div>
    </aside>
  );
}
