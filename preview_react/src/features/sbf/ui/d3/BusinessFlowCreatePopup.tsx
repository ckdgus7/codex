import { useState, type CSSProperties } from "react";
import { Button } from "@/shared/ui/global/Button";
import { Input } from "@/shared/ui/global/Input";
import { SelectBox } from "@/shared/ui/global/SelectBox";
import { AlertModal } from "@/shared/ui/global/AlertModal";
import { Snackbar } from "@/shared/ui/global/Snackbar";
import { popupStyles } from "@/shared/ui/styles";
import {
  BUSINESS_AREA_MOCK_DATA,
  BUSINESS_FLOW_MOCK_DATA,
} from "@/features/sbf/model/mock-data";

export interface BusinessFlowFormData {
  businessAreaId: string;
  businessAreaNameKo: string;
  category: string;
  lifecycleNameKo: string;
  nameKo: string;
  businessFlowId: string;
  confluenceLinks: string[];
  l3Items: string[];
  screenInfoItems: string[];
}

interface BusinessFlowCreatePopupProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: BusinessFlowFormData) => void;
}

const FONT_FAMILY = "Pretendard, sans-serif";

const NAME_MAX = 70;
const CONFLUENCE_MAX = 5;
const L3_MAX = 10;
const SCREEN_MAX = 10;

const BUSINESS_AREA_OPTIONS = BUSINESS_AREA_MOCK_DATA.map((ba) => ({
  label: ba.nameKo,
  value: ba.businessAreaId,
}));

const L3_OPTIONS = [
  { label: "L3-001 주문 관리", value: "L3-001" },
  { label: "L3-002 결제 처리", value: "L3-002" },
  { label: "L3-003 배송 추적", value: "L3-003" },
  { label: "L3-004 고객 문의", value: "L3-004" },
  { label: "L3-005 서비스 신청", value: "L3-005" },
  { label: "L3-006 계정 설정", value: "L3-006" },
  { label: "L3-007 보고서 조회", value: "L3-007" },
  { label: "L3-008 알림 관리", value: "L3-008" },
  { label: "L3-009 권한 관리", value: "L3-009" },
  { label: "L3-010 감사 로그", value: "L3-010" },
];

const SCREEN_INFO_OPTIONS = [
  { label: "SCR-001 메인 화면", value: "SCR-001" },
  { label: "SCR-002 로그인 화면", value: "SCR-002" },
  { label: "SCR-003 대시보드", value: "SCR-003" },
  { label: "SCR-004 설정 화면", value: "SCR-004" },
  { label: "SCR-005 사용자 관리 화면", value: "SCR-005" },
  { label: "SCR-006 보고서 화면", value: "SCR-006" },
  { label: "SCR-007 알림 화면", value: "SCR-007" },
  { label: "SCR-008 권한 설정 화면", value: "SCR-008" },
];

const EXISTING_IDS = new Set(BUSINESS_FLOW_MOCK_DATA.map((bf) => bf.businessFlowId));

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
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="8" stroke="#f04438" strokeWidth="1.2" />
      <path d="M9 5.5V9.5" stroke="#f04438" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="9" cy="12" r="0.8" fill="#f04438" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="7" stroke="#a1a1aa" strokeWidth="1.2" />
      <path d="M8 7V11" stroke="#a1a1aa" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="5.5" r="0.7" fill="#a1a1aa" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 3L11 11" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M11 3L3 11" stroke="#71717a" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const s: Record<string, CSSProperties> = {
  overlay: {
    ...popupStyles.overlay,
    zIndex: 10000,
  },
  popup: {
    width: 880,
    maxHeight: "90vh",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: FONT_FAMILY,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    padding: "32px 32px 16px 32px",
    gap: 12,
    flexShrink: 0,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  titleText: {
    fontFamily: FONT_FAMILY,
    fontSize: 24,
    fontWeight: 700,
    lineHeight: "32px",
    color: "#52525b",
  },
  closeBtn: {
    ...popupStyles.closeBtn,
  },
  requiredRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  requiredDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#36bffa",
    flexShrink: 0,
  },
  requiredText: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "18px",
    color: "#52525b",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: "24px 32px",
    overflowY: "auto",
    flex: 1,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
  },
  labelRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  labelText: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "18px",
    color: "#a1a1aa",
  },
  requiredMark: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#36bffa",
    flexShrink: 0,
  },
  inputWithBtn: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    width: "100%",
  },
  selectWithBtn: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    width: "100%",
  },
  disabledField: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: 40,
    padding: "0 12px",
    backgroundColor: "#f4f4f5",
    border: "1px solid #e4e4e7",
    borderRadius: 4,
    boxSizing: "border-box",
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "20px",
    color: "#a1a1aa",
  },
  alertRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 6,
  },
  alertText: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    fontWeight: 400,
    lineHeight: "18px",
    color: "#f04438",
    flex: 1,
  },
  successText: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    fontWeight: 400,
    lineHeight: "18px",
    color: "#17b26a",
    flex: 1,
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    fontWeight: 400,
    lineHeight: "18px",
    color: "#a1a1aa",
  },
  addedItemList: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    width: "100%",
  },
  addedItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    backgroundColor: "#fafaff",
    border: "1px solid #e4e4e7",
    borderRadius: 4,
    boxSizing: "border-box",
    width: "100%",
  },
  addedItemText: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "20px",
    color: "#3f3f46",
    flex: 1,
    wordBreak: "break-all" as const,
  },
  removeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    border: "none",
    background: "none",
    cursor: "pointer",
    flexShrink: 0,
    borderRadius: 4,
    padding: 0,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px 32px 32px",
    flexShrink: 0,
  },
};

