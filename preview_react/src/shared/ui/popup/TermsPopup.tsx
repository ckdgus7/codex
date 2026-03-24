import { Button } from "@/shared/ui/global/Button";

interface TermsPopupProps {
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

export function TermsPopup({ open, onClose }: TermsPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-[880px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-8 pb-4 pt-8">
          <div className="flex w-full items-center justify-between">
            <span className="text-2xl font-bold leading-8 text-[#52525b]">서비스 이용약관</span>
            <button className="flex h-8 w-8 items-center justify-center rounded bg-transparent p-0" onClick={onClose} aria-label="닫기">
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="flex flex-col gap-6 pb-6">
            <span className="text-base font-bold leading-6 text-black">주요 조항</span>

            <section className="flex flex-col gap-4">
              <span className="text-[20px] font-normal leading-8 text-black">제1조 (목적)</span>
              <p className="m-0 text-base font-normal leading-6 text-[#3f3f46]">
                본 약관은 NOVA AI DevOps 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <span className="text-[20px] font-normal leading-8 text-black">제2조 (서비스 이용)</span>
              <p className="m-0 text-base font-normal leading-6 text-[#3f3f46]">
                이용자는 회사가 제공하는 절차와 정책에 따라 서비스를 이용할 수 있으며, 계정 정보는 본인 책임 하에 안전하게 관리해야 합니다.
              </p>
              <ol className="m-0 list-decimal pl-6 text-base font-normal leading-6 text-[#3f3f46]">
                <li>이용을 위해 입력하는 정보는 정확하고 최신 상태여야 합니다.</li>
                <li>타인의 계정을 무단으로 사용하거나 공유해서는 안 됩니다.</li>
                <li>회사는 서비스 품질 향상을 위해 기능을 추가하거나 변경할 수 있습니다.</li>
              </ol>
            </section>

            <section className="flex flex-col gap-4">
              <span className="text-[20px] font-normal leading-8 text-black">제3조 (이용 제한)</span>
              <p className="m-0 text-base font-normal leading-6 text-[#3f3f46]">
                이용자는 관계 법령과 본 약관을 준수해야 하며, 서비스 운영을 방해하거나 타인의 권리를 침해하는 행위를 해서는 안 됩니다.
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <span className="text-[20px] font-normal leading-8 text-black">제4조 (책임 제한)</span>
              <p className="m-0 text-base font-normal leading-6 text-[#3f3f46]">
                회사는 천재지변, 시스템 장애, 통신 장애 등 불가항력으로 인해 발생한 손해에 대해 관련 법령이 허용하는 범위에서 책임을 제한할 수 있습니다.
              </p>
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
