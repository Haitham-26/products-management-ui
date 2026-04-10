import isNil from "lodash/isNil";
import type { GetProductsDto } from "../../../model/product/dto/GetProductsDto";
import type { ProductDiscount } from "../../../model/product/types/ProductDiscount";

export const parseFiltersFromParams = (
  params: URLSearchParams,
): Partial<GetProductsDto> => ({
  keyword: params.get("keyword") || "",
  categoryId: params.get("categoryId") || undefined,
  discountType:
    (params.get("discountType") as ProductDiscount["type"]) || undefined,
  tagIds: params.getAll("tagIds"),
  minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
  maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
  minQuantity: params.get("minQuantity")
    ? Number(params.get("minQuantity"))
    : undefined,
  maxQuantity: params.get("maxQuantity")
    ? Number(params.get("maxQuantity"))
    : undefined,
  meta: {
    page: params.get("page") ? Number(params.get("page")) : undefined,
    limit: params.get("limit") ? Number(params.get("limit")) : undefined,
  },
});

export const buildParams = (
  filters: Partial<GetProductsDto>,
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
  set("categoryId", filters.categoryId);
  set("discountType", filters.discountType);
  set("minPrice", filters.minPrice?.toString());
  set("maxPrice", filters.maxPrice?.toString());
  set("minQuantity", filters.minQuantity?.toString());
  set("maxQuantity", filters.maxQuantity?.toString());
  set("page", filters.meta?.page?.toString() || "0");
  set("limit", filters.meta?.limit?.toString() || "10");

  next.delete("tagIds");
  filters.tagIds?.forEach((id) => next.append("tagIds", id));

  return next;
};

export const countActiveFilters = (filters: Partial<GetProductsDto>) => {
  let n = 0;
  if (filters.categoryId) {
    n++;
  }
  if (filters.discountType) {
    n++;
  }
  if (filters.tagIds?.length) {
    n++;
  }
  if (!isNil(filters.minPrice) || !isNil(filters.maxPrice)) {
    n++;
  }
  if (!isNil(filters.minQuantity) || !isNil(filters.maxQuantity)) {
    n++;
  }
  return n;
};
