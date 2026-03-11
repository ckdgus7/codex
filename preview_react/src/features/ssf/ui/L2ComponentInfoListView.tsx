import { useEffect, type CSSProperties } from "react";
import { Breadcrumb } from "@/shared/ui/Breadcrumb";
import { Button } from "@/shared/ui/Button";
import { ChooseButton } from "@/shared/ui/ChooseButton";
import { Input } from "@/shared/ui/Input";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageTitle } from "@/shared/ui/PageTitle";
import { SelectBox } from "@/shared/ui/SelectBox";
import { useMdiStore } from "@/shared/model/mdi.store";
import type {
  L2ComponentInfoItem,
  L2ComponentSearchScope,
  L2ComponentSortDir,
  L2ComponentSortKey,
  L2ComponentStatus,
} from "@/features/ssf/model/l2-component-info.types";

const FONT = "'Pretendard', sans-serif";

function SortIcon({ active, dir }: { active: boolean; dir: L2ComponentSortDir }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M6 7L9 4L12 7"
        stroke={active && dir === "asc" ? "#7a5af8" : "#a1a1aa"}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 11L9 14L12 11"
        stroke={active && dir === "desc" ? "#7a5af8" : "#a1a1aa"}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon({ disabled }: { disabled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: disabled ? 0.4 : 1 }}>
      <path d="M12 5L7 10L12 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ disabled }: { disabled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: disabled ? 0.4 : 1 }}>
      <path d="M8 5L13 10L8 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDoubleLeftIcon({ disabled }: { disabled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: disabled ? 0.4 : 1 }}>
      <path d="M11 5L6 10L11 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 5L10 10L15 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDoubleRightIcon({ disabled }: { disabled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: disabled ? 0.4 : 1 }}>
      <path d="M5 5L10 10L5 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 5L14 10L9 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const s = {
  outer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "100%",
    fontFamily: FONT,
  } satisfies CSSProperties,
  main: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 32,
    flex: 1,
  } satisfies CSSProperties,
  filterWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "16px 24px",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  } satisfies CSSProperties,
  filterLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 420,
  } satisfies CSSProperties,
  domainSelect: {
    width: 180,
  } satisfies CSSProperties,
  filterRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end",
  } satisfies CSSProperties,
  searchScopeSelect: {
    width: 160,
  } satisfies CSSProperties,
  searchInput: {
    width: 320,
  } satisfies CSSProperties,
  listWrap: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  } satisfies CSSProperties,
  tableFunction: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  } satisfies CSSProperties,
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 12px",
    borderRadius: 12,
    border: "1px solid #d4d4d8",
    backgroundColor: "#fafafa",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "16px",
    color: "#52525b",
    whiteSpace: "nowrap",
  } satisfies CSSProperties,
  listAction: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    paddingBottom: 8,
  } satisfies CSSProperties,
  paginationLabel: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "18px",
    color: "#a1a1aa",
    whiteSpace: "nowrap",
  } satisfies CSSProperties,
  itemsSelect: {
    height: 40,
    padding: "3px 4px",
    border: "1px solid #e4e7ec",
    borderRadius: 4,
    backgroundColor: "white",
    fontSize: 14,
    lineHeight: "20px",
    color: "#3f3f46",
    cursor: "pointer",
    boxSizing: "border-box",
    outline: "none",
  } satisfies CSSProperties,
  indicator: {
    fontSize: 14,
    lineHeight: "20px",
    color: "#71717a",
    textAlign: "center",
    whiteSpace: "nowrap",
  } satisfies CSSProperties,
  paginationWrap: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  } satisfies CSSProperties,
  pageBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 0,
    borderRadius: 4,
  } satisfies CSSProperties,
  pageBtnActive: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "20px",
    color: "#111827",
    padding: "0 6px",
    opacity: 1,
  } satisfies CSSProperties,
  pageBtnInactive: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "20px",
    color: "#71717a",
    padding: "0 6px",
    opacity: 0.4,
  } satisfies CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #e4e4e7",
    borderRadius: 4,
    overflow: "hidden",
    tableLayout: "fixed",
    backgroundColor: "#ffffff",
  } satisfies CSSProperties,
  th: {
    backgroundColor: "#f4f4f5",
    border: "1px solid #e4e4e7",
    padding: 8,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "20px",
    color: "#000000",
    textAlign: "center",
    whiteSpace: "nowrap",
    minHeight: 36,
    boxSizing: "border-box",
    cursor: "pointer",
  } satisfies CSSProperties,
  thInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    width: "100%",
  } satisfies CSSProperties,
  td: {
    backgroundColor: "white",
    border: "1px solid #e4e4e7",
    padding: 8,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "20px",
    color: "#000000",
    textAlign: "center",
    minHeight: 40,
    boxSizing: "border-box",
    verticalAlign: "middle",
  } satisfies CSSProperties,
  tdLeft: {
    textAlign: "left",
  } satisfies CSSProperties,
  useBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 12px",
    borderRadius: 12,
    border: "1px solid #7a5af8",
    backgroundColor: "#fafaff",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "16px",
    color: "#7a5af8",
    whiteSpace: "nowrap",
  } satisfies CSSProperties,
  unuseBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 12px",
    borderRadius: 12,
    border: "1px solid #a1a1aa",
    backgroundColor: "#fafafa",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "16px",
    color: "#a1a1aa",
    whiteSpace: "nowrap",
  } satisfies CSSProperties,
} as const;

