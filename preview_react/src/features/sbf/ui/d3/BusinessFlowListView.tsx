import { useState, useEffect, type CSSProperties } from "react";
import { useNavigate } from "react-router";
import { ChooseButton } from "@/shared/ui/global/ChooseButton";
import { SelectBox } from "@/shared/ui/global/SelectBox";
import { Input } from "@/shared/ui/global/Input";
import { Button } from "@/shared/ui/global/Button";
import { useMdiStore } from "@/shared/model/mdi.store";
import { usePageHeader } from "@/shared/hooks/usePageHeader";
import type { BusinessFlowItem, BusinessFlowSortKey, SortDir } from "@/features/sbf/model/types";
import { useBusinessFlowListQuery } from "@/features/sbf/api/businessFlow.queries";
import { BUSINESS_AREA_MOCK_DATA } from "@/features/sbf/model/mock-data";
import { listStyles } from "@/shared/ui/styles";
import { BusinessFlowCreatePopup } from "@/features/sbf/ui/d3/BusinessFlowCreatePopup";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, cursor: "pointer" }}>
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
  { label: "IT Admin", value: "IT Admin" },
  { label: "고객 여정", value: "고객 여정" },
  { label: "운영 지원", value: "운영 지원" },
  { label: "전략/기획", value: "전략/기획" },
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

const BUSINESS_AREA_OPTIONS = BUSINESS_AREA_MOCK_DATA.map((ba) => ({
  label: ba.nameKo,
  value: ba.businessAreaId,
}));

const SEARCH_TARGET_OPTIONS = [
  { label: "업무Flow(D3) 명", value: "nameKo" },
  { label: "업무Flow(D3) ID", value: "businessFlowId" },
];

const s: Record<string, CSSProperties> = {
  filterLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  filterSelects: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginLeft: 24,
  },
  filterRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
};

const SORTABLE_COLUMNS: {
  key: BusinessFlowSortKey;
  label: string;
  width: number | string;
  align: "left" | "center";
  sortable: boolean;
}[] = [
  { key: "no", label: "No", width: 64, align: "center", sortable: true },
  { key: "category", label: "구분", width: 100, align: "center", sortable: true },
  { key: "lifecycleNameKo", label: "Lifecycle(D1)", width: 160, align: "center", sortable: true },
  { key: "businessAreaNameKo", label: "업무영역(D2)", width: 180, align: "center", sortable: true },
  { key: "businessFlowId", label: "업무Flow(D3) ID", width: 130, align: "center", sortable: true },
  { key: "nameKo", label: "업무Flow(D3)", width: "auto", align: "center", sortable: true },
  { key: "useYn", label: "사용여부", width: 100, align: "center", sortable: false },
];

