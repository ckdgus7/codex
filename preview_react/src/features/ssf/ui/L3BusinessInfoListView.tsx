import { useEffect, type CSSProperties } from "react";
import { useNavigate } from "react-router";
import { Breadcrumb } from "@/shared/ui/Breadcrumb";
import { Button } from "@/shared/ui/Button";
import { Checkbox } from "@/shared/ui/Checkbox";
import { ChooseButton } from "@/shared/ui/ChooseButton";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageTitle } from "@/shared/ui/PageTitle";
import { SelectBox } from "@/shared/ui/SelectBox";
import { listStyles } from "@/shared/ui/styles";
import { useMdiStore } from "@/shared/model/mdi.store";
import type {
  L3BusinessInfoItem,
  L3BusinessPeriod,
  L3BusinessSortDir,
  L3BusinessSortKey,
} from "@/features/ssf/model/l3-business-info.types";

function SortIcon({ active, dir }: { active: boolean; dir: L3BusinessSortDir }) {
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
  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  } satisfies CSSProperties,
  periodWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  } satisfies CSSProperties,
  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  } satisfies CSSProperties,
  assigneeSelect: {
    width: 660,
  } satisfies CSSProperties,
  searchButton: {
    height: 40,
  } satisfies CSSProperties,
  checkboxCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } satisfies CSSProperties,
  rowHover: {
    cursor: "pointer",
  } satisfies CSSProperties,
} as const;

const COLUMNS: { key: L3BusinessSortKey | "select"; label: string; width: number | string; align?: "left" | "center" }[] = [
  { key: "select", label: "", width: 34, align: "center" },
  { key: "no", label: "No", width: 80, align: "center" },
  { key: "businessId", label: "업무ID", width: 151, align: "center" },
  { key: "businessName", label: "업무명", width: 186, align: "center" },
  { key: "componentId", label: "L2컴포넌트ID", width: 182.5, align: "center" },
  { key: "domainName", label: "업무구분", width: 182.5, align: "center" },
  { key: "plannerLeader", label: "L3기획리더", width: 108, align: "center" },
  { key: "designLeader", label: "L3디자인리더", width: 108, align: "center" },
  { key: "useYn", label: "사용여부", width: 120, align: "center" },
];

