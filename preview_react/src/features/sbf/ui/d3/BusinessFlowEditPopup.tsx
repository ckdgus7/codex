import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Button } from "@/shared/ui/global/Button";
import { Input } from "@/shared/ui/global/Input";
import { SelectBox } from "@/shared/ui/global/SelectBox";
import { AlertModal } from "@/shared/ui/global/AlertModal";
import { Snackbar } from "@/shared/ui/global/Snackbar";
import { popupStyles } from "@/shared/ui/styles";
import { BUSINESS_FLOW_MOCK_DATA } from "@/features/sbf/model/mock-data";
import type { BusinessFlowItem } from "@/features/sbf/model/types";
import type { BusinessFlowFormData } from "@/features/sbf/ui/d3/BusinessFlowCreatePopup";

/* ────────────────────────────────────
   Types
──────────────────────────────────── */
interface L3Item {
  id: string;
  name: string;
}

interface ScreenItem {
  type: "Screen" | "Component";
  code: string;
  name: string;
}

export interface BusinessFlowEditPopupProps {
  open: boolean;
  onClose: () => void;
  data: BusinessFlowItem | null;
  onSave?: (data: BusinessFlowFormData) => void;
}

/* ────────────────────────────────────
   Constants
──────────────────────────────────── */
const FONT = "Pretendard, sans-serif";
const NAME_MAX = 70;
const L3_MAX = 10;
const SCREEN_MAX = 10;

const L3_OPTIONS = [
  { label: "BZ-PTYTMFC028-0022 대리점정보관리", value: "BZ-PTYTMFC028-0022" },
  { label: "BZ-001 주문 관리", value: "BZ-001" },
  { label: "BZ-002 결제 처리", value: "BZ-002" },
  { label: "BZ-003 배송 추적", value: "BZ-003" },
  { label: "BZ-004 고객 문의", value: "BZ-004" },
  { label: "BZ-005 서비스 신청", value: "BZ-005" },
  { label: "BZ-006 계정 설정", value: "BZ-006" },
  { label: "BZ-007 보고서 조회", value: "BZ-007" },
  { label: "BZ-008 알림 관리", value: "BZ-008" },
  { label: "BZ-009 권한 관리", value: "BZ-009" },
];

const SCREEN_OPTIONS = [
  { label: "FD-UM6M020 [T] 작업 요청 조회", value: "FD-UM6M020|Screen" },
  { label: "FD-UM04002 [T] 작업 관리", value: "FD-UM04002|Screen" },
  { label: "SSF016 업무(L3)/기능(L4)/상세기능(L5) SSF 매핑 관리", value: "SSF016|Component" },
  { label: "SCR-001 메인 화면", value: "SCR-001|Screen" },
  { label: "SCR-002 로그인 화면", value: "SCR-002|Screen" },
  { label: "SCR-003 대시보드", value: "SCR-003|Screen" },
  { label: "SCR-004 설정 화면", value: "SCR-004|Screen" },
];

/* initial mock list items matching the Figma screenshot */
const INIT_L3: L3Item[] = [
  { id: "BZ-PTYTMFC028-0022", name: "대리점정보관리" },
];

const INIT_SCREENS: ScreenItem[] = [
  { type: "Screen",    code: "FD-UM6M020", name: "[T] 작업 요청 조회" },
  { type: "Screen",    code: "FD-UM04002", name: "[T] 작업 관리" },
  { type: "Component", code: "SSF016",     name: "업무(L3)/기능(L4)/상세기능(L5) SSF 매핑 관리" },
];

const INIT_CONFLUENCE = [
  "https://doss.sktelecom.com/wiki2/pages/viewpage.action?pageId=234567890",
];

/* ────────────────────────────────────
   Icons
──────────────────────────────────── */
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 5L15 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 5L5 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7" stroke="#f04438" strokeWidth="1.2" />
      <path d="M8 5V8.5" stroke="#f04438" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="10.5" r="0.7" fill="#f04438" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7" stroke="#17b26a" strokeWidth="1.2" />
      <path d="M4.5 8L6.5 10L11.5 5.5" stroke="#17b26a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="6" stroke="#a1a1aa" strokeWidth="1.1" />
      <path d="M7 6V9.5" stroke="#a1a1aa" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="7" cy="4.5" r="0.6" fill="#a1a1aa" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6H10" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ────────────────────────────────────
   Styles
