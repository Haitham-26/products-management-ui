import isNil from "lodash/isNil";
import type { GetProductsDto } from "../../../model/product/dto/GetProductsDto";
import type { ProductDiscount } from "../../../model/product/types/ProductDiscount";
import { ProductDiscountTypes } from "../../../model/product/types/ProductDiscountTypes.enum";

export const parseProductsFiltersFromParams = (
  params: URLSearchParams,
  meta: GetProductsDto["meta"],
): Partial<GetProductsDto> => ({
  keyword: params.get("keyword") || "",
  creationDate: params.get("creationDate") as GetProductsDto["creationDate"],
  categoryId: params.get("categoryId") || undefined,
  discountType:
    (params.get("discountType") as ProductDiscount["type"]) || undefined,
  tagIds: params.getAll("tagIds"),
  minBasePrice: params.get("minBasePrice")
    ? Number(params.get("minBasePrice"))
    : undefined,
  maxBasePrice: params.get("maxBasePrice")
    ? Number(params.get("maxBasePrice"))
    : undefined,
  minFinalPrice: params.get("minFinalPrice")
    ? Number(params.get("minFinalPrice"))
    : undefined,
  maxFinalPrice: params.get("maxFinalPrice")
    ? Number(params.get("maxFinalPrice"))
    : undefined,
  minQuantity: params.get("minQuantity")
    ? Number(params.get("minQuantity"))
    : undefined,
  maxQuantity: params.get("maxQuantity")
    ? Number(params.get("maxQuantity"))
    : undefined,
  meta:
    params.get("page") || params.get("limit")
      ? {
          page: params.get("page") ? Number(params.get("page")) : undefined,
          limit: params.get("limit") ? Number(params.get("limit")) : undefined,
        }
      : meta,
  stockStatus: params.get("stockStatus") as GetProductsDto["stockStatus"],
});

export const buildProductsParams = (
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
  set("creationDate", filters.creationDate);
  set("categoryId", filters.categoryId);
  set("discountType", filters.discountType);
  set("minBasePrice", filters.minBasePrice?.toString());
  set("maxBasePrice", filters.maxBasePrice?.toString());
  set("minFinalPrice", filters.minFinalPrice?.toString());
  set("maxFinalPrice", filters.maxFinalPrice?.toString());
  set("minQuantity", filters.minQuantity?.toString());
  set("maxQuantity", filters.maxQuantity?.toString());
  set("page", filters.meta?.page?.toString() || "0");
  set("limit", filters.meta?.limit?.toString() || "10");
  set("stockStatus", filters.stockStatus);

  // to force reload
  next.set("u", new Date().getTime().toString());

  next.delete("tagIds");
  filters.tagIds?.forEach((id) => next.append("tagIds", id));

  return next;
};

export const countProductsActiveFilters = (
  filters: Partial<GetProductsDto>,
) => {
  let n = 0;
  if (filters.creationDate) {
    n++;
  }
  if (filters.categoryId) {
    n++;
  }
  if (filters.discountType) {
    n++;
  }
  if (filters.tagIds?.length) {
    n++;
  }
  if (!isNil(filters.minBasePrice) || !isNil(filters.maxBasePrice)) {
    n++;
  }
  if (!isNil(filters.minFinalPrice) || !isNil(filters.maxFinalPrice)) {
    n++;
  }
  if (!isNil(filters.minQuantity) || !isNil(filters.maxQuantity)) {
    n++;
  }
  if (filters.stockStatus) {
    n++;
  }
  return n;
};

//

export const calculateProductFinalPrice = (
  price: number,
  discount?: ProductDiscount,
) => {
  const discountValue = Number(discount?.value) || 0;

  if (discount?.type === ProductDiscountTypes.PERCENTAGE) {
    return price - (price * discountValue) / 100;
  }

  return price - discountValue;
};
