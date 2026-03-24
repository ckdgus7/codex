import { useState, type CSSProperties } from "react";
import { Button } from "@/shared/ui/global/Button";
import { Input } from "@/shared/ui/global/Input";
import { SelectBox } from "@/shared/ui/global/SelectBox";
import { RadioGroup } from "@/shared/ui/global/RadioGroup";
import { Textarea } from "@/shared/ui/global/Textarea";
import { AlertModal } from "@/shared/ui/global/AlertModal";
import { Snackbar } from "@/shared/ui/global/Snackbar";
import { popupStyles } from "@/shared/ui/styles";
import { LIFECYCLE_MOCK_DATA } from "@/features/sbf/model/mock-data";

export interface BusinessAreaFormData {
  lifecycleId: string;
  lifecycleNameKo: string;
  category: string;
  nameKo: string;
  description: string;
  useYn: string;
}

interface BusinessAreaCreatePopupProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: BusinessAreaFormData) => void;
}

const FONT_FAMILY = "Pretendard, sans-serif";

const LIFECYCLE_OPTIONS = LIFECYCLE_MOCK_DATA.map((lc) => ({
  label: lc.nameKo,
  value: lc.lifecycleId,
}));

const CATEGORY_OPTIONS = [
  { label: "고객 여정", value: "고객 여정" },
  { label: "전략/기획", value: "전략/기획" },
  { label: "운영 지원", value: "운영 지원" },
  { label: "IT Admin", value: "IT Admin" },
];

const USE_YN_OPTIONS = [
  { label: "사용", value: "사용" },
  { label: "미사용", value: "미사용" },
];

const NAME_MAX = 70;
const NAME_MIN = 3;
const DESC_MAX = 300;
const DESC_MIN = 5;

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

const s = {
  overlay: {
    ...popupStyles.overlay,
    zIndex: 10000,
  } satisfies CSSProperties,

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
  } satisfies CSSProperties,

  header: {
    display: "flex",
    flexDirection: "column",
    padding: "32px 32px 16px 32px",
    gap: 12,
    flexShrink: 0,
  } satisfies CSSProperties,

  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  } satisfies CSSProperties,

  titleText: {
    fontFamily: FONT_FAMILY,
    fontSize: 24,
    fontWeight: 700,
    lineHeight: "32px",
    color: "#52525b",
    whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  closeBtn: {
    ...popupStyles.closeBtn,
  } satisfies CSSProperties,

  requiredRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  } satisfies CSSProperties,

  requiredDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#36bffa",
    flexShrink: 0,
  } satisfies CSSProperties,

  requiredText: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "18px",
    color: "#52525b",
  } satisfies CSSProperties,

  main: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: "24px 32px",
    overflowY: "auto",
    flex: 1,
  } satisfies CSSProperties,

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: "100%",
  } satisfies CSSProperties,

  labelRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  } satisfies CSSProperties,

  labelText: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "18px",
    color: "#a1a1aa",
    whiteSpace: "nowrap" as const,
  } satisfies CSSProperties,

  requiredMark: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#36bffa",
    flexShrink: 0,
  } satisfies CSSProperties,

  alertRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
  } satisfies CSSProperties,

  alertText: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    fontWeight: 400,
    lineHeight: "18px",
    color: "#f04438",
    flex: 1,
  } satisfies CSSProperties,

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px 32px 32px",
    flexShrink: 0,
  } satisfies CSSProperties,

  footerLeft: {
    display: "flex",
    alignItems: "center",
  } satisfies CSSProperties,

  footerRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  } satisfies CSSProperties,
} as const;

