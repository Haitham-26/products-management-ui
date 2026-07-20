import isNil from "lodash/isNil";
import type { GetCategoriesDto } from "../../../model/category/dto/GetCategoriesDto";

export const parseCategoriesFiltersFromParams = (
  params: URLSearchParams,
  meta: GetCategoriesDto["meta"],
): Partial<GetCategoriesDto> => ({
  keyword: params.get("keyword") || "",
  creationDate: params.get("creationDate") as GetCategoriesDto["creationDate"],
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

export const buildCategoriesParams = (
  filters: Partial<GetCategoriesDto>,
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
  set("creationDate", filters.creationDate);
  set("page", filters.meta?.page?.toString() || "0");
  set("limit", filters.meta?.limit?.toString() || "10");
  set("minUsageCount", filters.minUsageCount?.toString());
  set("maxUsageCount", filters.maxUsageCount?.toString());

  // to force reload
  next.set("u", new Date().getTime().toString());

  return next;
};

export const countCategoriesActiveFilters = (
  filters: Partial<GetCategoriesDto>,
) => {
  let n = 0;

  const applyConditions = [
    !isNil(filters.creationDate),
    !isNil(filters.minUsageCount) || !isNil(filters.maxUsageCount),
  ];

  applyConditions.forEach((cond) => {
    if (cond) {
      n++;
    }
  });

  return n;
};
