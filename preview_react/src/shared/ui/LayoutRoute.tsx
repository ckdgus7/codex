import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { LNB } from "./service/LNB";
import { PageHeader } from "./service/PageHeader";
import { PageFooter } from "./service/PageFooter";
import { MyInfo } from "./service/MyInfo";
import { MyNotification } from "./service/MyNotification";
import { useMenuStore } from "@/shared/model/menu.store";
import { useMyInfoStore } from "@/shared/model/myInfo.store";
import { useMyNotificationStore } from "@/shared/model/myNotification.store";

const MOCK_USER_INFO = {
  employeeId: "P12345678",
  name: "김소영",
  company: "SK텔레콤",
  department: "BSS Architect팀",
  email: "skkim@sktelecom.com",
  phone: "010-1234-5678",
};

const MOCK_ROLE_GROUPS = [
  { id: "1", level: "L3" as const, name: "L3 기획 리더", status: "요청" as const, appliedAt: "2025-12-19 10:45" },
  { id: "2", level: "L3" as const, name: "L3 Application 설계 리더" },
  { id: "3", level: "L4" as const, name: "L4 Application 설계 리더", status: "승인" as const, appliedAt: "2025-12-19 10:45", approvedAt: "2025-12-19 17:21" },
];

const MOCK_NOTIFICATIONS = [
  { id: "1", content: "[{요구사항}] 요구사항의 유사도 검증 결과가 도출되었습니다. 아래 요구사항 Detail 링크를 방문하여 결과를 확인해주세요.", linkText: "요구사항 Detail", time: "15분 전" },
  { id: "2", content: "[{요구사항}] 요구사항이 신규로 등록되었습니다. 아래 요구사항 검토자 배정 링크를 방문하여 요구사항 검토자(L2) 배정을 완료해주세요.", linkText: "요구사항 검토자 배정 Detail", time: "1시간 전", highlighted: true },
  { id: "3", content: "[{요구사항}] 요구사항이 수정되었습니다. 아래 요구사항 검토자 배정 링크를 방문하여 변경된 내용을 확인하고 검토자 배정을 검토해주세요.", linkText: "요구사항 검토자 배정 Detail", time: "3시간 전" },
  { id: "4", content: "[{요구사항}] 요구사항이 수정되었습니다. 아래 요구사항 검토 Detail 링크를 방문하여 변경된 내용을 확인하고 요구 수용 여부를 검토해주세요.", linkText: "요구사항 검토 Detail", time: "3시간 전" },
  { id: "5", content: "[{요구사항}] 요구사항 검토자로 지정되었습니다. 아래 링크를 방문하여 요구사항을 검토한 후 수용 또는 제외 처리해주세요.", linkText: "요구사항 검토 Detail", time: "3시간 전" },
];

export function LayoutRoute() {
  const location = useLocation();
  const menuItems = useMenuStore((s) => s.menuItems);
  const fetchMenu = useMenuStore((s) => s.fetchMenu);
  const [activeGnb, setActiveGnb] = useState("요구관리");
  const [activeLnb, setActiveLnb] = useState("요구사항");

  const myInfoOpen = useMyInfoStore((s) => s.isOpen);
  const closeMyInfo = useMyInfoStore((s) => s.close);
  const [language, setLanguage] = useState("en");

  const notifOpen = useMyNotificationStore((s) => s.isOpen);
  const closeNotif = useMyNotificationStore((s) => s.close);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => {
    const path = location.pathname;
    let bestMatch: { gnbName: string; lnbName: string; pathLen: number } | null = null;
    for (const gnb of menuItems) {
      for (const lnb of gnb.lnb) {
        if (path === lnb.path || path.startsWith(lnb.path + "/")) {
          if (!bestMatch || lnb.path.length > bestMatch.pathLen) {
            bestMatch = { gnbName: gnb.gnbName, lnbName: lnb.name, pathLen: lnb.path.length };
          }
        }
      }
    }
    if (bestMatch) {
      setActiveGnb(bestMatch.gnbName);
      setActiveLnb(bestMatch.lnbName);
    }
  }, [location.pathname, menuItems]);

  return (
    <div className="flex h-screen w-full font-sans">
      <LNB activeItem={activeLnb} activeGnb={activeGnb} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden transition-[flex] duration-300 ease-in-out">
        <PageHeader />
        <div className="relative flex flex-1 flex-col overflow-auto bg-white">
          <Outlet />
        </div>
        <PageFooter />
      </div>
      <MyInfo
        open={myInfoOpen}
        userInfo={MOCK_USER_INFO}
        roleGroups={MOCK_ROLE_GROUPS}
        lastLogin="2025-11-28 15:24"
        language={language}
        onClose={closeMyInfo}
        onLanguageChange={setLanguage}
      />
      <MyNotification
        open={notifOpen}
        notifications={MOCK_NOTIFICATIONS}
        totalCount={30}
        loadedCount={10}
        onClose={closeNotif}
        onMore={() => {}}
        onLinkClick={() => {}}
      />
    </div>
  );
}
