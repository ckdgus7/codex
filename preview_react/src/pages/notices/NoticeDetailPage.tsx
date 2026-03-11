import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useNoticeQuery } from "@/features/notices/api/notices.queries";
import { NoticeDetailView } from "@/features/notices/ui/NoticeDetailView";

export function NoticeDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const noticeId = useMemo(() => Number(params.id), [params.id]);
  const { data, isLoading, isError } = useNoticeQuery(noticeId);

  const handleBack = () => {
    navigate("/notices/");
  };

  return (
    <NoticeDetailView
      notice={data ?? null}
      loading={isLoading}
      error={isError}
      onBack={handleBack}
    />
  );
}
