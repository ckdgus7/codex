import { useState } from "react";
import { TermsPopup } from "@/shared/ui/popup/TermsPopup";
import { PrivacyPopup } from "@/shared/ui/popup/PrivacyPopup";

export function PageFooter() {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="z-10 w-full shrink-0 border-t border-[#e4e4e7] bg-white px-8 py-4 box-border">
        <div className="flex w-full items-start justify-between">
          <div className="flex shrink-0 items-center justify-center">
            <span className="whitespace-nowrap font-sans text-[10px] font-normal leading-4 text-[#a1a1aa]">
              COPYRIGHT © SKT NOVA AI DevOps. ALL RIGHTS RESERVED.
            </span>
          </div>
          <div className="flex shrink-0 items-start gap-4 whitespace-nowrap text-[#52525b]">
            <span className="cursor-pointer font-sans text-xs font-normal leading-[18px]" onClick={() => setTermsOpen(true)}>
              서비스 이용약관
            </span>
            <span className="cursor-pointer font-sans text-xs font-bold leading-[18px]" onClick={() => setPrivacyOpen(true)}>
              개인정보 처리방침
            </span>
          </div>
        </div>
      </footer>
      <TermsPopup open={termsOpen} onClose={() => setTermsOpen(false)} />
      <PrivacyPopup open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}