export function BusinessFlowListView() {
  const { data: businessFlowList = [] } = useBusinessFlowListQuery();
  const addTab = useMdiStore((st) => st.addTab);
  const navigate = useNavigate();

  useEffect(() => {
    addTab({
      id: "/sbf/business-flow",
      label: "업무Flow(D3) 관리",
      path: "/sbf/business-flow",
    });
  }, [addTab]);

  const [createOpen, setCreateOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("전체");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [lifecycleFilter, setLifecycleFilter] = useState<string[]>([]);
  const [businessAreaFilter, setBusinessAreaFilter] = useState<string[]>([]);
  const [searchTarget, setSearchTarget] = useState("nameKo");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [sortKey, setSortKey] = useState<BusinessFlowSortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const handleSort = (key: BusinessFlowSortKey) => {
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

  const filtered = businessFlowList.filter((item: BusinessFlowItem) => {
    if (statusFilter === "사용" && item.useYn !== "사용") return false;
    if (statusFilter === "미사용" && item.useYn !== "미사용") return false;
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (lifecycleFilter.length > 0 && !lifecycleFilter.includes(item.lifecycleId)) return false;
    if (businessAreaFilter.length > 0 && !businessAreaFilter.includes(item.businessAreaId)) return false;
    if (appliedKeyword) {
      const kw = appliedKeyword.toLowerCase();
      if (searchTarget === "nameKo") return item.nameKo.toLowerCase().includes(kw);
      if (searchTarget === "businessFlowId") return item.businessFlowId.toLowerCase().includes(kw);
    }
    return true;
  });

  const sorted = [...filtered].sort((a: BusinessFlowItem, b: BusinessFlowItem) => {
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
    setAppliedKeyword(searchKeyword);
    setPage(1);
  };

  usePageHeader({
    breadcrumbItems: [{ label: "SBF 관리" }, { label: "업무Flow(D3) 관리" }],
    title: "업무Flow(D3) 관리",
    favoriteKey: "업무Flow(D3) 관리",
    actions: (
      <Button size="m" variant="filled" color="positive" onClick={() => setCreateOpen(true)}>
        업무Flow(D3) 신규 등록
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
                style={{ width: 140 }}
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
                style={{ width: 180 }}
              />
              <SelectBox
                multiple
                value={businessAreaFilter}
                onChange={(v) => {
                  setBusinessAreaFilter(v);
                  setPage(1);
                }}
                options={BUSINESS_AREA_OPTIONS}
                placeholder="업무영역(D2)"
                searchable
                searchPlaceholder="업무영역 검색"
                searchHighlight
                selectAllLabel="전체 선택"
                style={{ width: 180 }}
              />
            </div>
          </div>
          <div style={s.filterRight}>
            <SelectBox
              value={searchTarget}
              onChange={(v) => setSearchTarget(v)}
              options={SEARCH_TARGET_OPTIONS}
              style={{ width: 175, flexShrink: 0 }}
            />
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색어를 입력하세요."
              prefix="search"
              indicator={`${searchKeyword.length}/20`}
              maxLength={20}
              style={{ width: 280 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button size="l" variant="outlined" color="positive" onClick={handleSearch}>
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

          <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ ...listStyles.table, minWidth: 768 }}>
            <colgroup>
              {SORTABLE_COLUMNS.map((col) => (
                <col
                  key={col.key}
                  style={{ width: typeof col.width === "number" ? col.width : undefined }}
                />
              ))}
            </colgroup>
            <thead>
              <tr>
                {SORTABLE_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      ...listStyles.th,
                      textAlign: col.align,
                      cursor: col.sortable ? "pointer" : "default",
                    }}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div style={{ ...listStyles.thInner, justifyContent: col.align === "left" ? "flex-start" : "center" }}>
                      <span>{col.label}</span>
                      {col.sortable && (
                        <SortIcon
                          active={sortKey === col.key}
                          dir={sortKey === col.key ? sortDir : null}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={SORTABLE_COLUMNS.length}
                    style={{
                      ...listStyles.td,
                      padding: 60,
                      color: "#a1a1aa",
                      textAlign: "center",
                      fontFamily: "'Pretendard', sans-serif",
                      fontSize: 14,
                    }}
                  >
                    {appliedKeyword || categoryFilter || lifecycleFilter.length > 0 || businessAreaFilter.length > 0
                      ? "조회된 정보가 없습니다."
                      : "등록된 정보가 없습니다."}
                  </td>
                </tr>
              ) : (
                pageItems.map((item: BusinessFlowItem) => {
                  return (
                    <tr
                      key={item.businessFlowId}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/sbf/business-flow/${item.businessFlowId}`)}
                    >
                      <td style={{ ...listStyles.td, textAlign: "center" }}>{item.no}</td>
                      <td style={{ ...listStyles.td, textAlign: "center" }}>{item.category}</td>
                      <td style={{ ...listStyles.td, textAlign: "center" }}>{item.lifecycleNameKo}</td>
                      <td style={{ ...listStyles.td, textAlign: "center" }}>{item.businessAreaNameKo}</td>
                      <td style={{ ...listStyles.td, textAlign: "center" }}>{item.businessFlowId}</td>
                      <td style={{ ...listStyles.td, ...listStyles.tdLeft }}>
                        {item.nameKo}
                      </td>
                      <td style={{ ...listStyles.td, textAlign: "center" }}>
                        <span style={item.useYn === "사용" ? listStyles.useBadge : listStyles.unuseBadge}>
                          {item.useYn}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>

    <BusinessFlowCreatePopup
      open={createOpen}
      onClose={() => setCreateOpen(false)}
    />
    </>
  );
}
