import { useEffect, type CSSProperties } from "react";
import { Breadcrumb } from "@/shared/ui/Breadcrumb";
import { Button } from "@/shared/ui/Button";
import { Checkbox } from "@/shared/ui/Checkbox";
import { ChooseButton } from "@/shared/ui/ChooseButton";
import { Input } from "@/shared/ui/Input";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageTitle } from "@/shared/ui/PageTitle";
import { SelectBox } from "@/shared/ui/SelectBox";
import { listStyles } from "@/shared/ui/styles";
import { useMdiStore } from "@/shared/model/mdi.store";
import type {
  FeatureInfoItem,
  FeatureSearchScope,
  FeatureSortDir,
  FeatureSortKey,
  FeatureStatus,
} from "@/features/ssf/model/feature-info.types";

function SortIcon({ active, dir }: { active: boolean; dir: FeatureSortDir }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M5.5 6.25L8 3.75L10.5 6.25"
        stroke={active && dir === "asc" ? "#7a5af8" : "#a1a1aa"}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 9.75L8 12.25L10.5 9.75"
        stroke={active && dir === "desc" ? "#7a5af8" : "#a1a1aa"}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaginationIcon({
  disabled,
  mode,
}: {
  disabled?: boolean;
  mode: "first" | "prev" | "next" | "last";
}) {
  const stroke = disabled ? "#d4d4d8" : "#71717a";

  if (mode === "first") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12 5L7 10L12 15" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 5L11 10L16 15" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (mode === "prev") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12 5L7 10L12 15" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (mode === "next") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M8 5L13 10L8 15" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 5L9 10L4 15" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 5L13 10L8 15" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M14.25 5.25V2.625M14.25 2.625H11.625M14.25 2.625L10.95 5.925C10.4198 5.39511 9.70105 5.09746 8.95156 5.09746C8.20208 5.09746 7.48333 5.39511 6.95312 5.925C6.42323 6.45521 6.12558 7.17395 6.12558 7.92344C6.12558 8.67292 6.42323 9.39167 6.95312 9.92187C7.48333 10.4518 8.20208 10.7494 8.95156 10.7494C9.70105 10.7494 10.4198 10.4518 10.95 9.92187"
        stroke="#71717a"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.75 12.75V15.375M3.75 15.375H6.375M3.75 15.375L7.05 12.075C7.5802 12.6049 8.29895 12.9025 9.04844 12.9025C9.79792 12.9025 10.5167 12.6049 11.0469 12.075C11.5768 11.5448 11.8744 10.826 11.8744 10.0766C11.8744 9.32708 11.5768 8.60833 11.0469 8.07812C10.5167 7.54823 9.79792 7.25058 9.04844 7.25058C8.29895 7.25058 7.5802 7.54823 7.05 8.07812"
        stroke="#71717a"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const s = {
  main: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
    padding: 32,
    minWidth: 0,
  } satisfies CSSProperties,
  filterCard: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 16,
    alignItems: "center",
    padding: "16px 28px",
    backgroundColor: "#f4f4f8",
    borderRadius: 12,
    border: "1px solid #ececf2",
  } satisfies CSSProperties,
  filterLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    minWidth: 0,
  } satisfies CSSProperties,
  filterRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    justifyContent: "flex-end",
    flexWrap: "wrap",
  } satisfies CSSProperties,
  selectField: {
    width: 170,
  } satisfies CSSProperties,
  searchField: {
    width: 390,
  } satisfies CSSProperties,
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  } satisfies CSSProperties,
  topBarLeft: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    flexWrap: "wrap",
  } satisfies CSSProperties,
  totalBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 14px",
    borderRadius: 999,
    border: "1px solid #d4d4d8",
    backgroundColor: "#ffffff",
    color: "#52525b",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "20px",
    whiteSpace: "nowrap",
  } satisfies CSSProperties,
  selectAllWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  } satisfies CSSProperties,
  selectAllLabel: {
    color: "#71717a",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "20px",
  } satisfies CSSProperties,
  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  } satisfies CSSProperties,
  itemsPerPageWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  } satisfies CSSProperties,
  paginationLabel: {
    color: "#a1a1aa",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "20px",
    whiteSpace: "nowrap",
  } satisfies CSSProperties,
  itemsSelect: {
    ...listStyles.itemsSelect,
    minWidth: 76,
    color: "#52525b",
  } satisfies CSSProperties,
  rangeText: {
    color: "#71717a",
    fontSize: 14,
    lineHeight: "20px",
    whiteSpace: "nowrap",
  } satisfies CSSProperties,
  paginationWrap: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  } satisfies CSSProperties,
  pageBtn: {
    width: 28,
    height: 28,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: 6,
    background: "transparent",
    cursor: "pointer",
    padding: 0,
    color: "#71717a",
  } satisfies CSSProperties,
  pageBtnActive: {
    backgroundColor: "#ffffff",
    color: "#52525b",
    fontWeight: 600,
    opacity: 1,
  } satisfies CSSProperties,
  pageBtnInactive: {
    color: "#a1a1aa",
    opacity: 1,
  } satisfies CSSProperties,
  refreshButton: {
    width: 28,
    height: 28,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: 6,
    backgroundColor: "transparent",
    padding: 0,
    cursor: "pointer",
  } satisfies CSSProperties,
  tableShell: {
    overflowX: "auto",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    boxShadow: "0 0 0 1px #e4e4e7 inset",
  } satisfies CSSProperties,
  table: {
    ...listStyles.table,
    minWidth: 1680,
    border: "none",
    borderRadius: 8,
  } satisfies CSSProperties,
  th: {
    ...listStyles.th,
    backgroundColor: "#f2f2f5",
    color: "#27272a",
    fontWeight: 500,
    height: 42,
    padding: "10px 8px",
  } satisfies CSSProperties,
  thInner: {
    ...listStyles.thInner,
    gap: 2,
  } satisfies CSSProperties,
  td: {
    ...listStyles.td,
    height: 48,
    color: "#18181b",
    padding: "10px 8px",
    whiteSpace: "nowrap",
  } satisfies CSSProperties,
  tdLeft: {
    ...listStyles.tdLeft,
    color: "#52525b",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 0,
  } satisfies CSSProperties,
  checkboxCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } satisfies CSSProperties,
  emptyCell: {
    ...listStyles.td,
    padding: 48,
    color: "#a1a1aa",
  } satisfies CSSProperties,
} as const;

