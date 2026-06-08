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
  minChildrenCount: params.get("minChildrenCount")
    ? Number(params.get("minChildrenCount"))
    : undefined,
  maxChildrenCount: params.get("maxChildrenCount")
    ? Number(params.get("maxChildrenCount"))
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
  set("minChildrenCount", filters.minChildrenCount?.toString());
  set("maxChildrenCount", filters.maxChildrenCount?.toString());

  // to force reload
  next.set("u", new Date().getTime().toString());

  return next;
};

export const countCategoriesActiveFilters = (
  filters: Partial<GetCategoriesDto>,
) => {
  let n = 0;

  if (filters.creationDate) {
    n++;
  }
  if (!isNil(filters.minChildrenCount) || !isNil(filters.maxChildrenCount)) {
    n++;
  }

  return n;
};