export function BusinessAreaCreatePopup({
  open,
  onClose,
  onSave,
}: BusinessAreaCreatePopupProps) {
  const [lifecycleId, setLifecycleId] = useState("");
  const [category, setCategory] = useState("");
  const [nameKo, setNameKo] = useState("");
  const [description, setDescription] = useState("");
  const [useYn, setUseYn] = useState("사용");

  const [lifecycleError, setLifecycleError] = useState(false);
  const [nameError, setNameError] = useState<"required" | "min" | null>(null);
  const [descError, setDescError] = useState(false);
  const [closeAlertOpen, setCloseAlertOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  if (!open && !snackbarOpen) return null;

  const selectedLifecycle = LIFECYCLE_MOCK_DATA.find((lc) => lc.lifecycleId === lifecycleId);

  const resetForm = () => {
    setLifecycleId("");
    setCategory("");
    setNameKo("");
    setDescription("");
    setUseYn("사용");
    setLifecycleError(false);
    setNameError(null);
    setDescError(false);
  };

  const handleLifecycleChange = (value: string) => {
    setLifecycleId(value);
    const found = LIFECYCLE_MOCK_DATA.find((lc) => lc.lifecycleId === value);
    setCategory(found?.category || "");
    if (lifecycleError) setLifecycleError(false);
  };

  const handleClose = () => {
    setCloseAlertOpen(true);
  };

  const handleCloseConfirm = () => {
    setCloseAlertOpen(false);
    resetForm();
    onClose();
  };

  const handleSave = () => {
    let valid = true;

    if (!lifecycleId) {
      setLifecycleError(true);
      valid = false;
    } else {
      setLifecycleError(false);
    }

    const trimmedName = nameKo.replace(/\s/g, "");
    if (!trimmedName) {
      setNameError("required");
      valid = false;
    } else if (trimmedName.length < NAME_MIN) {
      setNameError("min");
      valid = false;
    } else {
      setNameError(null);
    }

    const trimmedDesc = description.replace(/\s/g, "");
    if (trimmedDesc.length > 0 && trimmedDesc.length < DESC_MIN) {
      setDescError(true);
      valid = false;
    } else {
      setDescError(false);
    }

    if (!valid) return;

    const data: BusinessAreaFormData = {
      lifecycleId,
      lifecycleNameKo: selectedLifecycle?.nameKo || "",
      category,
      nameKo,
      description,
      useYn,
    };

    onSave?.(data);
    setSnackbarOpen(true);
    onClose();
  };

  return (
    <>
      {open && (
        <div style={s.overlay} onClick={handleClose}>
          <div style={s.popup} onClick={(e) => e.stopPropagation()}>
            <div style={s.header}>
              <div style={s.titleRow}>
                <span style={s.titleText}>업무영역(D2) 신규 등록</span>
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
              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>Lifecycle(D1) 명</span>
                  <div style={s.requiredMark} />
                </div>
                <SelectBox
                  value={lifecycleId}
                  onChange={handleLifecycleChange}
                  options={LIFECYCLE_OPTIONS}
                  placeholder="Lifecycle(D1) 명을 선택하세요."
                  searchable
                  searchPlaceholder="Lifecycle(D1) 검색"
                  searchHighlight
                  error={lifecycleError}
                />
                {lifecycleError && (
                  <div style={s.alertRow}>
                    <AlertIcon />
                    <span style={s.alertText}>Lifecycle(D1) 명을 선택하세요.</span>
                  </div>
                )}
              </div>

              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>구분</span>
                  <div style={s.requiredMark} />
                </div>
                <SelectBox
                  value={category}
                  onChange={setCategory}
                  options={CATEGORY_OPTIONS}
                  placeholder="Lifecycle(D1) 명 선택 시 자동 입력됩니다."
                  disabled={!lifecycleId}
                />
              </div>

              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>업무영역(D2) 명</span>
                  <div style={s.requiredMark} />
                </div>
                <Input
                  value={nameKo}
                  onChange={(e) => {
                    const v = e.target.value.slice(0, NAME_MAX);
                    setNameKo(v);
                    if (nameError) {
                      const trimmed = v.replace(/\s/g, "");
                      if (trimmed.length >= NAME_MIN) setNameError(null);
                    }
                  }}
                  placeholder="업무영역(D2) 명을 입력하세요."
                  indicator={`${nameKo.replace(/\s/g, "").length}/${NAME_MAX}`}
                  error={!!nameError}
                  maxLength={NAME_MAX}
                />
                {nameError === "required" && (
                  <div style={s.alertRow}>
                    <AlertIcon />
                    <span style={s.alertText}>업무영역(D2) 명을 입력하세요.</span>
                  </div>
                )}
                {nameError === "min" && (
                  <div style={s.alertRow}>
                    <AlertIcon />
                    <span style={s.alertText}>
                      업무영역(D2) 명을 최소 {NAME_MIN}자 이상 입력하세요.
                    </span>
                  </div>
                )}
              </div>

              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>업무영역(D2) 설명</span>
                </div>
                <Textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (descError) {
                      const trimmed = e.target.value.replace(/\s/g, "");
                      if (trimmed.length === 0 || trimmed.length >= DESC_MIN) setDescError(false);
                    }
                  }}
                  placeholder="업무영역(D2) 설명을 입력할 수 있습니다."
                  maxLength={DESC_MAX}
                  indicator
                  error={descError}
                  style={{ minHeight: 120 }}
                />
                {descError && (
                  <div style={s.alertRow}>
                    <AlertIcon />
                    <span style={s.alertText}>
                      업무영역(D2) 설명을 최소 {DESC_MIN}자 이상 입력하세요.
                    </span>
                  </div>
                )}
              </div>

              <div style={s.fieldGroup}>
                <div style={s.labelRow}>
                  <span style={s.labelText}>사용여부</span>
                  <div style={s.requiredMark} />
                </div>
                <RadioGroup
                  value={useYn}
                  onChange={setUseYn}
                  options={USE_YN_OPTIONS}
                  size="l"
                  direction="horizontal"
                  gap={32}
                />
              </div>
            </div>

            <div style={s.footer}>
              <div style={s.footerLeft}>
                <Button size="l" variant="outlined" color="info" onClick={handleClose}>
                  닫기
                </Button>
              </div>
              <div style={s.footerRight}>
                <Button size="l" variant="filled" color="positive" onClick={handleSave}>
                  등록
                </Button>
              </div>
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
        message="등록 되었습니다."
        type="success"
      />
    </>
  );
}