interface L3BusinessInfoListViewProps {
  items: L3BusinessInfoItem[];
  totalCount: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
  period: L3BusinessPeriod;
  assignee: string;
  assigneeOptions: string[];
  sortKey: L3BusinessSortKey | null;
  sortDir: L3BusinessSortDir;
  loading: boolean;
  error: boolean;
  onPeriodChange: (value: L3BusinessPeriod) => void;
  onAssigneeChange: (value: string) => void;
  onSearch: () => void;
  onSort: (key: L3BusinessSortKey) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

export function L3BusinessInfoListView({
  items,
  totalCount,
  page,
  totalPages,
  itemsPerPage,
  period,
  assignee,
  assigneeOptions,
  sortKey,
  sortDir,
  loading,
  error,
  onPeriodChange,
  onAssigneeChange,
  onSearch,
  onSort,
  onPageChange,
  onItemsPerPageChange,
}: L3BusinessInfoListViewProps) {
  const addTab = useMdiStore((state) => state.addTab);
  const navigate = useNavigate();

  useEffect(() => {
    addTab({ id: "/ssf/business", label: "업무(L3)정보 관리", path: "/ssf/business" });
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
    <div style={listStyles.outer}>
      <PageHeader>
        <Breadcrumb items={[{ label: "SSF관리" }, { label: "업무(L3)정보 관리" }]} />
        <PageTitle title="업무(L3)정보 관리" favoriteKey="업무(L3)정보 관리" />
      </PageHeader>

      <div style={listStyles.main}>
        <div style={listStyles.filterWrap}>
          <div style={s.filterRow}>
            <div style={s.periodWrap}>
              <ChooseButton
                value={period}
                onChange={(value) => onPeriodChange(value as L3BusinessPeriod)}
                options={[
                  { label: "1개월", value: "1개월" },
                  { label: "3개월", value: "3개월" },
                  { label: "6개월", value: "6개월" },
                ]}
              />
            </div>
          </div>
          <div style={s.searchRow}>
            <SelectBox
              value={assignee}
              onChange={onAssigneeChange}
              options={assigneeOptions.map((value) => ({ label: value, value }))}
              placeholder="담당자를 선택하거나 검색하세요."
              searchable
              searchPlaceholder="담당자 검색"
              style={s.assigneeSelect}
            />
            <Button
              size="l"
              variant="outlined"
              color="positive"
              onClick={() => onSearch()}
              style={s.searchButton}
            >
              검색
            </Button>
          </div>
        </div>

        <div style={listStyles.listWrap}>
          <div style={listStyles.tableFunction}>
            <span style={listStyles.badge}>총 {totalCount}개</span>
            <div style={listStyles.listAction}>
              <div style={listStyles.paginationField}>
                <span style={listStyles.paginationLabel}>Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
                  style={listStyles.itemsSelect}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <span style={listStyles.indicator}>
                {startIndex}-{endIndex} of {totalCount}
              </span>
              <div style={listStyles.paginationWrap}>
                <button
                  type="button"
                  style={{ ...listStyles.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
                  disabled={page === 1}
                  onClick={() => onPageChange(1)}
                >
                  <ChevronDoubleLeftIcon disabled={page === 1} />
                </button>
                <button
                  type="button"
                  style={{ ...listStyles.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
                  disabled={page === 1}
                  onClick={() => onPageChange(Math.max(1, page - 1))}
                >
                  <ChevronLeftIcon disabled={page === 1} />
                </button>
                {pageNumbers.map((pageNumber, index) => (
                  <button
                    key={`${pageNumber}-${index}`}
                    type="button"
                    style={{
                      ...listStyles.pageBtn,
                      ...(pageNumber === page ? listStyles.pageBtnActive : listStyles.pageBtnInactive),
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
                  style={{ ...listStyles.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
                  disabled={page === totalPages}
                  onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                >
                  <ChevronRightIcon disabled={page === totalPages} />
                </button>
                <button
                  type="button"
                  style={{ ...listStyles.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
                  disabled={page === totalPages}
                  onClick={() => onPageChange(totalPages)}
                >
                  <ChevronDoubleRightIcon disabled={page === totalPages} />
                </button>
              </div>
            </div>
          </div>

          <table style={listStyles.table}>
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
                    style={listStyles.th}
                    onClick={() => {
                      if (column.key !== "select") onSort(column.key);
                    }}
                  >
                    <div style={listStyles.thInner}>
                      <span>{column.label}</span>
                      {column.key !== "select" ? (
                        <SortIcon active={sortKey === column.key} dir={sortKey === column.key ? sortDir : null} />
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={{ ...listStyles.td, color: "#a1a1aa", padding: 40 }}>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={{ ...listStyles.td, color: "#a1a1aa", padding: 40 }}>
                    데이터를 불러오는 중 오류가 발생했습니다.
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} style={{ ...listStyles.td, color: "#a1a1aa", padding: 40 }}>
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    style={s.rowHover}
                    onClick={() => navigate(`/ssf/business/${item.id}`)}
                  >
                    <td style={{ ...listStyles.td, ...s.checkboxCell }} onClick={(event) => event.stopPropagation()}>
                      <Checkbox checked={false} onChange={() => {}} size="s" />
                    </td>
                    <td style={listStyles.td}>{item.no}</td>
                    <td style={listStyles.td}>{item.businessId}</td>
                    <td style={listStyles.td}>{item.businessName}</td>
                    <td style={listStyles.td}>{item.componentId}</td>
                    <td style={listStyles.td}>{item.domainName}</td>
                    <td style={listStyles.td}>{item.plannerLeader}</td>
                    <td style={listStyles.td}>{item.designLeader}</td>
                    <td style={listStyles.td}>
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
