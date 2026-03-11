import { useMemo } from "react";

interface UsePageHeaderParams {
  title: string;
  onBack?: () => void;
}

export function usePageHeader({ title, onBack }: UsePageHeaderParams) {
  return useMemo(
    () => ({
      data: {
        title,
      },
      onBack,
    }),
    [onBack, title],
  );
}
