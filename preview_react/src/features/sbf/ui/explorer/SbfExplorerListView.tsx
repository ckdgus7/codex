import { useState, useEffect, type CSSProperties } from "react";
import { useMdiStore } from "@/shared/model/mdi.store";
import { usePageHeader } from "@/shared/hooks/usePageHeader";
import { SelectBox } from "@/shared/ui/global/SelectBox";
import { Input } from "@/shared/ui/global/Input";
import { Button } from "@/shared/ui/global/Button";
import {
  LIFECYCLE_MOCK_DATA,
  BUSINESS_AREA_MOCK_DATA,
  BUSINESS_FLOW_MOCK_DATA,
} from "@/features/sbf/model/mock-data";
import type { LifecycleItem, BusinessAreaItem, BusinessFlowItem } from "@/features/sbf/model/types";

const FONT = "Pretendard, sans-serif";
const COLOR_D2 = "#039855";
const COLOR_D3 = "#12b76a";

// ── 최상위 고정 카테고리 ────────────────────────────────────
const ROOT_CATEGORIES = ["고객 여정", "전략 기획", "운영 지원", "IT Admin"] as const;

// ── 선택 노드 타입 ─────────────────────────────────────────
type SelectedNode =
  | { type: "d1"; data: LifecycleItem }
  | { type: "d2"; data: BusinessAreaItem; lifecycle: LifecycleItem }
  | { type: "d3"; data: BusinessFlowItem; lifecycle: LifecycleItem; businessArea: BusinessAreaItem };

// ── 아이콘 ─────────────────────────────────────────────────
function ExpandIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        flexShrink: 0,
        transition: "transform 0.15s",
        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
        opacity: expanded ? 1 : 0.3,
      }}
    >
      <path d="M6 4L10 8L6 12" stroke="#3f3f46" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
      <path d="M6 4L10 8L6 12" stroke="#3f3f46" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── 레벨 배지 ──────────────────────────────────────────────
function LevelBadge({ level, id }: { level: "D2" | "D3"; id: string }) {
  const color = level === "D2" ? COLOR_D2 : COLOR_D3;
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      border: `1px solid ${color}`, borderRadius: 12,
      paddingLeft: 4, paddingRight: 12, paddingTop: 4, paddingBottom: 4,
      backgroundColor: "#ffffff", flexShrink: 0,
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: 8, backgroundColor: color,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 10, color: "#ffffff", lineHeight: 1 }}>{level}</span>
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 14, lineHeight: "16px", color, whiteSpace: "nowrap" as const }}>{id}</span>
    </div>
  );
}

// ── 우측 상세 패널 ─────────────────────────────────────────
function DetailField({ label, value, fullWidth }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...(fullWidth ? { width: "100%" } : { flexShrink: 0 }) }}>
      <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 14, lineHeight: "18px", color: "#a1a1aa", whiteSpace: "nowrap" as const }}>{label}</span>
      <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 16, lineHeight: "24px", color: "#3f3f46", wordBreak: "break-word" as const }}>{value}</span>
    </div>
  );
}

function LinkItem({ url }: { url: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      backgroundColor: "#ffffff", border: "1px solid #e4e4e7",
      borderRadius: 4, padding: "8px 12px 8px 8px", minHeight: 40,
    }}>
      <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L14 8L8 14" stroke="#36bffa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-45 8 8)" />
        </svg>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1, fontFamily: FONT, fontSize: 14, lineHeight: "20px",
          color: "#36bffa", textDecoration: "underline",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
        }}
      >
        {url}
      </a>
    </div>
  );
}

