import { useState, useEffect, type CSSProperties } from "react";
import { useParams, useNavigate } from "react-router";
import { useMdiStore } from "@/shared/model/mdi.store";
import { usePageHeader } from "@/shared/hooks/usePageHeader";
import { Button } from "@/shared/ui/global/Button";
import { AlertModal } from "@/shared/ui/global/AlertModal";
import { BusinessFlowEditPopup } from "@/features/sbf/ui/d3/BusinessFlowEditPopup";
import {
  getBusinessFlowDetail,
  getLifecycleDetail,
  getBusinessAreaDetail,
} from "@/features/sbf/model/mock-data";

const FONT = "Pretendard, sans-serif";

/* ─────────────────────────────────────────────────────────────
   Mock sub-data
───────────────────────────────────────────────────────────── */

const MOCK_L3_ITEMS = [
  { id: "BZ-PTYTMFC028-0022", name: "대리점정보관리" },
];

const MOCK_SCREEN_ITEMS = [
  { type: "Screen",    code: "FD-UM6M020", name: "[T] 작업 요청 조회" },
  { type: "Screen",    code: "FD-UM04002", name: "[T] 작업 관리" },
  { type: "Component", code: "SSF016",     name: "업무(L3)/기능(L4)/상세기능(L5) SSF 매핑 관리" },
];

const MOCK_CONFLUENCE_LINKS = [
  "https://doss.sktelecom.com/wiki2/a/file_wiki/wiki01",
];

const MOCK_HISTORY = [
  { type: "수정" as const, user: "정무론하누", date: "2025-11-28 15:24" },
  { type: "수정" as const, user: "정무론하누", date: "2025-11-28 15:24" },
  { type: "저장" as const, user: "정무론하누", date: "2025-11-28 15:24" },
];

interface BpdVersion {
  id: string;
  version: string;
  state: "Deployed" | "Retired" | "Draft";
  author: string;
  date: string;
  description: string;
}

interface BpdFile {
  id: string;
  name: string;
  latestVersion: string;
  state: "Deployed" | "Retired" | "Draft";
  url: string;
  versions: BpdVersion[];
}

