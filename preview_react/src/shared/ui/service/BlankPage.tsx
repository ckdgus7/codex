import { useEffect } from "react";
import { useMdiStore } from "@/shared/model/mdi.store";
import { usePageHeader } from "@/shared/hooks/usePageHeader";

interface BlankPageProps {
  title: string;
  gnbName: string;
  path: string;
}

export function BlankPage({ title, gnbName, path }: BlankPageProps) {
  const addTab = useMdiStore((st) => st.addTab);

  usePageHeader({
    breadcrumbItems: [{ label: gnbName }, { label: title }],
    title,
    favoriteKey: title,
  });

  useEffect(() => {
    addTab({ id: path, label: title, path });
  }, [addTab, path, title]);

  return (
    <div className="flex flex-1 flex-col font-sans">
      <div className="flex flex-1 flex-col overflow-auto px-8 py-5">
        <div className="flex flex-1 items-center justify-center rounded-lg bg-white text-sm text-[#a1a1aa]">
          페이지 준비 중입니다.
        </div>
      </div>
    </div>
  );
}