function L3Badge({ id, name }: { id: string; name: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      backgroundColor: "#ffffff", border: "1px solid #e4e4e7",
      borderRadius: 4, padding: "8px 12px 8px 8px", minHeight: 40,
    }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 2,
        border: "1px solid #7a5af8", borderRadius: 12,
        paddingLeft: 3, paddingRight: 10, paddingTop: 3, paddingBottom: 3,
        backgroundColor: "#ffffff", flexShrink: 0,
      }}>
        <div style={{
          width: 12, height: 12, borderRadius: 8, backgroundColor: "#7a5af8",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 8, color: "#ffffff", lineHeight: 1 }}>L3</span>
        </div>
        <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 10, lineHeight: "12px", color: "#7a5af8", whiteSpace: "nowrap" as const }}>{id}</span>
      </div>
      <span style={{
        flex: 1, fontFamily: FONT, fontSize: 14, lineHeight: "20px", color: "#3f3f46",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
      }}>{name}</span>
      <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 5, backgroundColor: "#7a5af8",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="4" width="12" height="12" rx="2" fill="white" />
          </svg>
        </div>
      </div>
      <button style={{
        width: 24, height: 24, border: "1px solid #71717a", borderRadius: 4,
        backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", padding: 3, flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 9L12 9M9 6L9 12" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function ScreenBadge({ type, id, name }: { type: string; id: string; name: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      backgroundColor: "#ffffff", border: "1px solid #e4e4e7",
      borderRadius: 4, padding: "8px 12px 8px 8px", minHeight: 40,
    }}>
      <div style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3,
        borderRadius: 12, backgroundColor: "#fd853a", flexShrink: 0,
      }}>
        <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 10, lineHeight: "12px", color: "#fafafa", whiteSpace: "nowrap" as const }}>{type}</span>
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3,
        border: "1px solid #fd853a", borderRadius: 12,
        backgroundColor: "rgba(253,133,58,0.05)", flexShrink: 0,
      }}>
        <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 10, lineHeight: "12px", color: "#fd853a", whiteSpace: "nowrap" as const }}>{id}</span>
      </div>
      <span style={{
        flex: 1, fontFamily: FONT, fontSize: 14, lineHeight: "20px", color: "#3f3f46",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
      }}>{name}</span>
      <button style={{
        width: 24, height: 24, border: "1px solid #71717a", borderRadius: 4,
        backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", padding: 3, flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 9L12 9M9 6L9 12" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function DetailPanel({ node }: { node: SelectedNode }) {
  const getTitle = () => {
    if (node.type === "d3") return "SBF 정보 조회";
    return "상세 정보";
  };

  const renderContent = () => {
    if (node.type === "d1") {
      const d = node.data;
      return (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 32px" }}>
            <DetailField label="구분" value={d.category} />
            <DetailField label="Lifecycle(D1) 명" value={d.nameKo} />
          </div>
          <DetailField label="Lifecycle(D1) 설명" value={d.description} fullWidth />
          <DetailField label="사용여부" value={d.useYn} />
        </>
      );
    }
    if (node.type === "d2") {
      const d = node.data;
      return (
        <>
          <DetailField label="업무영역(D2) ID" value={d.businessAreaId} />
          <DetailField label="업무영역(D2) 명" value={d.nameKo} fullWidth />
          <DetailField label="업무영역(D2) 설명" value={d.description} fullWidth />
          <DetailField label="사용여부" value={d.useYn} />
        </>
      );
    }
    // d3 - 피그마 디자인에 맞춘 구조
    const d = node.data;
    return (
      <>
        <div style={{ display: "flex", gap: 32 }}>
          <DetailField label="업무Flow(D3) ID" value={d.businessFlowId} />
          <DetailField label="업무Flow(D3) 명" value={d.nameKo} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
          <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 14, lineHeight: "18px", color: "#a1a1aa" }}>Confluence 링크</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <LinkItem url="https://doss.sktelecom.com/wiki2/file_wikilink01" />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
          <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 14, lineHeight: "18px", color: "#a1a1aa" }}>업무(L3)</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <L3Badge id="BZ-CRMTMFC023-0006" name="대리점통합상담" />
            <L3Badge id="BZ-ORDTMFC002-0201" name="개통/장애 작업 연계 업셀링" />
            <L3Badge id="BZ-ORDTMFC002-0111" name="업셀관리" />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
          <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 14, lineHeight: "18px", color: "#a1a1aa" }}>화면기준정보</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ScreenBadge type="Screen" id="FO-UM040201" name="[T] 작업 요청 조회" />
            <ScreenBadge type="Screen" id="FO-UM040202" name="[T] 작업 관리" />
            <ScreenBadge type="Component" id="SCP019" name="업무(L3)/기능(L4)/상세기능(L5) SSF 매핑 관리" />
          </div>
        </div>
      </>
    );
  };

  return (
    <div style={{
      border: "1px solid #e4e4e7", borderRadius: 8,
      padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16,
      width: "100%", boxSizing: "border-box" as const,
    }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 16, lineHeight: "24px", color: "#18181b", height: 40, display: "flex", alignItems: "center" }}>
        {getTitle()}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {renderContent()}
      </div>
    </div>
  );
}