const MOCK_BPD_FILES: BpdFile[] = [
  {
    id: "bpd-01",
    name: "Biz Process Diagram 01",
    latestVersion: "v 2.11.029",
    state: "Deployed",
    url: "https://atlnvops.nova.com/bitasset/asset/bod/X3yRe1g9Ud09FCthrYmaQi-EC%B0%BC%BD%B4%84%E1%83%A",
    versions: [
      {
        id: "bpd-01-v1",
        version: "v 2.11.029",
        state: "Deployed",
        author: "전우치",
        date: "2025-11-28 15:24",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
  },
  {
    id: "bpd-02",
    name: "Biz Process Diagram 02",
    latestVersion: "v 1.02.000.01",
    state: "Deployed",
    url: "https://atlnvops.nova.com/bitasset/asset/bod/X3yRe1g9Ud09FCthrYmaQi-1EC%B0%BC%BD%B4%84%E1%83%A",
    versions: [
      {
        id: "bpd-02-v1",
        version: "v 1.02.000.01",
        state: "Deployed",
        author: "전우치",
        date: "2025-11-28 15:24",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      { id: "bpd-02-v2", version: "v 1.02.000", state: "Retired", author: "전우치", date: "2025-11-28 15:24", description: "" },
      { id: "bpd-02-v3", version: "v 1.01.000", state: "Retired", author: "전우치", date: "2025-11-28 15:24", description: "" },
      { id: "bpd-02-v4", version: "v 1.00.000", state: "Retired", author: "전우치", date: "2025-11-28 15:24", description: "" },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   Icon components
───────────────────────────────────────────────────────────── */

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="#a1a1aa" strokeWidth="1.2" />
      <path d="M3 11V3h8" stroke="#a1a1aa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5.5 7.5a3 3 0 0 0 4.243.293l1.5-1.5a3 3 0 0 0-4.243-4.243l-.86.86" stroke="#7a5af8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8.5 6.5a3 3 0 0 0-4.243-.293l-1.5 1.5a3 3 0 0 0 4.243 4.243l.86-.86" stroke="#7a5af8" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4L10 8L6 12" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M8 2h4v4M6 8l6-6M11 8v4H2V3h4" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 10L8 6L12 10" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightSmIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4 2L8 6L4 10" stroke="#7a5af8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ZoomInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="#71717a" strokeWidth="1.2" />
      <path d="M9.5 9.5L12.5 12.5" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4 6H8M6 4V8" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ZoomOutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="#71717a" strokeWidth="1.2" />
      <path d="M9.5 9.5L12.5 12.5" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4 6H8" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function FitScreenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="1.5" width="11" height="11" rx="1" stroke="#71717a" strokeWidth="1.2" />
      <path d="M4.5 2v2.5H2M9.5 2v2.5H12M4.5 12v-2.5H2M9.5 12v-2.5H12" stroke="#71717a" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="#7a5af8" strokeWidth="1.2" />
      <path d="M7 4.5V7L9 8.5" stroke="#7a5af8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BpdFileIcon({ color = "#7a5af8" }: { color?: string }) {
  return (
    <div style={{
      width: 32,
      height: 32,
      borderRadius: 6,
      backgroundColor: color === "#7a5af8" ? "#f5f3ff" : "#f0fdf4",
      border: `1px solid ${color === "#7a5af8" ? "#d6bbfb" : "#abefc6"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="5" width="4" height="3" rx="0.8" stroke={color} strokeWidth="1" />
        <rect x="11" y="5" width="4" height="3" rx="0.8" stroke={color} strokeWidth="1" />
        <rect x="7" y="11" width="4" height="3" rx="0.8" stroke={color} strokeWidth="1" />
        <path d="M5 8v1.5h4M13 8v1.5h-4M9 9.5V11" stroke={color} strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#e4e4e7" />
      <circle cx="9" cy="7.5" r="2.5" fill="#a1a1aa" />
      <path d="M4 15.5C4 12.738 6.239 10.5 9 10.5s5 2.238 5 5" stroke="#a1a1aa" strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function BpmnThumbnail() {
  return (
    <div style={{
      width: 140,
      height: 80,
      border: "1px solid #e4e4e7",
      borderRadius: 4,
      backgroundColor: "#fafafa",
      flexShrink: 0,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <svg width="120" height="64" viewBox="0 0 120 64" fill="none">
        <rect x="4" y="22" width="22" height="14" rx="2" stroke="#d4d4d8" strokeWidth="1" fill="#f4f4f5" />
        <rect x="36" y="14" width="22" height="14" rx="2" stroke="#d4d4d8" strokeWidth="1" fill="#f4f4f5" />
        <rect x="36" y="36" width="22" height="14" rx="2" stroke="#d4d4d8" strokeWidth="1" fill="#f4f4f5" />
        <rect x="70" y="22" width="22" height="14" rx="2" stroke="#d4d4d8" strokeWidth="1" fill="#f4f4f5" />
        <rect x="100" y="22" width="16" height="14" rx="7" stroke="#d4d4d8" strokeWidth="1" fill="#f4f4f5" />
        <path d="M26 29h10M47 28V22M47 36v8M58 21h12M58 43h12M92 29h8" stroke="#d4d4d8" strokeWidth="1" strokeLinecap="round" />
        <path d="M36 21L33 24L36 27" stroke="#d4d4d8" strokeWidth="0.8" fill="none" />
        <path d="M70 21L67 24L70 27" stroke="#d4d4d8" strokeWidth="0.8" fill="none" />
        <path d="M100 21L97 24L100 27" stroke="#d4d4d8" strokeWidth="0.8" fill="none" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Small badge components
───────────────────────────────────────────────────────────── */

function StateBadge({ state }: { state: "Deployed" | "Retired" | "Draft" }) {
  const map: Record<string, CSSProperties> = {
    Deployed: { background: "#f2fdf5", color: "#1ac057", borderColor: "#1ac057" },
    Retired:  { background: "#fafafa", color: "#a1a1aa", borderColor: "#a1a1aa" },
    Draft:    { background: "#fffaeb", color: "#f79009", borderColor: "#f79009" },
  };
  return (
    <span style={{
      ...map[state],
      fontFamily: FONT,
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 10px",
      borderRadius: 12,
      border: "1px solid",
      whiteSpace: "nowrap" as const,
      flexShrink: 0,
    }}>
      {state}
    </span>
  );
}

function HistoryBadge({ type }: { type: "수정" | "저장" }) {
  const st: CSSProperties = type === "수정"
    ? { background: "#fffaeb", color: "#f79009", borderColor: "#f79009" }
    : { background: "#f2fdf5", color: "#1ac057", borderColor: "#1ac057" };
  return (
    <span style={{
      ...st,
      fontFamily: FONT,
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 10px",
      borderRadius: 12,
      border: "1px solid",
      whiteSpace: "nowrap" as const,
      flexShrink: 0,
    }}>
      {type}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Styles
───────────────────────────────────────────────────────────── */

const s = {
  outer: { display: "flex", flexDirection: "column" as const, width: "100%", height: "100%", overflow: "auto", fontFamily: FONT } satisfies CSSProperties,

  /* Two-column main row */
  mainRow: { display: "flex", width: "100%", minHeight: "100%", alignItems: "stretch" } satisfies CSSProperties,

  /* ── Left half ── */
  leftHalf: { width: "50%", flexShrink: 0, borderRight: "1px solid #e4e4e7", display: "flex" } satisfies CSSProperties,

  infoPanel: {
    flex: 1, padding: "24px 32px", overflowY: "auto" as const,
    display: "flex", flexDirection: "column" as const, gap: 24,
  } satisfies CSSProperties,

  infoPanelHeader: { display: "flex", alignItems: "flex-start", minHeight: 40 } satisfies CSSProperties,

  sectionTitle: { fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#000000", flexShrink: 0 } satisfies CSSProperties,

  historyBtn: {
    display: "flex", alignItems: "center", gap: 4,
    border: "none", background: "transparent", cursor: "pointer",
    fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#7a5af8",
    padding: 0, flexShrink: 0,
  } satisfies CSSProperties,

  /* Fields */
  fieldRow: { display: "flex", gap: 32, alignItems: "flex-start" } satisfies CSSProperties,

  field: { display: "flex", flexDirection: "column" as const, gap: 4 } satisfies CSSProperties,
  fieldFull: { display: "flex", flexDirection: "column" as const, gap: 4, width: "100%" } satisfies CSSProperties,

  label: { fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#a1a1aa", lineHeight: "18px" } satisfies CSSProperties,

  value: { fontFamily: FONT, fontSize: 16, fontWeight: 400, color: "#3f3f46", lineHeight: "24px" } satisfies CSSProperties,
  valueSmall: { fontFamily: FONT, fontSize: 14, fontWeight: 400, color: "#3f3f46", lineHeight: "20px" } satisfies CSSProperties,

  /* Confluence */
  confluenceRow: {
    display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
    border: "1px solid #e4e4e7", borderRadius: 6, backgroundColor: "#fafafa",
    width: "100%", boxSizing: "border-box" as const,
  } satisfies CSSProperties,

  confluenceLink: {
    flex: 1, fontFamily: FONT, fontSize: 13, color: "#7a5af8",
    textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const, cursor: "pointer",
  } satisfies CSSProperties,

  iconBtn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 28, height: 28, border: "none", background: "transparent",
    cursor: "pointer", padding: 0, flexShrink: 0, borderRadius: 4,
  } satisfies CSSProperties,

  iconBtnBorder: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 28, height: 28, border: "1px solid #e4e4e7", background: "#ffffff",
    cursor: "pointer", padding: 0, flexShrink: 0, borderRadius: 4,
  } satisfies CSSProperties,

  /* L3 / Screen items */
  subItem: {
    display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
    border: "1px solid #e4e4e7", borderRadius: 6, backgroundColor: "#ffffff",
    width: "100%", boxSizing: "border-box" as const, minHeight: 40,
  } satisfies CSSProperties,

  l3Badge: {
    fontFamily: FONT, fontSize: 11, fontWeight: 500, color: "#5927e5",
    backgroundColor: "#f5f3ff", border: "1px solid #d6bbfb",
    padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" as const, flexShrink: 0,
  } satisfies CSSProperties,

  subItemName: {
    flex: 1, fontFamily: FONT, fontSize: 13, color: "#3f3f46",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  screenBadge: (type: string): CSSProperties => {
    const m: Record<string, { color: string; bg: string; border: string }> = {
      Screen:    { color: "#067647", bg: "#ecfdf3", border: "#abefc6" },
      Component: { color: "#6941c6", bg: "#f9f5ff", border: "#d6bbfb" },
    };
    const c = m[type] ?? { color: "#3f3f46", bg: "#f4f4f5", border: "#e4e4e7" };
    return { fontFamily: FONT, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, color: c.color, backgroundColor: c.bg, border: `1px solid ${c.border}`, whiteSpace: "nowrap", flexShrink: 0 };
  },

  screenCodeBadge: {
    fontFamily: FONT, fontSize: 11, fontWeight: 500, color: "#b54708",
    backgroundColor: "#fffaeb", border: "1px solid #fec84b",
    padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" as const, flexShrink: 0,
  } satisfies CSSProperties,

  /* ── History side panel ── */
  historyPanel: {
    width: 192, flexShrink: 0,
    borderLeft: "1px solid #e4e4e7",
    overflowY: "auto" as const,
    padding: "24px 16px",
  } satisfies CSSProperties,

  historyEntry: { display: "flex", gap: 10, alignItems: "flex-start" } satisfies CSSProperties,

  historyMark: { display: "flex", flexDirection: "column" as const, alignItems: "center", flexShrink: 0, width: 16 } satisfies CSSProperties,

  historyLine: { width: 1, flex: 1, backgroundColor: "#e4e4e7", minHeight: 10 } satisfies CSSProperties,

  historyDot: { width: 8, height: 8, borderRadius: "50%", backgroundColor: "#d4d4d8", flexShrink: 0 } satisfies CSSProperties,

  historyContent: { display: "flex", flexDirection: "column" as const, gap: 2, paddingBottom: 16 } satisfies CSSProperties,

  historyUser: { fontFamily: FONT, fontSize: 11, color: "#71717a", lineHeight: "16px" } satisfies CSSProperties,
  historyDate: { fontFamily: FONT, fontSize: 10, color: "#a1a1aa", lineHeight: "14px" } satisfies CSSProperties,

  /* ── Right half: BPD 관리 ── */
  rightHalf: { width: "50%", flexShrink: 0, display: "flex", flexDirection: "column" as const } satisfies CSSProperties,

  bpdHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 24px", borderBottom: "1px solid #e4e4e7", flexShrink: 0,
  } satisfies CSSProperties,

  bpdHeaderTitle: { fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#18181b" } satisfies CSSProperties,

  bpdAddBtn: {
    display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
    border: "1px solid #7a5af8", borderRadius: 6, background: "#ffffff",
    cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 500, color: "#7a5af8",
  } satisfies CSSProperties,

  bpdContent: { flex: 1, overflowY: "auto" as const, display: "flex", flexDirection: "column" as const } satisfies CSSProperties,

  /* BPD card (accordion item) */
  bpdCard: { borderBottom: "1px solid #e4e4e7" } satisfies CSSProperties,

  bpdCardHeader: {
    display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
    cursor: "pointer",
    userSelect: "none" as const,
  } satisfies CSSProperties,

  bpdCardMeta: { flex: 1, display: "flex", flexDirection: "column" as const, gap: 2, overflow: "hidden" } satisfies CSSProperties,

  bpdCardRow1: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const } satisfies CSSProperties,

  bpdCardVersion: { fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#18181b", whiteSpace: "nowrap" as const } satisfies CSSProperties,

  bpdCardName: { fontFamily: FONT, fontSize: 13, fontWeight: 500, color: "#3f3f46" } satisfies CSSProperties,

  bpdCardUrl: {
    fontFamily: FONT, fontSize: 11, color: "#a1a1aa",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  /* Expanded BPD content */
  bpdExpanded: {
    backgroundColor: "#fafafa",
    borderTop: "1px solid #f0f0f0",
    padding: "12px 16px",
  } satisfies CSSProperties,

  bpdExpandedTop: {
    display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: 10, gap: 8,
  } satisfies CSSProperties,

  bpdDataBtn: {
    display: "flex", alignItems: "center", gap: 5, padding: "5px 12px",
    border: "1px solid #7a5af8", borderRadius: 6, background: "transparent",
    cursor: "pointer", fontFamily: FONT, fontSize: 12, fontWeight: 500, color: "#7a5af8",
    whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  versionRow: {
    display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8,
    padding: "8px 0", borderBottom: "1px solid #f0f0f0",
  } satisfies CSSProperties,

  versionLeft: { display: "flex", flexDirection: "column" as const, gap: 2 } satisfies CSSProperties,

  versionText: { fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#18181b" } satisfies CSSProperties,

  versionSub: { fontFamily: FONT, fontSize: 11, color: "#71717a", lineHeight: "16px" } satisfies CSSProperties,

  zoomControls: { display: "flex", gap: 4, flexShrink: 0 } satisfies CSSProperties,

  zoomBtn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 26, height: 26, border: "1px solid #e4e4e7", background: "#ffffff",
    borderRadius: 4, cursor: "pointer", padding: 0, flexShrink: 0,
  } satisfies CSSProperties,

  /* BPD Detail section (bottom) */
  bpdDetail: { padding: "20px 24px", display: "flex", flexDirection: "column" as const, gap: 14, borderTop: "1px solid #e4e4e7" } satisfies CSSProperties,

  bpdDetailRow: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" as const } satisfies CSSProperties,

  bpdDetailLabel: { fontFamily: FONT, fontSize: 12, fontWeight: 500, color: "#a1a1aa", whiteSpace: "nowrap" as const } satisfies CSSProperties,

  bpdDetailValue: { fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#18181b" } satisfies CSSProperties,

  bpdDetailMetaRow: { display: "flex", gap: 28, flexWrap: "wrap" as const } satisfies CSSProperties,

  bpdDetailMeta: { display: "flex", flexDirection: "column" as const, gap: 2 } satisfies CSSProperties,

  bpdDetailMetaLabel: { fontFamily: FONT, fontSize: 12, fontWeight: 500, color: "#a1a1aa" } satisfies CSSProperties,

  bpdDetailMetaValue: { fontFamily: FONT, fontSize: 13, fontWeight: 400, color: "#3f3f46", lineHeight: "20px" } satisfies CSSProperties,

  bpdDetailDesc: { fontFamily: FONT, fontSize: 13, color: "#52525b", lineHeight: "20px", wordBreak: "break-word" as const, margin: 0 } satisfies CSSProperties,
} as const;

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */

export function BusinessFlowDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addTab = useMdiStore((st) => st.addTab);

  const [historyOpen, setHistoryOpen] = useState(true);
  const [expandedBpdId, setExpandedBpdId] = useState<string | null>("bpd-02");
  const [selectedVersionId, setSelectedVersionId] = useState<string>("bpd-02-v1");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const item = getBusinessFlowDetail(id ?? "");
  const lifecycle = item ? getLifecycleDetail(item.lifecycleId) : undefined;
  const businessArea = item ? getBusinessAreaDetail(item.businessAreaId) : undefined;

  /* 선택된 BPD 파일 & 버전 */
  const expandedBpd = MOCK_BPD_FILES.find((b) => b.id === expandedBpdId) ?? null;
  const selectedVersion = expandedBpd?.versions.find((v) => v.id === selectedVersionId) ?? expandedBpd?.versions[0] ?? null;

  /* 탭 등록 */
  useEffect(() => {
    if (!item) return;
    addTab({ id: `/sbf/business-flow/${id}`, label: item.nameKo, path: `/sbf/business-flow/${id}` });
  }, [id, addTab, item]);

  /* 페이지 헤더 */
  usePageHeader({
    breadcrumbItems: [
      { label: "SBF 관리" },
      { label: "업무Flow(D3) 관리" },
      { label: item?.nameKo ?? "" },
    ],
    title: item?.nameKo ?? "",
    idBadge: item?.businessFlowId,
    onBack: () => navigate("/sbf/business-flow"),
    actions: (
      <div style={{ display: "flex", gap: 8 }}>
        <Button size="m" variant="outlined" color="negative" onClick={() => setDeleteAlertOpen(true)}>삭제</Button>
        <Button size="m" variant="filled" color="positive" onClick={() => setEditOpen(true)}>수정</Button>
      </div>
    ),
  });

  if (!item) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "#a1a1aa", fontFamily: FONT }}>
        데이터를 찾을 수 없습니다.
      </div>
    );
  }

  /* BPD 확장 토글 */
  function toggleBpd(bpdId: string, firstVersionId: string) {
    if (expandedBpdId === bpdId) {
      setExpandedBpdId(null);
    } else {
      setExpandedBpdId(bpdId);
      setSelectedVersionId(firstVersionId);
    }
  }

  return (
    <>
    <div style={s.outer}>
      <div style={s.mainRow}>

        {/* ════════════════ 왼쪽 절반 ════════════════ */}
        <div style={s.leftHalf}>
          {/* 기본 정보 영역 */}
          <div style={s.infoPanel}>

            {/* 섹션 헤더 */}
            <div style={s.infoPanelHeader}>
              <span style={s.sectionTitle}>업무Flow(D3) 기준 정보</span>
              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                <button style={s.historyBtn} onClick={() => setHistoryOpen((v) => !v)}>
                  <ClockIcon />
                  {MOCK_HISTORY.length} History
                </button>
              </div>
            </div>

            {/* ID + 명 */}
            <div style={s.fieldRow}>
              <div style={s.field}>
                <span style={s.label}>업무Flow(D3) ID</span>
                <span style={s.value}>{item.businessFlowId}</span>
              </div>
              <div style={{ ...s.field, flex: 1 }}>
                <span style={s.label}>업무Flow(D3) 명</span>
                <span style={s.value}>{item.nameKo}</span>
              </div>
            </div>

            {/* Confluence 링크 */}
            <div style={s.fieldFull}>
              <span style={s.label}>Confluence 링크</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {MOCK_CONFLUENCE_LINKS.map((link, i) => (
                  <div key={i} style={s.confluenceRow}>
                    <LinkIcon />
                    <a href={link} target="_blank" rel="noreferrer" style={s.confluenceLink}>{link}</a>
                    <button style={s.iconBtn} title="복사" onClick={() => navigator.clipboard.writeText(link)}>
                      <CopyIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 업무(L3) */}
            <div style={s.fieldFull}>
              <span style={s.label}>업무(L3)</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {MOCK_L3_ITEMS.map((l3, i) => (
                  <div key={i} style={s.subItem}>
                    <span style={s.l3Badge}>{l3.id}</span>
                    <span style={s.subItemName}>{l3.name}</span>
                    <button style={s.iconBtnBorder} title="외부 링크"><ExternalLinkIcon /></button>
                    <button style={s.iconBtnBorder} title="상세보기"><ArrowRightIcon /></button>
                  </div>
                ))}
                {MOCK_L3_ITEMS.length === 0 && <span style={{ ...s.valueSmall, color: "#a1a1aa" }}>-</span>}
              </div>
            </div>

            {/* 화면기준정보 */}
            <div style={s.fieldFull}>
              <span style={s.label}>화면기준정보</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {MOCK_SCREEN_ITEMS.map((sc, i) => (
                  <div key={i} style={s.subItem}>
                    <span style={s.screenBadge(sc.type)}>{sc.type}</span>
                    <span style={s.screenCodeBadge}>{sc.code}</span>
                    <span style={s.subItemName}>{sc.name}</span>
                    <button style={s.iconBtnBorder} title="상세보기"><ArrowRightIcon /></button>
                  </div>
                ))}
                {MOCK_SCREEN_ITEMS.length === 0 && <span style={{ ...s.valueSmall, color: "#a1a1aa" }}>-</span>}
              </div>
            </div>

            {/* 구분 + Lifecycle(D1) 명 */}
            <div style={s.fieldRow}>
              <div style={s.field}>
                <span style={s.label}>구분</span>
                <span style={s.valueSmall}>{item.category}</span>
              </div>
              <div style={s.field}>
                <span style={s.label}>Lifecycle(D1) 명</span>
                <span style={s.valueSmall}>{item.lifecycleNameKo}</span>
              </div>
            </div>

            {/* Lifecycle(D1) 설명 */}
            <div style={s.fieldFull}>
              <span style={s.label}>Lifecycle(D1) 설명</span>
              <span style={{ ...s.valueSmall, wordBreak: "break-word" }}>
                {lifecycle?.description ?? "-"}
              </span>
            </div>

            {/* 업무영역(D2) 명 */}
            <div style={s.fieldFull}>
              <span style={s.label}>업무영역(D2) 명</span>
              <span style={s.valueSmall}>{item.businessAreaNameKo}</span>
            </div>

            {/* 업무영역(D2) 명 설명 */}
            <div style={s.fieldFull}>
              <span style={s.label}>업무영역(D2) 명 설명</span>
              <span style={{ ...s.valueSmall, wordBreak: "break-word" }}>
                {businessArea?.description ?? "-"}
              </span>
            </div>
          </div>

          {/* 히스토리 사이드 패널 */}
          {historyOpen && (
            <div style={s.historyPanel}>
              {MOCK_HISTORY.map((h, i) => {
                const isFirst = i === 0;
                const isLast  = i === MOCK_HISTORY.length - 1;
                return (
                  <div key={i} style={s.historyEntry}>
                    {/* 타임라인 마크 */}
                    <div style={s.historyMark}>
                      {!isFirst && <div style={s.historyLine} />}
                      <div style={s.historyDot} />
                      {!isLast && <div style={s.historyLine} />}
                    </div>
                    {/* 내용 */}
                    <div style={s.historyContent}>
                      <HistoryBadge type={h.type} />
                      <span style={s.historyUser}>{h.user}</span>
                      <span style={s.historyDate}>{h.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ════════════════ 오른쪽 절반: BPD 관리 ════════════════ */}
        <div style={s.rightHalf}>
          {/* BPD 관리 헤더 */}
          <div style={s.bpdHeader}>
            <span style={s.bpdHeaderTitle}>BPD 관리</span>
            <button style={s.bpdAddBtn}>
              <PlusIcon />
              BPD 추가
            </button>
          </div>

          {/* BPD 목록 + 상세 */}
          <div style={s.bpdContent}>
            {/* BPD 아코디언 목록 */}
            <div>
              {MOCK_BPD_FILES.map((bpd, bpdIdx) => {
                const isExpanded = expandedBpdId === bpd.id;
                const iconColor = bpdIdx === 0 ? "#0ba5ec" : "#7a5af8";
                return (
                  <div key={bpd.id} style={s.bpdCard}>
                    {/* 카드 헤더 */}
                    <div
                      style={s.bpdCardHeader}
                      onClick={() => toggleBpd(bpd.id, bpd.versions[0].id)}
                    >
                      <BpdFileIcon color={iconColor} />
                      <div style={s.bpdCardMeta}>
                        <div style={s.bpdCardRow1}>
                          <StateBadge state={bpd.state} />
                          <span style={s.bpdCardVersion}>{bpd.latestVersion}</span>
                          <span style={s.bpdCardName}>{bpd.name}</span>
                        </div>
                        <span style={s.bpdCardUrl}>{bpd.url}</span>
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      </div>
                    </div>

                    {/* 확장 영역 */}
                    {isExpanded && (
                      <div style={s.bpdExpanded}>
                        {/* 상단: BPD 데이터보기 버튼 */}
                        <div style={s.bpdExpandedTop}>
                          <button style={s.bpdDataBtn}>
                            BPD 데이터보기
                            <ChevronRightSmIcon />
                          </button>
                        </div>

                        {/* 버전 목록 */}
                        <div>
                          {bpd.versions.map((ver, vIdx) => {
                            const isActive = ver.id === selectedVersionId;
                            const isLastV = vIdx === bpd.versions.length - 1;
                            return (
                              <div
                                key={ver.id}
                                style={{
                                  ...s.versionRow,
                                  borderBottom: isLastV ? "none" : "1px solid #f0f0f0",
                                  cursor: "pointer",
                                  backgroundColor: isActive ? "#ffffff" : "transparent",
                                  borderRadius: isActive ? 4 : 0,
                                  padding: "8px 6px",
                                }}
                                onClick={() => setSelectedVersionId(ver.id)}
                              >
                                <div style={s.versionLeft}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <StateBadge state={ver.state} />
                                    <span style={s.versionText}>{ver.version}</span>
                                  </div>
                                  <span style={s.versionSub}>{ver.author}</span>
                                  <span style={s.versionSub}>{ver.date}</span>
                                </div>
                                {/* 오른쪽: 활성 버전은 zoom 컨트롤, 나머지는 썸네일 */}
                                {isActive ? (
                                  <div style={s.zoomControls}>
                                    <button style={s.zoomBtn} title="확대"><ZoomInIcon /></button>
                                    <button style={s.zoomBtn} title="축소"><ZoomOutIcon /></button>
                                    <button style={s.zoomBtn} title="전체 보기"><FitScreenIcon /></button>
                                  </div>
                                ) : (
                                  <BpmnThumbnail />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── BPD 상세 정보 (하단 고정) ── */}
            {selectedVersion && expandedBpd && (
              <div style={s.bpdDetail}>
                {/* 상태 + BPD 파일 명 */}
                <div style={s.bpdDetailRow}>
                  <span style={s.bpdDetailLabel}>상태</span>
                  <StateBadge state={selectedVersion.state} />
                  <span style={{ ...s.bpdDetailLabel, marginLeft: 8 }}>BPD 파일 명</span>
                  <span style={s.bpdDetailValue}>{expandedBpd.name}</span>
                </div>

                {/* Version · 작성자 · 작성일시 */}
                <div style={s.bpdDetailMetaRow}>
                  <div style={s.bpdDetailMeta}>
                    <span style={s.bpdDetailMetaLabel}>Version</span>
                    <span style={s.bpdDetailMetaValue}>{selectedVersion.version}</span>
                  </div>
                  <div style={s.bpdDetailMeta}>
                    <span style={s.bpdDetailMetaLabel}>작성자</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <UserIcon />
                      <span style={s.bpdDetailMetaValue}>{selectedVersion.author}</span>
                      <span style={{ ...s.bpdDetailMetaValue, color: "#a1a1aa" }}>Nova 추진팀</span>
                    </div>
                  </div>
                  <div style={s.bpdDetailMeta}>
                    <span style={s.bpdDetailMetaLabel}>작성일시</span>
                    <span style={s.bpdDetailMetaValue}>{selectedVersion.date}</span>
                  </div>
                </div>

                {/* Version 설명 */}
                {selectedVersion.description && (
                  <div style={s.bpdDetailMeta}>
                    <span style={s.bpdDetailMetaLabel}>Version 설명</span>
                    <p style={s.bpdDetailDesc}>{selectedVersion.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>

    {/* 수정 팝업 */}
    <BusinessFlowEditPopup
      open={editOpen}
      onClose={() => setEditOpen(false)}
      data={item ?? null}
    />

    {/* 삭제 확인 AlertModal */}
    <AlertModal
      open={deleteAlertOpen}
      onClose={() => setDeleteAlertOpen(false)}
      type="warning"
      message={<>등록된 정보를 삭제하시겠습니까?<br />이 작업은 복구할 수 없습니다.</>}
      showCancel={true}
      cancelLabel="취소"
      confirmLabel="확인"
      onCancel={() => setDeleteAlertOpen(false)}
      onConfirm={() => {
        setDeleteAlertOpen(false);
        navigate("/sbf/business-flow");
      }}
    />
    </>
  );
}
