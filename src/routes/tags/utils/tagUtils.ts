import isNil from "lodash/isNil";
import type { GetTagsDto } from "../../../model/tag/dto/GetTagsDto";

export const parseTagsFiltersFromParams = (
  params: URLSearchParams,
  meta: GetTagsDto["meta"],
): GetTagsDto => ({
  keyword: params.get("keyword") || "",
  sortBy: params.get("sortBy") as GetTagsDto["sortBy"],
  datePeriod: params.get("datePeriod") as GetTagsDto["datePeriod"],
  meta:
    params.get("page") || params.get("limit")
      ? {
          page: params.get("page") ? Number(params.get("page")) : undefined,
          limit: params.get("limit") ? Number(params.get("limit")) : undefined,
        }
      : meta,
  minUsageCount: params.get("minUsageCount")
    ? Number(params.get("minUsageCount"))
    : undefined,
  maxUsageCount: params.get("maxUsageCount")
    ? Number(params.get("maxUsageCount"))
    : undefined,
});

export const buildTagsParams = (
  filters: Partial<GetTagsDto>,
  base: URLSearchParams,
): URLSearchParams => {
  const next = new URLSearchParams(base);

  const set = (key: string, val: string | undefined | null) => {
    if (isNil(val) || val === "") {
      next.delete(key);
    } else {
      next.set(key, val);
    }
  };

  set("keyword", filters.keyword);
  set("sortBy", filters.sortBy);
  set("datePeriod", filters.datePeriod);
  set("page", filters.meta?.page?.toString() || "0");
  set("limit", filters.meta?.limit?.toString() || "10");
  set("minUsageCount", filters.minUsageCount?.toString());
  set("maxUsageCount", filters.maxUsageCount?.toString());

  return next;
};

export const countTagsActiveFilters = (filters: Partial<GetTagsDto>) => {
  let n = 0;

  const applyConditions = [
    !isNil(filters.sortBy),
    !isNil(filters.datePeriod),
    !isNil(filters.minUsageCount) || !isNil(filters.maxUsageCount),
  ];

  applyConditions.forEach((cond) => {
    if (cond) {
      n++;
    }
  });

  return n;
};
