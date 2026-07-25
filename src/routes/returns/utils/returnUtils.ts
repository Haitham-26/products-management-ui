import isNil from "lodash/isNil";
import type { GetReturnsDto } from "../../../model/return/dto/GetReturnsDto";

export const parseReturnsFiltersFromParams = (
  params: URLSearchParams,
  meta: GetReturnsDto["meta"],
): Partial<GetReturnsDto> => ({
  keyword: params.get("keyword") || "",
  sortBy: params.get("sortBy") as GetReturnsDto["sortBy"],
  datePeriod: params.get("datePeriod") as GetReturnsDto["datePeriod"],
  status: params.get("status") as GetReturnsDto["status"],
  meta:
    params.get("page") || params.get("limit")
      ? {
          page: params.get("page") ? Number(params.get("page")) : undefined,
          limit: params.get("limit") ? Number(params.get("limit")) : undefined,
        }
      : meta,
});

export const buildReturnsParams = (
  filters: Partial<GetReturnsDto>,
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
  set("status", filters.status);

  // to force reload
  next.set("u", new Date().getTime().toString());

  return next;
};

export const countReturnsActiveFilters = (filters: Partial<GetReturnsDto>) => {
  let n = 0;

  const applyConditions = [
    !isNil(filters.sortBy),
    !isNil(filters.status),
    !isNil(filters.datePeriod),
  ];

  applyConditions.forEach((cond) => {
    if (cond) {
      n++;
    }
  });

  return n;
};