const COLUMNS: { key: FeatureSortKey | "select"; label: string; width: number | string }[] = [
  { key: "select", label: "", width: 40 },
  { key: "no", label: "No", width: 96 },
  { key: "featureId", label: "기능(L4) ID", width: 244 },
  { key: "featureName", label: "기능(L4) 명", width: 180 },
  { key: "compositionType", label: "기능(L4) 구성 방식", width: 168 },
  { key: "description", label: "기능(L4) 설명", width: 450 },
  { key: "businessId", label: "업무(L3) ID", width: 182 },
  { key: "businessName", label: "업무(L3) 명", width: 170 },
  { key: "componentName", label: "컴포넌트(L2) 명", width: 150 },
  { key: "domainName", label: "도메인(L1)명", width: 160 },
  { key: "useYn", label: "사용여부", width: 110 },
];

interface FeatureInfoListViewProps {
  items: FeatureInfoItem[];
  totalCount: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
  statusFilter: FeatureStatus;
  domainFilter: string;
  componentFilter: string;
  businessFilter: string;
  searchScope: FeatureSearchScope;
  keyword: string;
  sortKey: FeatureSortKey | null;
  sortDir: FeatureSortDir;
  loading: boolean;
  error: boolean;
  domainOptions: string[];
  componentOptions: string[];
  businessOptions: string[];
  selectedIds: string[];
  onStatusChange: (value: FeatureStatus) => void;
  onDomainChange: (value: string) => void;
  onComponentChange: (value: string) => void;
  onBusinessChange: (value: string) => void;
  onSearchScopeChange: (value: FeatureSearchScope) => void;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onSort: (key: FeatureSortKey) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  onToggleRow: (id: string) => void;
  onToggleAllRows: () => void;
}

