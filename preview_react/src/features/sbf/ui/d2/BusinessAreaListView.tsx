import { useState, useEffect, type CSSProperties } from "react";
import { ChooseButton } from "@/shared/ui/global/ChooseButton";
import { SelectBox } from "@/shared/ui/global/SelectBox";
import { Input } from "@/shared/ui/global/Input";
import { Button } from "@/shared/ui/global/Button";
import { useMdiStore } from "@/shared/model/mdi.store";
import { usePageHeader } from "@/shared/hooks/usePageHeader";
import type { BusinessAreaItem, BusinessAreaSortKey, SortDir } from "@/features/sbf/model/types";
import { useBusinessAreaListQuery } from "@/features/sbf/api/businessArea.queries";
import { listStyles } from "@/shared/ui/styles";
import { BusinessAreaCreatePopup } from "@/features/sbf/ui/d2/BusinessAreaCreatePopup";
import { BusinessAreaDetailPopup } from "@/features/sbf/ui/d2/BusinessAreaDetailPopup";
import { BusinessAreaEditPopup } from "@/features/sbf/ui/d2/BusinessAreaEditPopup";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{ flexShrink: 0, cursor: "pointer" }}
    >
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

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3V13M10 13L6 9M10 13L14 9" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 15V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V15" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CATEGORY_OPTIONS = [
  { label: "고객 여정", value: "고객 여정" },
  { label: "전략/기획", value: "전략/기획" },
  { label: "운영 지원", value: "운영 지원" },
  { label: "IT Admin", value: "IT Admin" },
];

const LIFECYCLE_OPTIONS = [
  { label: "서비스 공통", value: "LC-001" },
  { label: "서비스 혁신", value: "LC-002" },
  { label: "서비스 전략", value: "LC-003" },
  { label: "서비스 기획", value: "LC-004" },
  { label: "서비스 분석", value: "LC-005" },
  { label: "서비스 설계", value: "LC-006" },
  { label: "서비스 구현", value: "LC-007" },
  { label: "서비스 검증", value: "LC-008" },
  { label: "서비스 출시", value: "LC-009" },
  { label: "서비스 운영", value: "LC-010" },
  { label: "서비스 모니터링", value: "LC-011" },
  { label: "서비스 최적화", value: "LC-012" },
  { label: "서비스 폐기", value: "LC-013" },
];

const s = {
  filterLeft: {
    display: "flex",
    alignItems: "center",
    gap: 32,
  } satisfies CSSProperties,
  filterSelects: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  } satisfies CSSProperties,
  filterRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: 384,
  } satisfies CSSProperties,
};

const COLUMNS: {
  key: BusinessAreaSortKey;
  label: string;
  width: number | string;
  align?: "left" | "center";
}[] = [
  { key: "no", label: "No", width: 80, align: "center" },
  { key: "category", label: "구분", width: 140, align: "center" },
  { key: "lifecycleNameKo", label: "Lifecycle(D1)", width: 275, align: "center" },
  { key: "nameKo", label: "업무영역(D2)", width: 275, align: "center" },
  { key: "description", label: "업무영역(D2) 설명", width: "auto", align: "left" },
  { key: "useYn", label: "사용여부", width: 120, align: "center" },
];