// ── 스타일 ─────────────────────────────────────────────────
const s = {
  outer: {
    display: "flex", flexDirection: "column", gap: 16,
    padding: 32, width: "100%", boxSizing: "border-box", fontFamily: FONT,
  } satisfies CSSProperties,

  filterWrap: {
    display: "flex", flexWrap: "wrap", gap: 16,
    alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#f8f9fc", borderRadius: 8,
    padding: "16px 24px", width: "100%", boxSizing: "border-box",
  } satisfies CSSProperties,

  filterLeft: {
    display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
  } satisfies CSSProperties,

  filterRight: {
    display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
  } satisfies CSSProperties,

  treeWrap: {
    display: "flex", flexDirection: "column", gap: 16, width: "100%",
  } satisfies CSSProperties,

  funcRow: {
    display: "flex", alignItems: "center", gap: 8,
  } satisfies CSSProperties,

  totalBadge: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "4px 12px", border: "1px solid #71717a", borderRadius: 12,
    backgroundColor: "#fafafa", fontFamily: FONT, fontWeight: 500,
    fontSize: 14, lineHeight: "16px", color: "#71717a", whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  contentRow: {
    display: "flex", gap: 16, alignItems: "flex-start", width: "100%",
  } satisfies CSSProperties,

  treeList: {
    border: "1px solid #e4e4e7", borderTop: "none",
    overflow: "hidden", width: 600, flexShrink: 0,
  } satisfies CSSProperties,

  treeRow: {
    display: "flex", alignItems: "center",
    borderTop: "1px solid #e4e4e7", backgroundColor: "#ffffff",
    minHeight: 40, cursor: "pointer",
  } satisfies CSSProperties,

  treeRowSelected: {
    display: "flex", alignItems: "center",
    borderTop: "1px solid #e4e4e7", backgroundColor: "#fffaeb",
    minHeight: 40, cursor: "pointer",
  } satisfies CSSProperties,

  treeItem: {
    display: "flex", flex: 1, alignItems: "center", gap: 8, padding: 8,
  } satisfies CSSProperties,

  treeLabel: {
    fontFamily: FONT, fontWeight: 400, fontSize: 16, lineHeight: "24px",
    color: "#18181b", flex: 1, minWidth: 0,
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  rightPanel: {
    flex: 1, minWidth: 0,
  } satisfies CSSProperties,

  emptyPanel: {
    border: "1px solid #e4e4e7", borderRadius: 8,
    padding: "40px 32px", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontFamily: FONT, fontSize: 14, color: "#a1a1aa",
  } satisfies CSSProperties,
} as const;

// ── 메인 컴포넌트 ──────────────────────────────────────────
export function SbfExplorerListView() {
  const addTab = useMdiStore((st) => st.addTab);

  useEffect(() => {
    addTab({ id: "/sbf/explorer", label: "SBF 탐색기", path: "/sbf/explorer" });
  }, [addTab]);

  usePageHeader({
    breadcrumbItems: [{ label: "SBF 관리" }, { label: "SBF 탐색기" }],
    title: "SBF 탐색기",
    favoriteKey: "/sbf/explorer",
  });

  // 필터
  const [categoryFilter, setCategoryFilter] = useState("");
  const [lifecycleFilter, setLifecycleFilter] = useState<string[]>([]);
  const [businessAreaFilter, setBusinessAreaFilter] = useState("");
  const [businessFlowFilter, setBusinessFlowFilter] = useState("");
  const [searchScope, setSearchScope] = useState("SBF명");
  const [inputKeyword, setInputKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 트리 expand 상태
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);

  const isExpanded = (key: string) => expanded[key] !== false;
  const toggleExpand = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [key]: !isExpanded(key) }));
  };

  const handleSearch = () => setSearchKeyword(inputKeyword);
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };

  // 필터 옵션
  const categoryOptions = [
    ...ROOT_CATEGORIES.map((c) => ({ label: c, value: c })),
  ];
  const lifecycleOptions = [
    ...LIFECYCLE_MOCK_DATA.map((l) => ({ label: l.nameKo, value: l.lifecycleId })),
  ];
  const businessAreaOptions = [
    ...BUSINESS_AREA_MOCK_DATA.map((b) => ({ label: b.nameKo, value: b.businessAreaId })),
  ];
  const businessFlowOptions = [
    ...BUSINESS_FLOW_MOCK_DATA.map((b) => ({ label: b.nameKo, value: b.businessFlowId })),
  ];
  const searchScopeOptions = [
    { label: "SBF명", value: "SBF명" },
    { label: "SBF ID", value: "SBF ID" },
  ];

  // 필터링된 데이터
  const filteredLifecycles = LIFECYCLE_MOCK_DATA.filter((lc) => {
    if (categoryFilter && lc.category !== categoryFilter) return false;
    if (lifecycleFilter.length > 0 && !lifecycleFilter.includes(lc.lifecycleId)) return false;
    return true;
  });

  const filteredBusinessAreas = (lcId: string) =>
    BUSINESS_AREA_MOCK_DATA.filter((ba) => {
      if (ba.lifecycleId !== lcId) return false;
      if (businessAreaFilter && ba.businessAreaId !== businessAreaFilter) return false;
      return true;
    });

  const filteredBusinessFlows = (baId: string) =>
    BUSINESS_FLOW_MOCK_DATA.filter((bf) => {
      if (bf.businessAreaId !== baId) return false;
      if (businessFlowFilter && bf.businessFlowId !== businessFlowFilter) return false;
      if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        if (searchScope === "SBF명") return bf.nameKo.toLowerCase().includes(kw);
        return bf.businessFlowId.toLowerCase().includes(kw) || bf.nameKo.toLowerCase().includes(kw);
      }
      return true;
    });

  // 총 D3 개수
  const totalD3 = BUSINESS_FLOW_MOCK_DATA.filter((bf) => {
    if (businessFlowFilter && bf.businessFlowId !== businessFlowFilter) return false;
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      if (searchScope === "SBF명") return bf.nameKo.toLowerCase().includes(kw);
      return bf.businessFlowId.toLowerCase().includes(kw) || bf.nameKo.toLowerCase().includes(kw);
    }
    return true;
  }).length;

  // 노드 선택 핸들러
  const selectD1 = (lc: LifecycleItem) => {
    const key = `d1:${lc.lifecycleId}`;
    setSelectedKey(key);
    setSelectedNode({ type: "d1", data: lc });
  };

  const selectD2 = (ba: BusinessAreaItem) => {
    const lc = LIFECYCLE_MOCK_DATA.find((l) => l.lifecycleId === ba.lifecycleId)!;
    const key = `d2:${ba.businessAreaId}`;
    setSelectedKey(key);
    setSelectedNode({ type: "d2", data: ba, lifecycle: lc });
  };

  const selectD3 = (bf: BusinessFlowItem) => {
    const lc = LIFECYCLE_MOCK_DATA.find((l) => l.lifecycleId === bf.lifecycleId)!;
    const ba = BUSINESS_AREA_MOCK_DATA.find((b) => b.businessAreaId === bf.businessAreaId)!;
    const key = `d3:${bf.businessFlowId}`;
    setSelectedKey(key);
    setSelectedNode({ type: "d3", data: bf, lifecycle: lc, businessArea: ba });
  };

  // 트리 렌더링
  const rows: React.ReactNode[] = [];

  ROOT_CATEGORIES.forEach((rootCat, rootIdx) => {
    // 이 카테고리에 해당하는 Lifecycle 목록
    const lcList = filteredLifecycles.filter((lc) => lc.category === rootCat);

    // 카테고리 필터 적용 시 해당 카테고리만 표시
    if (categoryFilter && rootCat !== categoryFilter) return;

    const rootKey = `root:${rootCat}`;
    const rootOpen = isExpanded(rootKey);

    rows.push(
      <div
        key={rootKey}
        style={rootIdx === 0 ? { ...s.treeRow, borderTop: "none" } : s.treeRow}
        onClick={(e) => toggleExpand(rootKey, e)}
      >
        <div style={s.treeItem}>
          <ExpandIcon expanded={rootOpen} />
          <span style={{ ...s.treeLabel, fontWeight: 500 }}>{rootCat}</span>
        </div>
      </div>
    );

    if (!rootOpen) return;

    lcList.forEach((lc) => {
      const d1Key = `d1:${lc.lifecycleId}`;
      const d1Open = isExpanded(d1Key);
      const d1Selected = selectedKey === d1Key;
      const baList = filteredBusinessAreas(lc.lifecycleId);

      rows.push(
        <div
          key={d1Key}
          style={d1Selected ? { ...s.treeRowSelected, paddingLeft: 20 } : { ...s.treeRow, paddingLeft: 20 }}
          onClick={() => {
            selectD1(lc);
            if (baList.length > 0) setExpanded((prev) => ({ ...prev, [d1Key]: !isExpanded(d1Key) }));
          }}
        >
          <div style={s.treeItem}>
            {baList.length > 0 ? <ExpandIcon expanded={d1Open} /> : <LeafIcon />}
            <span style={s.treeLabel}>{lc.nameKo}</span>
          </div>
        </div>
      );

      if (!d1Open) return;

      baList.forEach((ba) => {
        const d2Key = `d2:${ba.businessAreaId}`;
        const d2Open = isExpanded(d2Key);
        const d2Selected = selectedKey === d2Key;
        const bfList = filteredBusinessFlows(ba.businessAreaId);

        rows.push(
          <div
            key={d2Key}
            style={d2Selected ? { ...s.treeRowSelected, paddingLeft: 40 } : { ...s.treeRow, paddingLeft: 40 }}
            onClick={() => {
              selectD2(ba);
              if (bfList.length > 0) setExpanded((prev) => ({ ...prev, [d2Key]: !isExpanded(d2Key) }));
            }}
          >
            <div style={s.treeItem}>
              {bfList.length > 0 ? <ExpandIcon expanded={d2Open} /> : <LeafIcon />}
              <LevelBadge level="D2" id={ba.businessAreaId} />
              <span style={s.treeLabel}>{ba.nameKo}</span>
            </div>
          </div>
        );

        if (!d2Open) return;

        bfList.forEach((bf) => {
          const d3Key = `d3:${bf.businessFlowId}`;
          const d3Selected = selectedKey === d3Key;

          rows.push(
            <div
              key={d3Key}
              style={d3Selected ? { ...s.treeRowSelected, paddingLeft: 64 } : { ...s.treeRow, paddingLeft: 64 }}
              onClick={() => selectD3(bf)}
            >
              <div style={s.treeItem}>
                <LeafIcon />
                <LevelBadge level="D3" id={bf.businessFlowId} />
                <span style={s.treeLabel}>{bf.nameKo}</span>
              </div>
            </div>
          );
        });
      });
    });
  });

  return (
    <div style={s.outer}>
      {/* 필터 영역 */}
      <div style={s.filterWrap}>
        <div style={s.filterLeft}>
          <SelectBox options={categoryOptions} value={categoryFilter} onChange={(v) => setCategoryFilter(v as string)} placeholder="구분" style={{ width: 120 }} />
          <SelectBox multiple searchable options={lifecycleOptions} value={lifecycleFilter} onChange={(v) => setLifecycleFilter(v as string[])} placeholder="Lifecycle(D1)" style={{ width: 160 }} />
          <SelectBox options={businessAreaOptions} value={businessAreaFilter} onChange={(v) => setBusinessAreaFilter(v as string)} placeholder="업무영역(D2)" style={{ width: 160 }} />
          <SelectBox options={businessFlowOptions} value={businessFlowFilter} onChange={(v) => setBusinessFlowFilter(v as string)} placeholder="업무Flow(D3)" style={{ width: 160 }} />
        </div>
        <div style={s.filterRight}>
          <SelectBox options={searchScopeOptions} value={searchScope} onChange={(v) => setSearchScope(v as string)} style={{ width: 145 }} />
          <Input
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력하세요."
            indicator={`${inputKeyword.length}/20`}
            style={{ width: 280 }}
          />
          <Button size="m" variant="outlined" color="positive" onClick={handleSearch}>검색</Button>
        </div>
      </div>

      {/* 트리 + 상세 영역 */}
      <div style={s.treeWrap}>
        <div style={s.funcRow}>
          <span style={s.totalBadge}>총 {totalD3}개</span>
        </div>
        <div style={s.contentRow}>
          {/* 좌측 트리 */}
          <div style={s.treeList}>
            {rows.length > 0 ? rows : (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#a1a1aa", fontFamily: FONT, fontSize: 14 }}>
                검색 결과가 없습니다.
              </div>
            )}
          </div>

          {/* 우측 상세 패널 */}
          <div style={s.rightPanel}>
            {selectedNode ? (
              <DetailPanel node={selectedNode} />
            ) : (
              <div style={s.emptyPanel}>항목을 선택하면 상세 정보가 표시됩니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
