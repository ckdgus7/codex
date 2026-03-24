import { MdiTab } from "./MdiTab";
import { TopUtil } from "./TopUtil";
import { Breadcrumb } from "./Breadcrumb";
import { PageTitle } from "./PageTitle";
import { usePageHeaderStore } from "@/shared/model/pageHeader.store";
import { useMyInfoStore } from "@/shared/model/myInfo.store";
import { useMyNotificationStore } from "@/shared/model/myNotification.store";

export function PageHeader() {
  const breadcrumbItems = usePageHeaderStore((s) => s.breadcrumbItems);
  const title = usePageHeaderStore((s) => s.title);
  const favoriteKey = usePageHeaderStore((s) => s.favoriteKey);
  const badge = usePageHeaderStore((s) => s.badge);
  const idBadge = usePageHeaderStore((s) => s.idBadge);
  const actions = usePageHeaderStore((s) => s.actions);
  const onBack = usePageHeaderStore((s) => s.onBack);
  const showRefresh = usePageHeaderStore((s) => s.showRefresh);
  const onRefresh = usePageHeaderStore((s) => s.onRefresh);

  const myInfoIsOpen = useMyInfoStore((s) => s.isOpen);
  const toggleMyInfo = useMyInfoStore((s) => s.toggle);
  const closeMyInfo = useMyInfoStore((s) => s.close);

  const notifIsOpen = useMyNotificationStore((s) => s.isOpen);
  const toggleNotif = useMyNotificationStore((s) => s.toggle);
  const closeNotif = useMyNotificationStore((s) => s.close);

  const handleUserClick = () => {
    if (notifIsOpen) closeNotif();
    toggleMyInfo();
  };

  const handleBellClick = () => {
    if (myInfoIsOpen) closeMyInfo();
    toggleNotif();
  };

  return (
    <div className="z-10 w-full shrink-0 border-b border-[#e4e4e7] font-sans">
      <div className="flex w-full items-center border-b border-[#e4e4e7] bg-[#fafafa] box-border">
        <MdiTab />
        <TopUtil
          bellNotification
          chatNotification
          onUserClick={handleUserClick}
          onBellClick={handleBellClick}
        />
      </div>
      {title && (
        <div className="flex w-full items-start bg-white box-border">
          <div className="flex w-full flex-col gap-4 px-8 py-6 box-border">
            {breadcrumbItems.length > 0 && <Breadcrumb items={breadcrumbItems} />}
            <PageTitle
              title={title}
              favoriteKey={favoriteKey}
              badge={badge}
              idBadge={idBadge}
              actions={actions}
              onBack={onBack}
              showRefresh={showRefresh}
              onRefresh={onRefresh}
            />
          </div>
        </div>
      )}
    </div>
  );
}
