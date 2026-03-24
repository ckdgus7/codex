import { useEffect, useState } from "react";
import { useMdiStore } from "@/shared/model/mdi.store";
import { usePageHeader } from "@/shared/hooks/usePageHeader";
import { generateMockRequirements } from "../model/mock-data";
import type { Requirement } from "../model/types";

const STATUS_CLASSES: Record<Requirement["status"], { wrap: string; text: string }> = {
  "작성 중": { wrap: "border border-[#a1a1aa] bg-[#fafafa]", text: "text-[#a1a1aa]" },
  "검토 중": { wrap: "border border-[#7a5af8] bg-[#fafaff]", text: "text-[#7a5af8]" },
  반려: { wrap: "border border-[#f04438] bg-[#fff5f5]", text: "text-[#f04438]" },
  승인: { wrap: "border border-[#12b76a] bg-[#f0fdf4]", text: "text-[#12b76a]" },
  완료: { wrap: "border border-[#36bffa] bg-[#eff8ff]", text: "text-[#36bffa]" },
};

const ALL_OPTION = "전체";
const SEARCH_SCOPE_ALL = "전체";
const SEARCH_SCOPE_TITLE = "제목";
const SEARCH_SCOPE_ID = "ID";
const allData = generateMockRequirements(36);
const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SortIcon({ active }: { active: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3.5 8.5L7 12l3.5-3.5M3.5 5.5L7 2l3.5 3.5" stroke={active ? "#fafafa" : "#a1a1aa"} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M11.25 13.5L6.75 9l4.5-4.5" stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M6.75 4.5L11.25 9l-4.5 4.5" stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#a1a1aa" strokeWidth="1" />
      <path d="M8 4.5V8l2.5 1.5" stroke="#a1a1aa" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RoleIconSvg() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#e4e4e7" />
      <path d="M10 6a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm0 6c2.5 0 5 1.25 5 2.5V16H5v-1.5C5 13.25 7.5 12 10 12z" fill="#a1a1aa" />
    </svg>
  );
}

function DropdownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RequirementListView() {
  const addTab = useMdiStore((st) => st.addTab);
  const [activeTab, setActiveTab] = useState<"all" | "personal">("all");
  const [sortField, setSortField] = useState<"updatedAt" | "dueDate">("updatedAt");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchScope, setSearchScope] = useState<typeof SEARCH_SCOPE_ALL | typeof SEARCH_SCOPE_TITLE | typeof SEARCH_SCOPE_ID>(SEARCH_SCOPE_ALL);
  const [statusFilter, setStatusFilter] = useState<typeof ALL_OPTION | Requirement["status"]>(ALL_OPTION);

  useEffect(() => {
    addTab({ id: "/requirements", label: "요구사항", path: "/requirements" });
  }, [addTab]);

  const filtered = activeTab === "personal"
    ? []
    : allData.filter((item) => {
        if (statusFilter !== ALL_OPTION && item.status !== statusFilter) return false;
        if (searchKeyword) {
          if (searchScope === SEARCH_SCOPE_TITLE && !item.title.includes(searchKeyword)) return false;
          if (searchScope === SEARCH_SCOPE_ID && !item.reqId.includes(searchKeyword)) return false;
          if (searchScope === SEARCH_SCOPE_ALL && !item.title.includes(searchKeyword) && !item.reqId.includes(searchKeyword)) return false;
        }
        return true;
      });

  const sorted = [...filtered].sort((a, b) => {
    if (sortField === "dueDate") return b.dueDate.localeCompare(a.dueDate);
    return 0;
  });

  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  usePageHeader({
    breadcrumbItems: [{ label: "요구관리" }, { label: "요구사항" }],
    title: "요구사항",
    favoriteKey: "요구사항",
  });

  return (
    <div className="flex flex-1 flex-col font-sans">
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="flex min-h-full flex-col">
          <div className="mx-8 mt-8 flex items-center justify-between gap-6 rounded-lg bg-white px-6 py-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="mr-1 whitespace-nowrap text-sm font-medium leading-[18px] text-[#a1a1aa]">등록일</span>
                <input type="date" className="h-10 w-[140px] rounded border border-[#e4e7ec] px-3 text-sm text-[#3f3f46] outline-none" />
                <span className="text-sm text-[#a1a1aa]">~</span>
                <input type="date" className="h-10 w-[140px] rounded border border-[#e4e7ec] px-3 text-sm text-[#3f3f46] outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <span className="mr-1 whitespace-nowrap text-sm font-medium leading-[18px] text-[#a1a1aa]">상태</span>
                <div className="relative flex items-center">
                  <select className="h-10 min-w-[120px] appearance-none rounded border border-[#e4e7ec] bg-white px-3 pr-7 text-sm text-[#3f3f46] outline-none" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as typeof ALL_OPTION | Requirement["status"]); setPage(1); }}>
                    <option value={ALL_OPTION}>{ALL_OPTION}</option>
                    <option value="작성 중">작성 중</option>
                    <option value="검토 중">검토 중</option>
                    <option value="반려">반려</option>
                    <option value="승인">승인</option>
                    <option value="완료">완료</option>
                  </select>
                  <div className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2"><DropdownIcon /></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="mr-1 whitespace-nowrap text-sm font-medium leading-[18px] text-[#a1a1aa]">검색</span>
                <div className="relative flex items-center">
                  <select className="h-10 min-w-[100px] appearance-none rounded border border-[#e4e7ec] bg-white px-3 pr-7 text-sm text-[#3f3f46] outline-none" value={searchScope} onChange={(e) => setSearchScope(e.target.value as typeof SEARCH_SCOPE_ALL | typeof SEARCH_SCOPE_TITLE | typeof SEARCH_SCOPE_ID)}>
                    <option value={SEARCH_SCOPE_ALL}>{SEARCH_SCOPE_ALL}</option>
                    <option value={SEARCH_SCOPE_TITLE}>{SEARCH_SCOPE_TITLE}</option>
                    <option value={SEARCH_SCOPE_ID}>{SEARCH_SCOPE_ID}</option>
                  </select>
                  <div className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2"><DropdownIcon /></div>
                </div>
              </div>
              <div className="relative flex min-w-[180px] flex-1 items-center">
                <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#a1a1aa]"><SearchIcon /></div>
                <input
                  type="text"
                  className="h-10 min-w-[180px] flex-1 rounded border border-[#e4e7ec] bg-white py-2 pl-9 pr-14 text-base leading-6 text-[#3f3f46] outline-none"
                  placeholder="검색어를 입력하세요"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  maxLength={20}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs leading-[18px] text-[#a1a1aa]">{searchKeyword.length}/20</span>
              </div>
              <button className="flex h-10 items-center justify-center whitespace-nowrap rounded border border-[#7a5af8] bg-white px-[14px] text-base font-bold leading-6 text-[#7a5af8]" onClick={() => setPage(1)}>
                검색
              </button>
            </div>
          </div>

          <div className="mx-8 mt-4 flex flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-[#e4e4e7]">
              <div className="flex h-12 items-end">
                <div className={cx("mb-0 flex cursor-pointer items-center justify-center gap-2 bg-white px-4 py-2 text-base font-normal leading-6", activeTab === "all" ? "-mb-px border-b-2 border-[#7a5af8] text-[#7a5af8]" : "border-b border-[#e4e4e7] text-[#a1a1aa]")} onClick={() => { setActiveTab("all"); setPage(1); }}>
                  <span>All</span>
                  <span className={cx("flex items-center justify-center rounded-xl px-[10px] py-1 text-xs font-medium leading-3 text-white", activeTab === "all" ? "bg-[#7a5af8]" : "bg-[#a1a1aa]")}>{allData.length}</span>
                </div>
                <div className={cx("mb-0 flex cursor-pointer items-center justify-center gap-2 bg-white px-4 py-2 text-base font-normal leading-6", activeTab === "personal" ? "-mb-px border-b-2 border-[#7a5af8] text-[#7a5af8]" : "border-b border-[#e4e4e7] text-[#a1a1aa]")} onClick={() => { setActiveTab("personal"); setPage(1); }}>
                  <span>Personal</span>
                  <span className={cx("flex items-center justify-center rounded-xl px-[10px] py-1 text-xs font-medium leading-3 text-white", activeTab === "personal" ? "bg-[#7a5af8]" : "bg-[#a1a1aa]")}>0</span>
                </div>
              </div>

              <div className="flex flex-1 items-center gap-2 pl-0">
                <div className={cx("flex cursor-pointer items-center gap-[5px] rounded-md px-2 py-[5px] text-sm font-medium leading-[14px]", sortField === "updatedAt" ? "bg-[#71717a] text-[#fafafa]" : "bg-[#fafaff] text-[#a1a1aa]")} onClick={() => setSortField("updatedAt")}>
                  <SortIcon active={sortField === "updatedAt"} />
                  <span>업데이트 일시</span>
                </div>
                <div className={cx("flex cursor-pointer items-center gap-[5px] rounded-md px-2 py-[5px] text-sm font-medium leading-[14px]", sortField === "dueDate" ? "bg-[#71717a] text-[#fafafa]" : "bg-[#fafaff] text-[#a1a1aa]")} onClick={() => setSortField("dueDate")}>
                  <SortIcon active={sortField === "dueDate"} />
                  <span>완료 희망일</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-6 pb-2">
                <div className="flex items-center gap-3">
                  <span className="whitespace-nowrap text-sm font-medium leading-[18px] text-[#a1a1aa]">Items per page:</span>
                  <select className="h-10 min-w-[50px] rounded border border-[#e4e7ec] bg-white px-1 py-[3px] text-sm text-[#3f3f46] outline-none" value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <span className="whitespace-nowrap text-sm leading-5 text-[#71717a]">{startItem}-{endItem} of {totalItems}</span>
                <div className="flex items-center gap-1">
                  <button className={cx("flex items-center justify-center rounded bg-transparent p-0", currentPage <= 1 ? "cursor-default opacity-40" : "cursor-pointer opacity-100")} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>
                    <ChevronLeftIcon />
                  </button>
                  <button className={cx("flex items-center justify-center rounded bg-transparent p-0", currentPage >= totalPages ? "cursor-default opacity-40" : "cursor-pointer opacity-100")} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              {pageItems.map((item) => (
                <div key={item.id} className="box-border flex h-24 cursor-pointer items-center gap-4 border-b border-[#e4e4e7] bg-white p-4">
                  <div className={cx("flex h-16 w-16 shrink-0 items-center justify-center rounded-full", STATUS_CLASSES[item.status].wrap)}>
                    <span className={cx("w-[60px] text-center font-sans text-xs font-medium leading-4", STATUS_CLASSES[item.status].text)}>{item.status}</span>
                  </div>

                  <div className="flex flex-1 flex-col justify-end self-stretch gap-2">
                    <div className="flex w-full items-center gap-4">
                      <span className="flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-[#36bffa] bg-white px-3 py-1 font-sans text-sm font-medium leading-4 text-[#36bffa]">{item.reqId}</span>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-bold leading-7 text-[#3f3f46]">{item.title}</span>
                    </div>
                    <div className="flex w-full items-center gap-4">
                      <div className="flex items-start gap-1">
                        <span className="flex h-[18px] items-center whitespace-nowrap text-[10px] font-normal leading-4 text-[#a1a1aa]">완료 희망일</span>
                        <span className="whitespace-nowrap text-xs font-normal leading-[18px] text-[#3f3f46]">{item.dueDate}</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="flex h-[18px] items-center whitespace-nowrap text-[10px] font-normal leading-4 text-[#a1a1aa]">과제</span>
                        <div className="flex items-center gap-1">
                          <span className="flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-[#e4e4e7] px-[10px] py-[3px] font-sans text-[10px] font-medium leading-3 text-[#52525b]">{item.taskId}</span>
                          <span className="whitespace-nowrap text-xs font-normal leading-[18px] text-[#3f3f46]">{item.taskName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end justify-end self-stretch gap-2">
                    <div className="flex items-start gap-1">
                      <span className="flex h-[18px] items-center whitespace-nowrap text-[10px] font-normal leading-4 text-[#a1a1aa]">Updated</span>
                      <div className="flex items-center gap-0">
                        <ClockIcon />
                        <span className="whitespace-nowrap text-xs font-normal leading-[18px] text-[#3f3f46]">{item.updatedAt}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="flex h-[18px] items-center whitespace-nowrap text-[10px] font-normal leading-4 text-[#a1a1aa]">작성자</span>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                          <span className="whitespace-nowrap text-xs font-normal leading-[18px] text-[#3f3f46]">{item.author}</span>
                          <RoleIconSvg />
                        </div>
                        <div className="flex items-center gap-1 opacity-30">
                          <div className="mr-1 h-[10px] w-px bg-black" />
                          <span className="whitespace-nowrap text-[10px] leading-4 text-black">{item.authorOrg}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {pageItems.length === 0 && (
                <div className="bg-white px-[60px] py-[60px] text-center text-sm text-[#a1a1aa]">
                  데이터가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