──────────────────────────────────── */
const s: Record<string, CSSProperties> = {
  overlay:      { ...popupStyles.overlay, zIndex: 10000 },
  popup: {
    width: 880, maxHeight: "90vh",
    backgroundColor: "#ffffff", borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: FONT,
  },
  header: {
    display: "flex", flexDirection: "column",
    padding: "32px 32px 16px 32px", gap: 12, flexShrink: 0,
    borderBottom: "1px solid #f4f4f5",
  },
  titleRow:  { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" },
  titleText: { fontFamily: FONT, fontSize: 24, fontWeight: 700, lineHeight: "32px", color: "#52525b" },
  closeBtn:  { ...popupStyles.closeBtn },
  reqRow:    { display: "flex", alignItems: "center", gap: 4 },
  reqDot:    { width: 6, height: 6, borderRadius: 3, backgroundColor: "#36bffa", flexShrink: 0 },
  reqText:   { fontFamily: FONT, fontSize: 14, fontWeight: 400, color: "#52525b" },

  main: {
    display: "flex", flexDirection: "column", gap: 24,
    padding: "24px 32px", overflowY: "auto", flex: 1,
  },
  fieldGroup:   { display: "flex", flexDirection: "column", gap: 8, width: "100%" },
  labelRow:     { display: "flex", alignItems: "center", gap: 4 },
  labelText:    { fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "#a1a1aa", whiteSpace: "nowrap" },
  reqMark:      { width: 6, height: 6, borderRadius: 3, backgroundColor: "#36bffa", flexShrink: 0 },

  disabledField: {
    display: "flex", alignItems: "center",
    width: "100%", height: 40, padding: "0 12px",
    backgroundColor: "#f4f4f5", border: "1px solid #e4e4e7",
    borderRadius: 4, boxSizing: "border-box",
    fontFamily: FONT, fontSize: 14, color: "#a1a1aa",
  },

  inputWithBtn:  { display: "flex", alignItems: "flex-start", gap: 8, width: "100%" },
  selectWithBtn: { display: "flex", alignItems: "flex-start", gap: 8, width: "100%" },

  alertRow:    { display: "flex", alignItems: "flex-start", gap: 6 },
  alertText:   { fontFamily: FONT, fontSize: 12, color: "#f04438", flex: 1 },
  successText: { fontFamily: FONT, fontSize: 12, color: "#17b26a", flex: 1 },
  infoRow:     { display: "flex", alignItems: "center", gap: 6 },
  infoText:    { fontFamily: FONT, fontSize: 12, color: "#a1a1aa" },

  itemList: { display: "flex", flexDirection: "column", gap: 4, width: "100%" },
  item: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 12px",
    backgroundColor: "#fafaff", border: "1px solid #e4e4e7",
    borderRadius: 4, boxSizing: "border-box", width: "100%",
  },
  itemText: {
    fontFamily: FONT, fontSize: 14, color: "#3f3f46",
    flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  removeBtn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 24, height: 24, border: "1px solid #e4e4e7",
    background: "#ffffff", borderRadius: 4,
    cursor: "pointer", flexShrink: 0, padding: 0,
  },

  footer: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 32px 32px 32px", flexShrink: 0,
    borderTop: "1px solid #f4f4f5",
  },
};

/* badge helper */
function Badge({ text, color }: { text: string; color: "purple" | "green" | "orange" | "grey" }) {
  const map = {
    purple: { background: "#f5f3ff", color: "#6941c6", border: "#d6bbfb" },
    green:  { background: "#ecfdf3", color: "#067647", border: "#abefc6" },
    orange: { background: "#fffaeb", color: "#b54708", border: "#fec84b" },
    grey:   { background: "#f4f4f5", color: "#71717a", border: "#e4e4e7" },
  }[color];
  return (
    <span style={{
      fontFamily: FONT, fontSize: 11, fontWeight: 600,
      padding: "2px 7px", borderRadius: 4, flexShrink: 0,
      whiteSpace: "nowrap",
      backgroundColor: map.background, color: map.color, border: `1px solid ${map.border}`,
    }}>
      {text}
    </span>
  );
}