const COLUMNS: { key: L2ComponentSortKey; label: string; width: number | string; align?: "left" | "center" }[] = [
  { key: "no", label: "No", width: 80 },
  { key: "componentId", label: "컴포넌트 ID", width: 120 },
  { key: "nameKo", label: "컴포넌트(한글)", width: 140 },
  { key: "nameEn", label: "컴포넌트(영문)", width: 180 },
  { key: "description", label: "컴포넌트 설명", width: "auto", align: "left" },
  { key: "domainName", label: "도메인(한글)", width: 140 },
  { key: "plannerLeader", label: "L2기획리더", width: 120 },
  { key: "designLeader", label: "L2설계리더", width: 120 },
  { key: "useYn", label: "사용여부", width: 120 },
];

interface L2ComponentInfoListViewProps {
  items: L2ComponentInfoItem[];
  totalCount: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
  statusFilter: L2ComponentStatus;
  domainFilter: string;
  searchScope: L2ComponentSearchScope;
  keyword: string;
  sortKey: L2ComponentSortKey | null;
  sortDir: L2ComponentSortDir;
  loading: boolean;
  error: boolean;
  domainOptions: string[];
  onStatusChange: (value: L2ComponentStatus) => void;
  onDomainChange: (value: string) => void;
  onSearchScopeChange: (value: L2ComponentSearchScope) => void;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onSort: (key: L2ComponentSortKey) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

export function L2ComponentInfoListView({
  items,
  totalCount,
  page,
  totalPages,
  itemsPerPage,
  statusFilter,
  domainFilter,
  searchScope,
  keyword,
  sortKey,
  sortDir,
  loading,
  error,
  domainOptions,
  onStatusChange,
  onDomainChange,
  onSearchScopeChange,
  onKeywordChange,
  onSearch,
  onSort,
  onPageChange,
  onItemsPerPageChange,
}: L2ComponentInfoListViewProps) {
  const addTab = useMdiStore((state) => state.addTab);

  useEffect(() => {
    addTab({ id: "/ssf/component", label: "컴포넌트(L2)정보 관리", path: "/ssf/component" });
  }, [addTab]);

  const pageNumbers: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let index = 1; index <= totalPages; index += 1) pageNumbers.push(index);
  } else {
    pageNumbers.push(1, 2, 3, 4, 5, "...", totalPages);
  }

  const startIndex = totalCount === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endIndex = totalCount === 0 ? 0 : Math.min(page * itemsPerPage, totalCount);

  return (
    <div style={s.outer}>
      <PageHeader>
        <Breadcrumb items={[{ label: "SSF관리" }, { label: "컴포넌트(L2)정보 관리" }]} />
        <PageTitle title="컴포넌트(L2)정보 관리" favoriteKey="컴포넌트(L2)정보 관리" />
      </PageHeader>

      <div style={s.main}>
        <div style={s.filterWrap}>
          <div style={s.filterLeft}>
            <ChooseButton
              value={statusFilter}
              onChange={(value) => onStatusChange(value as L2ComponentStatus)}
              options={[
                { label: "전체", value: "전체" },
                { label: "사용", value: "사용" },
                { label: "미사용", value: "미사용" },
              ]}
            />
            <div style={s.domainSelect}>
              <SelectBox
                value={domainFilter}
                onChange={onDomainChange}
                options={domainOptions.map((value) => ({ label: value, value }))}
                placeholder="도메인(L1)"
              />
            </div>
          </div>

          <div style={s.filterRight}>
            <div style={s.searchScopeSelect}>
              <SelectBox
                value={searchScope}
                onChange={(value) => onSearchScopeChange(value as L2ComponentSearchScope)}
                options={[
                  { label: "컴포넌트(L2)명", value: "컴포넌트(L2)명" },
                  { label: "컴포넌트ID", value: "컴포넌트ID" },
                  { label: "해당업무명", value: "해당업무명" },
                ]}
                placeholder="검색범위"
              />
            </div>
            <Input
              value={keyword}
              onChange={(event) => onKeywordChange(event.target.value)}
              placeholder="검색어를 입력하세요."
              prefix="search"
              indicator={`${keyword.length}/20`}
              maxLength={20}
              style={s.searchInput}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSearch();
              }}
            />
            <Button size="l" variant="outlined" color="positive" onClick={onSearch}>
              검색
            </Button>
          </div>
        </div>

        <div style={s.listWrap}>
          <div style={s.tableFunction}>
            <span style={s.badge}>총 {totalCount}개</span>
            <div style={s.listAction}>
              <span style={s.paginationLabel}>Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
                style={s.itemsSelect}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span style={s.indicator}>
                {startIndex}-{endIndex} of {totalCount}
              </span>
              <div style={s.paginationWrap}>
                <button
                  type="button"
                  style={{ ...s.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
                  disabled={page === 1}
                  onClick={() => onPageChange(1)}
                >
                  <ChevronDoubleLeftIcon disabled={page === 1} />
                </button>
                <button
                  type="button"
                  style={{ ...s.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
                  disabled={page === 1}
                  onClick={() => onPageChange(Math.max(1, page - 1))}
                >
                  <ChevronLeftIcon disabled={page === 1} />
                </button>
                {pageNumbers.map((pageNumber, index) => (
                  <button
                    key={`${pageNumber}-${index}`}
                    type="button"
                    style={{ ...s.pageBtn, ...(pageNumber === page ? s.pageBtnActive : s.pageBtnInactive) }}
                    disabled={pageNumber === "..."}
                    onClick={() => {
                      if (typeof pageNumber === "number") onPageChange(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  style={{ ...s.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
                  disabled={page === totalPages}
                  onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                >
                  <ChevronRightIcon disabled={page === totalPages} />
                </button>
                <button
                  type="button"
                  style={{ ...s.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
                  disabled={page === totalPages}
                  onClick={() => onPageChange(totalPages)}
                >
                  <ChevronDoubleRightIcon disabled={page === totalPages} />
                </button>
              </div>
            </div>
          </div>

          <table style={s.table}>
            <colgroup>
              {COLUMNS.map((column) => (
                <col key={column.key} style={{ width: typeof column.width === "number" ? column.width : undefined }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th key={column.key} style={s.th} onClick={() => onSort(column.key)}>
                    <div style={s.thInner}>
                      <span>{column.label}</span>
                      <SortIcon active={sortKey === column.key} dir={sortKey === column.key ? sortDir : null} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={{ ...s.td, color: "#a1a1aa", padding: 40 }}>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={{ ...s.td, color: "#a1a1aa", padding: 40 }}>
                    데이터를 불러오는 중 오류가 발생했습니다.
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={{ ...s.td, color: "#a1a1aa", padding: 40 }}>
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td style={s.td}>{item.no}</td>
                    <td style={s.td}>{item.componentId}</td>
                    <td style={s.td}>{item.nameKo}</td>
                    <td style={s.td}>{item.nameEn}</td>
                    <td style={{ ...s.td, ...s.tdLeft }}>{item.description}</td>
                    <td style={s.td}>{item.domainName}</td>
                    <td style={s.td}>{item.plannerLeader}</td>
                    <td style={s.td}>{item.designLeader}</td>
                    <td style={s.td}>
                      <span style={item.useYn === "사용" ? s.useBadge : s.unuseBadge}>{item.useYn}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
