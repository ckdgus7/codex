import { useState } from "react";
import { SelectBox } from "@/shared/ui/global/SelectBox";
import { Button } from "@/shared/ui/global/Button";

interface UserInfo {
  employeeId: string;
  name: string;
  company: string;
  department: string;
  email: string;
  phone: string;
}

interface RoleGroup {
  id: string;
  level: "L3" | "L4";
  name: string;
  status?: "요청" | "승인";
  appliedAt?: string;
  approvedAt?: string;
}

interface MyInfoProps {
  open: boolean;
  userInfo: UserInfo;
  roleGroups: RoleGroup[];
  lastLogin?: string;
  language?: string;
  onClose: () => void;
  onLanguageChange?: (lang: string) => void;
  onLanguageSave?: () => void;
  onRoleGroupRequest?: () => void;
}

function TitleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="#ffffff" strokeWidth="1.5" />
      <path d="M5 20C5 17.2386 7.23858 15 10 15H14C16.7614 15 19 17.2386 19 20V21H5V20Z" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 1L11 11M11 1L1 11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RoleIconBadge({ level }: { level: "L3" | "L4" }) {
  return (
    <div className={level === "L3" ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6366f1] text-[9px] font-bold text-white" : "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8b5cf6] text-[9px] font-bold text-white"}>
      {level}
    </div>
  );
}

function StatusBadge({ status, appliedAt, approvedAt }: { status: "요청" | "승인"; appliedAt?: string; approvedAt?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex shrink-0 items-start"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={status === "승인" ? "flex shrink-0 items-center justify-center rounded-xl border border-[#1ac057] bg-[#f2fdf5] px-[10px] py-1 text-xs font-medium leading-3 text-[#1ac057]" : "flex shrink-0 items-center justify-center rounded-xl border border-[#a1a1aa] bg-[#fafafa] px-[10px] py-1 text-xs font-medium leading-3 text-[#a1a1aa]"}>
        {status}
      </div>
      {hovered && (appliedAt || approvedAt) && (
        <div className="absolute right-[calc(100%+4px)] top-1/2 z-10 flex -translate-y-1/2 items-center">
          <div className="max-w-[216px] whitespace-nowrap rounded-lg bg-[#52525b] px-2 py-1 text-xs font-normal leading-[18px] text-white">
            {appliedAt && <div>요청일시: {appliedAt}</div>}
            {approvedAt && <div>승인일시: {approvedAt}</div>}
          </div>
          <div className="h-0 w-0 shrink-0 border-y-[5px] border-y-transparent border-l-[6px] border-l-[#52525b]" />
        </div>
      )}
    </div>
  );
}

const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "한국어", value: "ko" },
];

export function MyInfo({
  open,
  userInfo,
  roleGroups,
  lastLogin,
  language = "en",
  onClose,
  onLanguageChange,
  onLanguageSave,
}: MyInfoProps) {
  if (!open) return null;

  return (
    <div className="flex h-full w-[340px] min-w-[340px] shrink-0 flex-col overflow-hidden border-l border-[#e4e4e7] bg-[#98a2b3] font-sans box-border">
      <div className="flex h-full w-full flex-col gap-4 overflow-y-auto px-6 pb-8 pt-6 box-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <TitleIcon />
            <span className="whitespace-nowrap text-base font-semibold leading-7 text-white">나의 정보</span>
          </div>
          <button className="flex h-[18px] w-[18px] shrink-0 items-center justify-center border-none bg-none p-0" onClick={onClose} aria-label="닫기">
            <CloseIcon />
          </button>
        </div>

        <div className="flex w-full flex-col gap-8">
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="whitespace-nowrap text-sm font-medium leading-5 text-white">개인 정보</span>
            </div>
            <div className="flex w-full flex-col gap-2 rounded-lg bg-white px-4 py-3 box-border">
              {[
                ["사번", userInfo.employeeId],
                ["이름", userInfo.name],
                ["소속 그룹", userInfo.company],
                ["소속 조직", userInfo.department],
                ["이메일", userInfo.email],
                ["휴대폰 번호", userInfo.phone],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start gap-1">
                  <span className="flex h-5 shrink-0 items-center whitespace-nowrap text-[10px] font-normal leading-4 text-[#a1a1aa]">{label}</span>
                  <span className="whitespace-nowrap text-sm font-normal leading-5 text-[#3f3f46]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex-1 text-sm font-medium leading-5 text-white">역할그룹</span>
            </div>
            <div className="flex w-full flex-col gap-2">
              {roleGroups.map((role) => (
                <div key={role.id} className="flex w-full flex-col rounded-lg bg-white px-4 py-3 box-border">
                  <div className="flex w-full items-start gap-2">
                    <RoleIconBadge level={role.level} />
                    <span className="flex-1 text-sm font-normal leading-5 text-[#3f3f46]">{role.name}</span>
                    {role.status && <StatusBadge status={role.status} appliedAt={role.appliedAt} approvedAt={role.approvedAt} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="whitespace-nowrap text-sm font-medium leading-5 text-white">접속 정보</span>
            </div>
            <div className="flex w-full flex-col rounded-lg bg-white px-4 py-3 box-border">
              <div className="flex items-start gap-1">
                <span className="flex h-5 shrink-0 items-center whitespace-nowrap text-[10px] font-normal leading-4 text-[#a1a1aa]">마지막 로그인</span>
                <span className="whitespace-nowrap text-sm font-normal leading-5 text-[#3f3f46]">{lastLogin ?? "-"}</span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="whitespace-nowrap text-sm font-medium leading-5 text-white">언어 선택</span>
            </div>
            <div className="flex w-full flex-col items-end gap-2 rounded bg-[#667085] p-2 box-border">
              <div className="w-full">
                <SelectBox options={LANGUAGE_OPTIONS} value={language} onChange={(val) => onLanguageChange?.(val)} />
              </div>
              <div className="flex items-center justify-center">
                <Button variant="outlined" size="m" onClick={() => onLanguageSave?.()} style={{ borderColor: "#ffffff", color: "#ffffff" }}>
                  저장
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