/* ────────────────────────────────────
   Component
──────────────────────────────────── */
export function BusinessFlowEditPopup({ open, onClose, data, onSave }: BusinessFlowEditPopupProps) {
  /* editable fields */
  const [nameKo,         setNameKo]         = useState("");
  const [businessFlowId, setBusinessFlowId] = useState("");
  const [idDupStatus,    setIdDupStatus]    = useState<"idle" | "ok" | "dup" | "empty">("idle");

  /* confluence */
  const [confluenceInput, setConfluenceInput] = useState("");
  const [confluenceLinks, setConfluenceLinks] = useState<string[]>([]);

  /* L3 */
  const [selectedL3, setSelectedL3] = useState("");
  const [l3Items,    setL3Items]    = useState<L3Item[]>([]);

  /* 화면기준정보 */
  const [selectedScreen, setSelectedScreen] = useState("");
  const [screenItems,    setScreenItems]    = useState<ScreenItem[]>([]);

  /* validation / modal */
  const [nameError,      setNameError]      = useState<"required" | null>(null);
  const [idError,        setIdError]        = useState(false);
  const [closeAlert,     setCloseAlert]     = useState(false);
  const [snackbarOpen,   setSnackbarOpen]   = useState(false);

  /* store originals for dirty check */
  const origRef = useRef({ nameKo: "", businessFlowId: "", confluenceLinks: INIT_CONFLUENCE, l3Items: INIT_L3, screenItems: INIT_SCREENS });

  useEffect(() => {
    if (open && data) {
      setNameKo(data.nameKo);
      setBusinessFlowId(data.businessFlowId);
      setIdDupStatus("idle");
      setConfluenceInput("");
      setConfluenceLinks([...INIT_CONFLUENCE]);
      setSelectedL3("");
      setL3Items([...INIT_L3]);
      setSelectedScreen("");
      setScreenItems([...INIT_SCREENS]);
      setNameError(null);
      setIdError(false);
      origRef.current = {
        nameKo: data.nameKo,
        businessFlowId: data.businessFlowId,
        confluenceLinks: [...INIT_CONFLUENCE],
        l3Items: [...INIT_L3],
        screenItems: [...INIT_SCREENS],
      };
    }
  }, [open, data]);

  /* helpers */
  const serializeL3    = (items: L3Item[])     => JSON.stringify(items);
  const serializeScr   = (items: ScreenItem[]) => JSON.stringify(items);

  const isDirty =
    nameKo !== origRef.current.nameKo ||
    businessFlowId !== origRef.current.businessFlowId ||
    JSON.stringify(confluenceLinks) !== JSON.stringify(origRef.current.confluenceLinks) ||
    serializeL3(l3Items) !== serializeL3(origRef.current.l3Items) ||
    serializeScr(screenItems) !== serializeScr(origRef.current.screenItems);

  const canSave = isDirty && nameKo.trim().length > 0 && businessFlowId.trim().length > 0;

  /* duplicate check excludes the current item's own ID */
  const existingIds = new Set(
    BUSINESS_FLOW_MOCK_DATA
      .filter((bf) => bf.businessFlowId !== data?.businessFlowId)
      .map((bf) => bf.businessFlowId)
  );

  if (!open && !snackbarOpen) return null;
  if (!data) return null;

  /* handlers */
  const handleClose = () => {
    if (isDirty) setCloseAlert(true);
    else onClose();
  };

  const handleCloseConfirm = () => {
    setCloseAlert(false);
    onClose();
  };

  const handleDupCheck = () => {
    const val = businessFlowId.trim();
    if (!val) { setIdDupStatus("empty"); return; }
    setIdDupStatus(existingIds.has(val) ? "dup" : "ok");
  };

  const handleAddConfluence = () => {
    const val = confluenceInput.trim();
    if (!val) return;
    setConfluenceLinks([...confluenceLinks, val]);
    setConfluenceInput("");
  };

  const handleAddL3 = () => {
    if (!selectedL3 || l3Items.length >= L3_MAX) return;
    const opt = L3_OPTIONS.find((o) => o.value === selectedL3);
    if (!opt) return;
    const id   = opt.value;
    const name = opt.label.replace(`${id} `, "");
    if (!l3Items.find((x) => x.id === id)) {
      setL3Items([...l3Items, { id, name }]);
    }
    setSelectedL3("");
  };

  const handleAddScreen = () => {
    if (!selectedScreen || screenItems.length >= SCREEN_MAX) return;
    const [code, type] = selectedScreen.split("|") as [string, "Screen" | "Component"];
    const opt = SCREEN_OPTIONS.find((o) => o.value === selectedScreen);
    if (!opt) return;
    const name = opt.label.replace(`${code} `, "");
    if (!screenItems.find((x) => x.code === code)) {
      setScreenItems([...screenItems, { type, code, name }]);
    }
    setSelectedScreen("");
  };

  const handleSave = () => {
    let valid = true;
    if (!nameKo.trim()) { setNameError("required"); valid = false; } else setNameError(null);
    if (!businessFlowId.trim()) { setIdError(true); valid = false; } else setIdError(false);
    if (!valid) return;

    onSave?.({
      businessAreaId: data.businessAreaId,
      businessAreaNameKo: data.businessAreaNameKo,
      category: data.category,
      lifecycleNameKo: data.lifecycleNameKo,
      nameKo,
      businessFlowId,
      confluenceLinks,
      l3Items: l3Items.map((x) => `${x.id} ${x.name}`),
      screenInfoItems: screenItems.map((x) => `${x.code} ${x.name}`),
    });
    setSnackbarOpen(true);
    onClose();
  };

  const l3Full     = l3Items.length >= L3_MAX;
  const screenFull = screenItems.length >= SCREEN_MAX;

  /* available options (exclude already added) */
  const l3Available     = L3_OPTIONS.filter((o) => !l3Items.find((x) => x.id === o.value));
  const screenAvailable = SCREEN_OPTIONS.filter((o) => {
    const code = o.value.split("|")[0];
    return !screenItems.find((x) => x.code === code);
  });

  return (
    <>
      {open && (
        <div style={s.overlay} onClick={handleClose}>
          <div style={s.popup} onClick={(e) => e.stopPropagation()}>

            {/* ── 헤더 ── */}
            <div style={s.header}>
              <div style={s.titleRow}>
                <span style={s.titleText}>업무Flow(D3) 수정</span>
                <button style={s.closeBtn} onClick={handleClose} aria-label="닫기">
                  <CloseIcon />
                </button>
              </div>
              <div style={s.reqRow}>
                <div style={s.reqDot} />
                <span style={s.reqText}>표시는 필수로 입력하세요.</span>
              </div>
            </div>

            {/* ── 본문 ── */}
            <div style={s.main}>

              {/* 1. 업무영역(D2) 명 — 비활성 */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>업무영역(D2) 명</span>
                </div>
                <div style={s.disabledField}>{data.businessAreaNameKo}</div>
              </div>

              {/* 2. 구분 — 비활성 */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>구분</span>
                </div>
                <div style={s.disabledField}>{data.category}</div>
              </div>

              {/* 3. Lifecycle(D1) — 비활성 */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>Lifecycle(D1)</span>
                </div>
                <div style={s.disabledField}>{data.lifecycleNameKo}</div>
              </div>

              {/* 4. 업무Flow(D3) 명 */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>업무Flow(D3) 명</span>
                  <div style={s.reqMark} />
                </div>
                <Input
                  value={nameKo}
                  onChange={(e) => {
                    const v = e.target.value.slice(0, NAME_MAX);
                    setNameKo(v);
                    if (nameError && v.trim()) setNameError(null);
                  }}
                  placeholder="업무Flow(D3) 명을 입력하세요."
                  indicator={`${nameKo.length}/${NAME_MAX}`}
                  maxLength={NAME_MAX}
                  error={!!nameError}
                />
                {nameError === "required" && (
                  <div style={s.alertRow}>
                    <AlertIcon />
                    <span style={s.alertText}>업무Flow(D3) 명을 입력하세요.</span>
                  </div>
                )}
              </div>

              {/* 5. 업무Flow(D3) ID */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>업무Flow(D3) ID</span>
                  <div style={s.reqMark} />
                </div>
                <div style={s.inputWithBtn}>
                  <div style={{ flex: 1 }}>
                    <Input
                      value={businessFlowId}
                      onChange={(e) => {
                        setBusinessFlowId(e.target.value);
                        setIdDupStatus("idle");
                        if (idError && e.target.value.trim()) setIdError(false);
                      }}
                      placeholder="업무Flow(D3) ID를 입력하세요."
                      error={idError || idDupStatus === "dup"}
                    />
                  </div>
                  <Button size="l" variant="outlined" color="info" onClick={handleDupCheck}>
                    중복 조회
                  </Button>
                </div>
                {idError && (
                  <div style={s.alertRow}><AlertIcon /><span style={s.alertText}>업무Flow(D3) ID를 입력하세요.</span></div>
                )}
                {!idError && idDupStatus === "empty" && (
                  <div style={s.alertRow}><AlertIcon /><span style={s.alertText}>업무Flow(D3) ID를 입력하세요.</span></div>
                )}
                {!idError && idDupStatus === "dup" && (
                  <div style={s.alertRow}><AlertIcon /><span style={s.alertText}>이미 사용 중인 ID입니다.</span></div>
                )}
                {!idError && idDupStatus === "ok" && (
                  <div style={s.alertRow}><CheckIcon /><span style={s.successText}>사용 가능한 ID입니다.</span></div>
                )}
              </div>

              {/* 6. Confluence 링크 */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>Confluence 링크</span>
                  <div style={s.reqMark} />
                </div>
                <div style={s.inputWithBtn}>
                  <div style={{ flex: 1 }}>
                    <Input
                      value={confluenceInput}
                      onChange={(e) => setConfluenceInput(e.target.value)}
                      placeholder="Confluence 링크를 입력하세요."
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddConfluence(); }}
                    />
                  </div>
                  <Button
                    size="l" variant="outlined" color="positive"
                    onClick={handleAddConfluence}
                    disabled={!confluenceInput.trim()}
                  >
                    + 추가
                  </Button>
                </div>
                <div style={s.infoRow}>
                  <InfoIcon />
                  <span style={s.infoText}>Confluence 링크를 1개 이상 추가할 수 있습니다.</span>
                </div>
                {confluenceLinks.length > 0 && (
                  <div style={s.itemList}>
                    {confluenceLinks.map((link, i) => (
                      <div key={i} style={s.item}>
                        <span style={{ ...s.itemText, color: "#7a5af8" }}>{link}</span>
                        <button style={s.removeBtn} onClick={() => setConfluenceLinks(confluenceLinks.filter((_, j) => j !== i))}>
                          <MinusIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 7. 업무(L3) */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>업무(L3)</span>
                </div>
                <div style={s.selectWithBtn}>
                  <div style={{ flex: 1 }}>
                    <SelectBox
                      value={selectedL3}
                      onChange={setSelectedL3}
                      options={l3Available}
                      placeholder="업무(L3)를 선택하거나 검색할 수 있습니다."
                      searchable
                      searchPlaceholder="업무(L3) 검색"
                      disabled={l3Full}
                    />
                  </div>
                  <Button
                    size="l" variant="outlined" color="positive"
                    onClick={handleAddL3}
                    disabled={!selectedL3 || l3Full}
                  >
                    + 추가
                  </Button>
                </div>
                {l3Items.length > 0 && (
                  <div style={s.itemList}>
                    {l3Items.map((x, i) => (
                      <div key={i} style={s.item}>
                        <Badge text={x.id} color="purple" />
                        <span style={s.itemText}>{x.name}</span>
                        <button style={s.removeBtn} onClick={() => setL3Items(l3Items.filter((_, j) => j !== i))}>
                          <MinusIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 8. 화면기준정보 */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>화면기준정보</span>
                </div>
                <div style={s.selectWithBtn}>
                  <div style={{ flex: 1 }}>
                    <SelectBox
                      value={selectedScreen}
                      onChange={setSelectedScreen}
                      options={screenAvailable}
                      placeholder="화면기준정보를 선택하거나 검색할 수 있습니다."
                      searchable
                      searchPlaceholder="화면기준정보 검색"
                      disabled={screenFull}
                    />
                  </div>
                  <Button
                    size="l" variant="outlined" color="positive"
                    onClick={handleAddScreen}
                    disabled={!selectedScreen || screenFull}
                  >
                    + 추가
                  </Button>
                </div>
                {screenItems.length > 0 && (
                  <div style={s.itemList}>
                    {screenItems.map((x, i) => (
                      <div key={i} style={s.item}>
                        <Badge text={x.type} color={x.type === "Screen" ? "green" : "purple"} />
                        <Badge text={x.code} color="orange" />
                        <span style={s.itemText}>{x.name}</span>
                        <button style={s.removeBtn} onClick={() => setScreenItems(screenItems.filter((_, j) => j !== i))}>
                          <MinusIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>{/* /main */}

            {/* ── 푸터 ── */}
            <div style={s.footer}>
              <Button size="l" variant="outlined" color="info" onClick={handleClose}>
                닫기
              </Button>
              <Button size="l" variant="filled" color="positive" onClick={handleSave} disabled={!canSave}>
                저장
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* 닫기 확인 AlertModal */}
      {open && (
        <AlertModal
          open={closeAlert}
          onClose={() => setCloseAlert(false)}
          type="warning"
          message="변경된 사항을 저장하지 않고 창을 닫습니다."
          confirmLabel="확인"
          cancelLabel="취소"
          showCancel
          onConfirm={handleCloseConfirm}
          onCancel={() => setCloseAlert(false)}
          zIndex={10001}
        />
      )}

      {/* 저장 완료 Snackbar */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message="저장 되었습니다."
        type="success"
      />
    </>
  );
}
