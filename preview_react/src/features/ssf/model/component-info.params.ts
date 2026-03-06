import type { ComponentInfoListParams, ComponentPeriod } from "./component-info.types";

const PERIOD_OPTIONS: ComponentPeriod[] = ["1개월", "3개월", "6개월"];

export function parseComponentInfoSearchParams(sp: URLSearchParams): ComponentInfoListParams {
  const keyword = sp.get("keyword") ?? "";
  const periodParam = sp.get("period");
  const period = PERIOD_OPTIONS.includes(periodParam as ComponentPeriod) ? (periodParam as ComponentPeriod) : "3개월";

  return {
    keyword,
    period,
  };
}

export function buildComponentInfoSearchParams(
  prev: URLSearchParams,
  next: Partial<ComponentInfoListParams>
): URLSearchParams {
  const params = new URLSearchParams(prev);

  if (typeof next.keyword === "string") {
    if (next.keyword) params.set("keyword", next.keyword);
    else params.delete("keyword");
  }

  if (next.period) {
    params.set("period", next.period);
  }

  return params;
}