export function BusinessFlowCreatePopup({
  open,
  onClose,
  onSave,
}: BusinessFlowCreatePopupProps) {
  const [businessAreaId, setBusinessAreaId] = useState("");
  const [category, setCategory] = useState("");
  const [lifecycleNameKo, setLifecycleNameKo] = useState("");
  const [nameKo, setNameKo] = useState("");
  const [businessFlowId, setBusinessFlowId] = useState("");
  const [idDupStatus, setIdDupStatus] = useState<"idle" | "ok" | "dup" | "empty">("idle");
  const [confluenceInput, setConfluenceInput] = useState("");
  const [confluenceLinks, setConfluenceLinks] = useState<string[]>([]);
  const [selectedL3, setSelectedL3] = useState("");
  const [l3Items, setL3Items] = useState<string[]>([]);
  const [selectedScreenInfo, setSelectedScreenInfo] = useState("");
  const [screenInfoItems, setScreenInfoItems] = useState<string[]>([]);
  const [nameError, setNameError] = useState<"required" | null>(null);
  const [idError, setIdError] = useState(false);
  const [closeAlertOpen, setCloseAlertOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isDirty =
    !!businessAreaId ||
    !!nameKo ||
    !!businessFlowId ||
    confluenceLinks.length > 0 ||
    l3Items.length > 0 ||
    screenInfoItems.length > 0;

  const canSave =
    !!businessAreaId &&
    nameKo.trim().length > 0 &&
    businessFlowId.trim().length > 0 &&
    confluenceLinks.length >= 1;

  if (!open && !snackbarOpen) return null;

  const resetForm = () => {
    setBusinessAreaId("");
    setCategory("");
    setLifecycleNameKo("");
    setNameKo("");
    setBusinessFlowId("");
    setIdDupStatus("idle");
    setConfluenceInput("");
    setConfluenceLinks([]);
    setSelectedL3("");
    setL3Items([]);
    setSelectedScreenInfo("");
    setScreenInfoItems([]);
    setNameError(null);
    setIdError(false);
  };

  const handleBusinessAreaChange = (id: string) => {
    setBusinessAreaId(id);
    const found = BUSINESS_AREA_MOCK_DATA.find((ba) => ba.businessAreaId === id);
    setCategory(found?.category || "");
    setLifecycleNameKo(found?.lifecycleNameKo || "");
  };

  const handleClose = () => {
    if (isDirty) {
      setCloseAlertOpen(true);
    } else {
      onClose();
    }
  };

  const handleCloseConfirm = () => {
    setCloseAlertOpen(false);
    resetForm();
    onClose();
  };

  const handleDuplicateCheck = () => {
    if (!businessFlowId.trim()) {
      setIdDupStatus("empty");
      return;
    }
    if (EXISTING_IDS.has(businessFlowId.trim())) {
      setIdDupStatus("dup");
    } else {
      setIdDupStatus("ok");
    }
  };

  const handleAddConfluence = () => {
    const val = confluenceInput.trim();
    if (!val || confluenceLinks.length >= CONFLUENCE_MAX) return;
    setConfluenceLinks([...confluenceLinks, val]);
    setConfluenceInput("");
  };

  const handleRemoveConfluence = (idx: number) => {
    setConfluenceLinks(confluenceLinks.filter((_, i) => i !== idx));
  };

  const handleAddL3 = () => {
    if (!selectedL3 || l3Items.length >= L3_MAX) return;
    const label = L3_OPTIONS.find((o) => o.value === selectedL3)?.label || selectedL3;
    if (!l3Items.includes(label)) {
      setL3Items([...l3Items, label]);
    }
    setSelectedL3("");
  };

  const handleRemoveL3 = (idx: number) => {
    setL3Items(l3Items.filter((_, i) => i !== idx));
  };

  const handleAddScreenInfo = () => {
    if (!selectedScreenInfo || screenInfoItems.length >= SCREEN_MAX) return;
    const label =
      SCREEN_INFO_OPTIONS.find((o) => o.value === selectedScreenInfo)?.label || selectedScreenInfo;
    if (!screenInfoItems.includes(label)) {
      setScreenInfoItems([...screenInfoItems, label]);
    }
    setSelectedScreenInfo("");
  };

  const handleRemoveScreenInfo = (idx: number) => {
    setScreenInfoItems(screenInfoItems.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    let valid = true;

    if (!nameKo.trim()) {
      setNameError("required");
      valid = false;
    } else {
      setNameError(null);
    }

    if (!businessFlowId.trim()) {
      setIdError(true);
      valid = false;
    } else {
      setIdError(false);
    }

    if (!valid) return;

    const selectedArea = BUSINESS_AREA_MOCK_DATA.find(
      (ba) => ba.businessAreaId === businessAreaId
    );

    const data: BusinessFlowFormData = {
      businessAreaId,
      businessAreaNameKo: selectedArea?.nameKo || "",
      category,
      lifecycleNameKo,
      nameKo,
      businessFlowId,
      confluenceLinks,
      l3Items,
      screenInfoItems,
    };

    onSave?.(data);
    setSnackbarOpen(true);
    onClose();
  };

  const confluenceFull = confluenceLinks.length >= CONFLUENCE_MAX;
  const l3Full = l3Items.length >= L3_MAX;
  const screenFull = screenInfoItems.length >= SCREEN_MAX;

  return (
    <>
      {open && (
        <div style={s.overlay} onClick={handleClose}>
          <div style={s.popup} onClick={(e) => e.stopPropagation()}>
            <div style={s.header}>
              <div style={s.titleRow}>
                <span style={s.titleText}>업무Flow(D3) 신규 등록</span>
                <button style={s.closeBtn} onClick={handleClose} aria-label="닫기">
                  <CloseIcon />
                </button>
              </div>
              <div style={s.requiredRow}>
                <div style={s.requiredDot} />
                <span style={s.requiredText}>표시는 필수로 입력하세요.</span>
              </div>
            </div>

            <div style={s.main}>
              {/* 업무영역(D2) */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>업무영역(D2)</span>
                  <div style={s.requiredMark} />
                </div>
                <SelectBox
                  value={businessAreaId}
                  onChange={handleBusinessAreaChange}
                  options={BUSINESS_AREA_OPTIONS}
                  placeholder="업무영역(D2) 명을 선택하거나 검색하세요."
                  searchable
                  searchPlaceholder="업무영역(D2) 검색"
                  searchHighlight
                />
              </div>

              {/* 구분 (auto) */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>구분</span>
                  <div style={s.requiredMark} />
                </div>
                <div style={s.disabledField}>
                  {category || "업무영역(D2) 선택 시 출력됩니다."}
                </div>
              </div>

              {/* Lifecycle(D1) (auto) */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>Lifecycle(D1)</span>
                  <div style={s.requiredMark} />
                </div>
                <div style={s.disabledField}>
                  {lifecycleNameKo || "업무영역(D2) 선택 시 출력됩니다."}
                </div>
              </div>

              {/* 업무Flow(D3) 명 */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>업무Flow(D3) 명</span>
                  <div style={s.requiredMark} />
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

              {/* 업무Flow(D3) ID */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>업무Flow(D3) ID</span>
                  <div style={s.requiredMark} />
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
                  <Button
                    size="l"
                    variant="outlined"
                    color="info"
                    onClick={handleDuplicateCheck}
                  >
                    중복 조회
                  </Button>
                </div>
                {idError && (
                  <div style={s.alertRow}>
                    <AlertIcon />
                    <span style={s.alertText}>업무Flow(D3) ID를 입력하세요.</span>
                  </div>
                )}
                {!idError && idDupStatus === "empty" && (
                  <div style={s.alertRow}>
                    <AlertIcon />
                    <span style={s.alertText}>업무Flow(D3) ID를 입력하세요.</span>
                  </div>
                )}
                {!idError && idDupStatus === "dup" && (
                  <div style={s.alertRow}>
                    <AlertIcon />
                    <span style={s.alertText}>이미 사용 중인 ID입니다.</span>
                  </div>
                )}
                {!idError && idDupStatus === "ok" && (
                  <div style={s.alertRow}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="9" cy="9" r="8" stroke="#17b26a" strokeWidth="1.2" />
                      <path d="M5.5 9L7.5 11L12.5 6.5" stroke="#17b26a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={s.successText}>사용 가능한 ID입니다.</span>
                  </div>
                )}
              </div>

              {/* Confluence 링크 */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>Confluence 링크</span>
                  <div style={s.requiredMark} />
                </div>
                <div style={s.inputWithBtn}>
                  <div style={{ flex: 1 }}>
                    <Input
                      value={confluenceInput}
                      onChange={(e) => setConfluenceInput(e.target.value)}
                      placeholder="Confluence 링크를 입력하세요."
                      disabled={confluenceFull}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddConfluence();
                      }}
                    />
                  </div>
                  <Button
                    size="l"
                    variant="outlined"
                    color="positive"
                    onClick={handleAddConfluence}
                    disabled={!confluenceInput.trim() || confluenceFull}
                  >
                    + 추가
                  </Button>
                </div>
                <div style={s.infoRow}>
                  <InfoIcon />
                  <span style={s.infoText}>
                    Confluence 링크를 1개 이상 추가할 수 있습니다.
                  </span>
                </div>
                {confluenceLinks.length > 0 && (
                  <div style={s.addedItemList}>
                    {confluenceLinks.map((link, idx) => (
                      <div key={idx} style={s.addedItem}>
                        <span style={s.addedItemText}>{link}</span>
                        <button
                          style={s.removeBtn}
                          onClick={() => handleRemoveConfluence(idx)}
                          aria-label="삭제"
                        >
                          <RemoveIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 연관 업무(L3) */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>연관 업무(L3)</span>
                </div>
                <div style={s.selectWithBtn}>
                  <div style={{ flex: 1 }}>
                    <SelectBox
                      value={selectedL3}
                      onChange={setSelectedL3}
                      options={L3_OPTIONS.filter(
                        (o) =>
                          !l3Items.includes(o.label)
                      )}
                      placeholder="연관 업무(L3)를 선택하거나 검색할 수 있습니다."
                      searchable
                      searchPlaceholder="업무(L3) 검색"
                      disabled={l3Full}
                    />
                  </div>
                  <Button
                    size="l"
                    variant="outlined"
                    color="positive"
                    onClick={handleAddL3}
                    disabled={!selectedL3 || l3Full}
                  >
                    + 추가
                  </Button>
                </div>
                {l3Items.length > 0 && (
                  <div style={s.addedItemList}>
                    {l3Items.map((item, idx) => (
                      <div key={idx} style={s.addedItem}>
                        <span style={s.addedItemText}>{item}</span>
                        <button
                          style={s.removeBtn}
                          onClick={() => handleRemoveL3(idx)}
                          aria-label="삭제"
                        >
                          <RemoveIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 화면기준정보 */}
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>화면기준정보</span>
                </div>
                <div style={s.selectWithBtn}>
                  <div style={{ flex: 1 }}>
                    <SelectBox
                      value={selectedScreenInfo}
                      onChange={setSelectedScreenInfo}
                      options={SCREEN_INFO_OPTIONS.filter(
                        (o) => !screenInfoItems.includes(o.label)
                      )}
                      placeholder="화면기준정보를 선택하거나 검색할 수 있습니다."
                      searchable
                      searchPlaceholder="화면기준정보 검색"
                      disabled={screenFull}
                    />
                  </div>
                  <Button
                    size="l"
                    variant="outlined"
                    color="positive"
                    onClick={handleAddScreenInfo}
                    disabled={!selectedScreenInfo || screenFull}
                  >
                    + 추가
                  </Button>
                </div>
                {screenInfoItems.length > 0 && (
                  <div style={s.addedItemList}>
                    {screenInfoItems.map((item, idx) => (
                      <div key={idx} style={s.addedItem}>
                        <span style={s.addedItemText}>{item}</span>
                        <button
                          style={s.removeBtn}
                          onClick={() => handleRemoveScreenInfo(idx)}
                          aria-label="삭제"
                        >
                          <RemoveIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={s.footer}>
              <Button size="l" variant="outlined" color="info" onClick={handleClose}>
                닫기
              </Button>
              <Button
                size="l"
                variant="filled"
                color="positive"
                onClick={handleSave}
                disabled={!canSave}
              >
                저장
              </Button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <AlertModal
          open={closeAlertOpen}
          onClose={() => setCloseAlertOpen(false)}
          type="warning"
          message="입력한 값을 초기화하고 창을 닫습니다."
          confirmLabel="확인"
          cancelLabel="취소"
          showCancel
          onConfirm={handleCloseConfirm}
          onCancel={() => setCloseAlertOpen(false)}
          zIndex={10001}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        onClose={() => {
          setSnackbarOpen(false);
          resetForm();
        }}
        message="저장 되었습니다."
        type="success"
      />
    </>
  );
}
