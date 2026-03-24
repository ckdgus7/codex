import { Button } from "@/shared/ui/global/Button";

interface PrivacyPopupProps {
  open: boolean;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 5L15 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 5L5 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 10L12 14L16 10" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PrivacyPopup({ open, onClose }: PrivacyPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-[880px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-8 pb-4 pt-8">
          <div className="flex w-full items-center justify-between">
            <span className="text-2xl font-bold leading-8 text-[#52525b]">개인정보 처리방침</span>
            <button className="flex h-8 w-8 items-center justify-center rounded bg-transparent p-0" onClick={onClose} aria-label="닫기">
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mb-2 flex justify-end">
            <div className="flex h-10 items-center gap-2 rounded border border-[#e4e7ec] bg-white px-2">
              <span className="whitespace-nowrap px-2 text-base font-normal leading-6 text-[#a1a1aa]">개정일자: 2026.02.03</span>
              <ChevronDownIcon />
            </div>
          </div>

          <div className="flex flex-col gap-6 pb-6">
            <span className="text-base font-bold leading-6 text-black">주요 내용</span>

            <section className="flex flex-col gap-4">
              <span className="text-[20px] font-normal leading-8 text-black">1. 수집 항목 및 목적</span>
              <p className="m-0 text-base font-normal leading-6 text-[#3f3f46]">
                회사는 서비스 제공, 사용자 식별, 문의 대응, 보안 및 품질 개선을 위해 필요한 최소한의 개인정보를 수집하고 이용합니다.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <span className="text-[20px] font-normal leading-8 text-black">2. 보유 및 이용 기간</span>
              <p className="m-0 text-base font-normal leading-6 text-[#3f3f46]">
                수집한 개인정보는 서비스 제공 기간 동안 보관되며, 관련 법령 또는 내부 정책에 따라 일정 기간 보관 후 안전하게 파기됩니다.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <span className="text-[20px] font-normal leading-8 text-black">3. 제3자 제공 및 처리 위탁</span>
              <p className="m-0 text-base font-normal leading-6 text-[#3f3f46]">
                회사는 이용자 동의 또는 관련 법령에 근거한 경우를 제외하고는 개인정보를 외부에 제공하지 않으며, 위탁이 필요한 경우 수탁자와 업무 범위를 고지합니다.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <span className="text-[20px] font-normal leading-8 text-black">4. 이용자 권리</span>
              <ul className="m-0 list-disc pl-6 text-base font-normal leading-6 text-[#3f3f46]">
                <li>이용자는 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.</li>
                <li>처리 정지 및 동의 철회를 요청할 수 있습니다.</li>
                <li>법령상 보관 의무가 있는 정보는 요청 즉시 삭제되지 않을 수 있습니다.</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="flex items-center justify-between px-8 pb-8 pt-4">
          <div>
            <Button size="l" variant="outlined" color="info" onClick={onClose}>
              닫기
            </Button>
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}
