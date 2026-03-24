import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQnADetail, type QnAQueryParams } from "@/features/qna/model/mock-data";
import type { QnAListResult } from "@/features/qna/model/types";

const QNA_API_BASE = "http://localhost:8787/api";

export const qnaKeys = {
  all: ["qna"] as const,
  list: (params: QnAQueryParams) => ["qna", "list", params] as const,
  detail: (id: number) => ["qna", "detail", id] as const,
};

async function fetchQnAList(params: QnAQueryParams): Promise<QnAListResult> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    ...(params.category ? { category: params.category } : {}),
    ...(params.keyword ? { keyword: params.keyword } : {}),
    ...(params.searchScope ? { searchScope: params.searchScope } : {}),
    ...(params.sortKey ? { sortKey: params.sortKey } : {}),
    ...(params.sortDir ? { sortDir: params.sortDir } : {}),
  });
  const res = await fetch(`${QNA_API_BASE}/qna?${query.toString()}`);
  if (!res.ok) throw new Error(`QnA API error: ${res.status}`);
  return res.json();
}

export function useQnAListQuery(params: QnAQueryParams) {
  return useQuery({
    queryKey: qnaKeys.list(params),
    queryFn: () => fetchQnAList(params),
    placeholderData: (prev) => prev,
  });
}

export interface QnACreateParams {
  category: string;
  title: string;
  author: string;
  content: string;
  attachments: File[];
}

async function postQnAInsert(params: QnACreateParams): Promise<QnAListResult> {
  const formData = new FormData();
  formData.append("category", params.category);
  formData.append("title", params.title);
  formData.append("author", params.author);
  formData.append("content", params.content);
  params.attachments.forEach((file) => formData.append("attachments", file));

  const res = await fetch(`${QNA_API_BASE}/qna/insert`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`QnA insert API error: ${res.status}`);
  return res.json();
}

export function useQnAInsertMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postQnAInsert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qnaKeys.all });
    },
  });
}

export function useQnADetailQuery(id: number) {
  return useQuery({
    queryKey: qnaKeys.detail(id),
    queryFn: () => Promise.resolve(getQnADetail(id)),
    enabled: id > 0,
  });
}
