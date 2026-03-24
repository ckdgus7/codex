import type { ReactNode } from "react";
import { useFavoritesStore } from "@/shared/model/favorites.store";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function BackArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="overflow-hidden">
      <path
        d="M14.5 7.43L9.93 12l4.57 4.57"
        stroke="#18181b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FavIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 overflow-hidden">
      <path
        d="M9 11.1L6.37 12.57l.5-2.93L4.8 7.65l2.94-.43L9 4.49l1.26 2.73 2.94.43-2.07 2-0.01-.01.5 2.93L9 11.1z"
        stroke={filled ? "#EAAA08" : "#18181b"}
        strokeWidth="1"
        strokeLinejoin="round"
        fill={filled ? "#EAAA08" : "none"}
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 overflow-hidden">
      <path
        d="M4 12a8 8 0 0114.93-4M20 12a8 8 0 01-14.93 4"
        stroke="#18181b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 4v4h-4M4 20v-4h4"
        stroke="#18181b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface PageTitleProps {
  title: string;
  favoriteKey?: string;
  badge?: string;
  idBadge?: string;
  actions?: ReactNode;
  onBack?: () => void;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

export function PageTitle({
  title,
  favoriteKey,
  badge,
  idBadge,
  actions,
  onBack,
  showRefresh,
  onRefresh,
}: PageTitleProps) {
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const starred = favoriteKey ? isFavorite(favoriteKey) : false;

  return (
    <div className="flex w-full shrink-0 flex-wrap items-center content-center gap-4">
      {onBack && (
        <div className="flex shrink-0 items-center">
          <button
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#18181b] bg-white p-[3px] box-border"
            onClick={onBack}
            title="뒤로 가기"
          >
            <BackArrowIcon />
          </button>
        </div>
      )}

      <div className="flex min-h-px min-w-[360px] flex-1 flex-wrap items-center content-center gap-x-4 gap-y-2">
        {idBadge && (
          <div className="flex shrink-0 items-center">
            <span className="flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-[#36bffa] bg-white px-3 py-1 font-sans text-sm font-medium leading-4 text-[#36bffa]">
              {idBadge}
            </span>
          </div>
        )}
        <span className="shrink-0 whitespace-nowrap font-sans text-[32px] font-bold leading-10 text-[#18181b]">{title}</span>
        {badge && (
          <div className="flex shrink-0 items-center">
            <span className="flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-[#7a5af8] bg-[#fafaff] px-3 py-1 font-sans text-sm font-medium leading-4 text-[#7a5af8]">
              {badge}
            </span>
          </div>
        )}
        {(favoriteKey || showRefresh) && (
          <div className="flex shrink-0 items-center gap-2">
            {favoriteKey && (
              <button
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#18181b] bg-white p-[3px] box-border"
                onClick={() => toggleFavorite(favoriteKey)}
                title={starred ? "즐겨찾기 해제" : "즐겨찾기 추가"}
              >
                <FavIcon filled={starred} />
              </button>
            )}
            {showRefresh && (
              <button
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#18181b] bg-white p-[3px] box-border"
                onClick={onRefresh}
                title="새로고침"
              >
                <RefreshIcon />
              </button>
            )}
          </div>
        )}
      </div>

      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
