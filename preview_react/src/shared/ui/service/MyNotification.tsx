interface NotificationItem {
  id: string;
  content: string;
  linkText: string;
  linkHref?: string;
  time: string;
  highlighted?: boolean;
}

interface MyNotificationProps {
  open: boolean;
  notifications: NotificationItem[];
  totalCount: number;
  loadedCount: number;
  onClose: () => void;
  onMore?: () => void;
  onLinkClick?: (item: NotificationItem) => void;
}

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3C8.68629 3 6 5.68629 6 9V13.5858L4.29289 15.2929C4.00681 15.579 3.92134 16.009 4.07612 16.3827C4.2309 16.7564 4.59554 17 5 17H19C19.4045 17 19.7691 16.7564 19.9239 16.3827C20.0787 16.009 19.9932 15.579 19.7071 15.2929L18 13.5858V9C18 5.68629 15.3137 3 12 3Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 17V18C9 19.6569 10.3431 21 12 21C13.6569 21 15 19.6569 15 18V17" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.25" stroke="#a1a1aa" strokeWidth="1.2" />
      <path d="M8 4.5V8L10 10" stroke="#a1a1aa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6 8L10 12L14 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MyNotification({
  open,
  notifications,
  totalCount,
  loadedCount,
  onClose,
  onMore,
  onLinkClick,
}: MyNotificationProps) {
  if (!open) return null;

  return (
    <div className="flex h-full w-[340px] min-w-[340px] shrink-0 flex-col overflow-hidden border-l border-[#e4e4e7] bg-[#98a2b3] font-sans box-border">
      <div className="flex h-full w-full flex-col gap-4 px-6 pb-8 pt-6 box-border">
        <div className="flex w-full shrink-0 items-center justify-between">
          <div className="flex items-center gap-1">
            <BellIcon />
            <span className="whitespace-nowrap text-base font-semibold leading-7 text-white">나의 알림</span>
          </div>
          <button className="flex h-[18px] w-[18px] shrink-0 items-center justify-center border-none bg-none p-0" onClick={onClose} aria-label="닫기">
            <CloseIcon />
          </button>
        </div>

        <div className="flex w-full flex-1 flex-col gap-4 overflow-y-auto">
          {notifications.map((item) => (
            <div key={item.id} className={item.highlighted ? "flex w-full flex-col rounded-lg border-2 border-[#7cd4fd] bg-[#f5fbff] px-4 py-3 box-border" : "flex w-full flex-col rounded-lg bg-white px-4 py-3 box-border"}>
              <div className="flex w-full flex-col gap-2">
                <div className="flex-1 text-sm font-normal leading-5 text-[#3f3f46]">
                  <p className="m-0">{item.content}</p>
                </div>
                <div className="flex w-full items-center">
                  <span className="shrink-0 cursor-pointer whitespace-nowrap text-xs font-normal leading-[18px] text-[#1570ef]" onClick={() => onLinkClick?.(item)}>
                    {item.linkText}
                  </span>
                  <span className="flex-1 text-xs leading-[18px] text-[#1570ef]">&nbsp;바로가기</span>
                </div>
                <div className="flex w-full items-center justify-end">
                  <div className="flex items-center justify-center gap-0">
                    <ClockIcon />
                    <span className="whitespace-nowrap text-xs font-normal leading-[18px] text-[#3f3f46]">{item.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loadedCount < totalCount && (
          <div className="w-full shrink-0">
            <button className="flex w-full items-center justify-center gap-1.5 rounded border border-white bg-transparent px-1.5 py-1.5 box-border" onClick={onMore}>
              <MoreIcon />
              <span className="whitespace-nowrap text-sm font-medium leading-5 text-white">More ({loadedCount} / {totalCount})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