export function BusinessAreaListView() {
  const { data: businessAreaList = [] } = useBusinessAreaListQuery();
  const addTab = useMdiStore((st) => st.addTab);

  useEffect(() => {
    addTab({
      id: "/sbf/business-area",
      label: "업무영역(D2) 관리",
      path: "/sbf/business-area",
    });
  }, [addTab]);

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BusinessAreaItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("전체");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [lifecycleFilter, setLifecycleFilter] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortKey, setSortKey] = useState<BusinessAreaSortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSort = (key: BusinessAreaSortKey) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") {
        setSortKey(null);
        setSortDir(null);
      } else setSortDir("asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = businessAreaList.filter((item: BusinessAreaItem) => {
    if (statusFilter === "사용" && item.useYn !== "사용") return false;
    if (statusFilter === "미사용" && item.useYn !== "미사용") return false;
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (lifecycleFilter.length > 0 && !lifecycleFilter.includes(item.lifecycleId)) return false;
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      return (
        item.nameKo.toLowerCase().includes(kw) ||
        item.businessAreaId.toLowerCase().includes(kw)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a: BusinessAreaItem, b: BusinessAreaItem) => {
    if (!sortKey || !sortDir) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    return sortDir === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * itemsPerPage;
  const pageItems = sorted.slice(startIdx, startIdx + itemsPerPage);

  const pageNumbers: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1, 2, 3, 4, 5, "...", totalPages);
  }

  const handleSearch = () => {
    setPage(1);
  };

  usePageHeader({
    breadcrumbItems: [{ label: "SBF 관리" }, { label: "업무영역(D2) 관리" }],
    title: "업무영역(D2) 관리",
    favoriteKey: "업무영역(D2) 관리",
    actions: (
      <Button
        size="m"
        variant="filled"
        color="positive"
        onClick={() => setCreateOpen(true)}
      >
        업무영역(D2) 신규 등록
      </Button>
    ),
  });

  return (
    <>
    <div style={listStyles.outer}>
      <div style={listStyles.main}>
        <div style={listStyles.filterWrap}>
          <div style={s.filterLeft}>
            <ChooseButton
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
              options={[
                { label: "전체", value: "전체" },
                { label: "사용", value: "사용" },
                { label: "미사용", value: "미사용" },
              ]}
            />
            <div style={s.filterSelects}>
              <SelectBox
                value={categoryFilter}
                onChange={(v) => {
                  setCategoryFilter(v);
                  setPage(1);
                }}
                options={CATEGORY_OPTIONS}
                placeholder="구분"
                style={{ width: 180 }}
              />
              <SelectBox
                multiple
                value={lifecycleFilter}
                onChange={(v) => {
                  setLifecycleFilter(v);
                  setPage(1);
                }}
                options={LIFECYCLE_OPTIONS}
                placeholder="Lifecycle(D1)"
                searchable
                searchPlaceholder="Lifecycle(D1) 검색"
                searchHighlight
                selectAllLabel="전체 선택"
                style={{ width: 200 }}
              />
            </div>
          </div>
          <div style={s.filterRight}>
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="업무영역(D2)명을 검색하세요."
              prefix="search"
              indicator={`${searchKeyword.length}/20`}
              maxLength={20}
              style={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button
              size="l"
              variant="outlined"
              color="positive"
              onClick={handleSearch}
            >
              검색
            </Button>
          </div>
        </div>

        <div style={listStyles.listWrap}>
          <div style={listStyles.tableFunction}>
            <div style={listStyles.tableFuncLeft}>
              <span style={listStyles.badge}>총 {totalCount}개</span>
            </div>
            <div style={listStyles.listAction}>
              <div style={listStyles.paginationField}>
                <span style={listStyles.paginationLabel}>Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  style={listStyles.itemsSelect}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <span style={listStyles.indicator}>
                {totalCount === 0
                  ? "0"
                  : `${startIdx + 1}-${Math.min(startIdx + itemsPerPage, totalCount)}`}{" "}
                of {totalCount}
              </span>
              <div style={listStyles.paginationWrap}>
                <button
                  style={{ ...listStyles.pageBtn, opacity: safePage === 1 ? 0.4 : 1 }}
                  disabled={safePage === 1}
                  onClick={() => setPage(1)}
                >
                  <ChevronDoubleLeftIcon disabled={safePage === 1} />
                </button>
                <button
                  style={{ ...listStyles.pageBtn, opacity: safePage === 1 ? 0.4 : 1 }}
                  disabled={safePage === 1}
                  onClick={() => setPage(Math.max(1, safePage - 1))}
                >
                  <ChevronLeftIcon disabled={safePage === 1} />
                </button>
                {pageNumbers.map((pn, idx) => (
                  <button
                    key={idx}
                    style={{
                      ...listStyles.pageBtn,
                      ...(pn === safePage ? listStyles.pageBtnActive : listStyles.pageBtnInactive),
                    }}
                    disabled={pn === "..."}
                    onClick={() => {
                      if (typeof pn === "number") setPage(pn);
                    }}
                  >
                    {pn}
                  </button>
                ))}
                <button
                  style={{ ...listStyles.pageBtn, opacity: safePage === totalPages ? 0.4 : 1 }}
                  disabled={safePage === totalPages}
                  onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                >
                  <ChevronRightIcon disabled={safePage === totalPages} />
                </button>
                <button
                  style={{ ...listStyles.pageBtn, opacity: safePage === totalPages ? 0.4 : 1 }}
                  disabled={safePage === totalPages}
                  onClick={() => setPage(totalPages)}
                >
                  <ChevronDoubleRightIcon disabled={safePage === totalPages} />
                </button>
              </div>
              <button style={listStyles.downloadBtn} title="다운로드">
                <DownloadIcon />
              </button>
            </div>
          </div>

          <table style={listStyles.table}>
            <colgroup>
              {COLUMNS.map((col) => (
                <col
                  key={col.key}
                  style={{ width: typeof col.width === "number" ? col.width : undefined }}
                />
              ))}
            </colgroup>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    style={listStyles.th}
                    onClick={() => handleSort(col.key)}
                  >
                    <div style={listStyles.thInner}>
                      <span>{col.label}</span>
                      <SortIcon
                        active={sortKey === col.key}
                        dir={sortKey === col.key ? sortDir : null}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLUMNS.length}
                    style={{ ...listStyles.td, padding: 40, color: "#a1a1aa" }}
                  >
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                pageItems.map((item: BusinessAreaItem) => (
                  <tr
                    key={item.no}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedItem(item);
                      setDetailOpen(true);
                    }}
                  >
                    <td style={listStyles.td}>{item.no}</td>
                    <td style={listStyles.td}>{item.category}</td>
                    <td style={listStyles.td}>{item.lifecycleNameKo}</td>
                    <td style={listStyles.td}>{item.nameKo}</td>
                    <td style={{ ...listStyles.td, ...listStyles.tdLeft }}>
                      {item.description}
                    </td>
                    <td style={listStyles.td}>
                      <span
                        style={
                          item.useYn === "사용"
                            ? listStyles.useBadge
                            : listStyles.unuseBadge
                        }
                      >
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

    <BusinessAreaCreatePopup
      open={createOpen}
      onClose={() => setCreateOpen(false)}
    />

    <BusinessAreaDetailPopup
      open={detailOpen}
      onClose={() => setDetailOpen(false)}
      data={selectedItem}
      onEdit={() => {
        setDetailOpen(false);
        setEditOpen(true);
      }}
    />

    <BusinessAreaEditPopup
      open={editOpen}
      onClose={() => setEditOpen(false)}
      data={selectedItem}
    />
    </>
  );
}