export function FeatureInfoListView({
  items,
  totalCount,
  page,
  totalPages,
  itemsPerPage,
  statusFilter,
  domainFilter,
  componentFilter,
  businessFilter,
  searchScope,
  keyword,
  sortKey,
  sortDir,
  loading,
  error,
  domainOptions,
  componentOptions,
  businessOptions,
  selectedIds,
  onStatusChange,
  onDomainChange,
  onComponentChange,
  onBusinessChange,
  onSearchScopeChange,
  onKeywordChange,
  onSearch,
  onSort,
  onPageChange,
  onItemsPerPageChange,
  onToggleRow,
  onToggleAllRows,
}: FeatureInfoListViewProps) {
  const addTab = useMdiStore((state) => state.addTab);

  useEffect(() => {
    addTab({ id: "/ssf/function", label: "기능(L4)정보 관리", path: "/ssf/function" });
  }, [addTab]);

  const pageNumbers: Array<number | string> = [];
  if (totalPages <= 7) {
    for (let index = 1; index <= totalPages; index += 1) pageNumbers.push(index);
  } else if (page <= 4) {
    pageNumbers.push(1, 2, 3, 4, 5, "...", totalPages);
  } else if (page >= totalPages - 3) {
    pageNumbers.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pageNumbers.push(1, "...", page - 1, page, page + 1, "...", totalPages);
  }

  const startIndex = totalCount === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endIndex = totalCount === 0 ? 0 : Math.min(page * itemsPerPage, totalCount);
  const allSelected = items.length > 0 && items.every((item) => selectedIds.includes(item.id));

  return (
    <div style={listStyles.outer}>
      <PageHeader>
        <Breadcrumb items={[{ label: "SSF관리" }, { label: "기능(L4)정보 관리" }]} />
        <PageTitle title="기능(L4)정보 관리" favoriteKey="기능(L4)정보 관리" />
      </PageHeader>

      <div style={s.main}>
        <div style={s.filterCard}>
          <div style={s.filterLeft}>
            <ChooseButton
              value={statusFilter}
              onChange={(value) => onStatusChange(value as FeatureStatus)}
              options={[
                { label: "전체", value: "전체" },
                { label: "사용", value: "사용" },
                { label: "미사용", value: "미사용" },
              ]}
            />
            <div style={s.selectField}>
              <SelectBox
                value={domainFilter}
                onChange={onDomainChange}
                options={domainOptions.map((value) => ({ label: value, value }))}
                placeholder="도메인(L1)"
              />
            </div>
            <div style={s.selectField}>
              <SelectBox
                value={componentFilter}
                onChange={onComponentChange}
                options={componentOptions.map((value) => ({ label: value, value }))}
                placeholder="컴포넌트(L2)"
              />
            </div>
            <div style={s.selectField}>
              <SelectBox
                value={businessFilter}
                onChange={onBusinessChange}
                options={businessOptions.map((value) => ({ label: value, value }))}
                placeholder="업무(L3)"
              />
            </div>
          </div>

          <div style={s.filterRight}>
            <div style={s.selectField}>
              <SelectBox
                value={searchScope}
                onChange={(value) => onSearchScopeChange(value as FeatureSearchScope)}
                options={[
                  { label: "기능(L4)명", value: "기능(L4)명" },
                  { label: "기능(L4) ID", value: "기능(L4) ID" },
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
              style={s.searchField}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSearch();
              }}
            />
            <Button size="l" variant="outlined" color="positive" onClick={onSearch}>
              검색
            </Button>
          </div>
        </div>

        <div style={s.topBar}>
          <div style={s.topBarLeft}>
            <span style={s.totalBadge}>총 {totalCount}개</span>
            <div style={s.selectAllWrap}>
              <Checkbox checked={allSelected} onChange={onToggleAllRows} size="m" />
              <span style={s.selectAllLabel}>전체 선택</span>
            </div>
          </div>

          <div style={s.topBarRight}>
            <div style={s.itemsPerPageWrap}>
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
            </div>
            <span style={s.rangeText}>
              {startIndex}-{endIndex} of {totalCount}
            </span>
            <div style={s.paginationWrap}>
              <button
                type="button"
                style={s.pageBtn}
                disabled={page === 1}
                onClick={() => onPageChange(1)}
              >
                <PaginationIcon disabled={page === 1} mode="first" />
              </button>
              <button
                type="button"
                style={s.pageBtn}
                disabled={page === 1}
                onClick={() => onPageChange(Math.max(1, page - 1))}
              >
                <PaginationIcon disabled={page === 1} mode="prev" />
              </button>
              {pageNumbers.map((pageNumber, index) => (
                <button
                  key={`${pageNumber}-${index}`}
                  type="button"
                  style={{
                    ...s.pageBtn,
                    ...(pageNumber === page ? s.pageBtnActive : s.pageBtnInactive),
                    width: typeof pageNumber === "number" ? 28 : 34,
                  }}
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
                style={s.pageBtn}
                disabled={page === totalPages}
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              >
                <PaginationIcon disabled={page === totalPages} mode="next" />
              </button>
              <button
                type="button"
                style={s.pageBtn}
                disabled={page === totalPages}
                onClick={() => onPageChange(totalPages)}
              >
                <PaginationIcon disabled={page === totalPages} mode="last" />
              </button>
            </div>
            <button type="button" style={s.refreshButton} onClick={onSearch} aria-label="새로고침">
              <RefreshIcon />
            </button>
          </div>
        </div>

        <div style={s.tableShell}>
          <table style={s.table}>
            <colgroup>
              {COLUMNS.map((column) => (
                <col key={column.key} style={{ width: typeof column.width === "number" ? column.width : undefined }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    style={s.th}
                    onClick={() => {
                      if (column.key !== "select") onSort(column.key);
                    }}
                  >
                    <div style={s.thInner}>
                      {column.key === "select" ? (
                        <Checkbox checked={allSelected} onChange={onToggleAllRows} size="s" />
                      ) : (
                        <>
                          <span>{column.label}</span>
                          <SortIcon active={sortKey === column.key} dir={sortKey === column.key ? sortDir : null} />
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={s.emptyCell}>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={s.emptyCell}>
                    데이터를 불러오는 중 오류가 발생했습니다.
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={s.emptyCell}>
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ ...s.td, ...s.checkboxCell }}>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onChange={() => onToggleRow(item.id)}
                        size="s"
                      />
                    </td>
                    <td style={s.td}>{item.no}</td>
                    <td style={s.td}>{item.featureId}</td>
                    <td style={s.td}>{item.featureName}</td>
                    <td style={s.td}>{item.compositionType}</td>
                    <td style={{ ...s.td, ...s.tdLeft }}>{item.description}</td>
                    <td style={s.td}>{item.businessId}</td>
                    <td style={s.td}>{item.businessName}</td>
                    <td style={s.td}>{item.componentName}</td>
                    <td style={s.td}>{item.domainName}</td>
                    <td style={s.td}>
                      <span style={item.useYn === "사용" ? listStyles.useBadge : listStyles.unuseBadge}>
                        {item.useYn}
                      </span>
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
