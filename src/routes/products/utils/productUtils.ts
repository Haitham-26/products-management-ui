import isNil from "lodash/isNil";
import type { GetProductsDto } from "../../../model/product/dto/GetProductsDto";
import type { ProductDiscount } from "../../../model/product/types/ProductDiscount";
import { ProductDiscountTypes } from "../../../model/product/types/ProductDiscountTypes.enum";
import isNaN from "lodash/isNaN";

export const parseProductsFiltersFromParams = (
  params: URLSearchParams,
  meta: GetProductsDto["meta"],
): Partial<GetProductsDto> => ({
  keyword: params.get("keyword") || "",
  showDraft: params.get("showDraft") === "true",
  creationDate: params.get("creationDate") as GetProductsDto["creationDate"],
  categoryId: params.get("categoryId") || undefined,
  discountType:
    (params.get("discountType") as ProductDiscount["type"]) || undefined,
  tagIds: params.getAll("tagIds"),
  minPurchasePrice: params.get("minPurchasePrice")
    ? Number(params.get("minPurchasePrice"))
    : undefined,
  maxPurchasePrice: params.get("maxPurchasePrice")
    ? Number(params.get("maxPurchasePrice"))
    : undefined,
  minSalePrice: params.get("minSalePrice")
    ? Number(params.get("minSalePrice"))
    : undefined,
  maxSalePrice: params.get("maxSalePrice")
    ? Number(params.get("maxSalePrice"))
    : undefined,
  minFinalSalePrice: params.get("minFinalSalePrice")
    ? Number(params.get("minFinalSalePrice"))
    : undefined,
  maxFinalSalePrice: params.get("maxFinalSalePrice")
    ? Number(params.get("maxFinalSalePrice"))
    : undefined,
  minProfit: params.get("minProfit")
    ? Number(params.get("minProfit"))
    : undefined,
  maxProfit: params.get("maxProfit")
    ? Number(params.get("maxProfit"))
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
  set("showDraft", filters.showDraft?.toString());
  set("creationDate", filters.creationDate);
  set("categoryId", filters.categoryId);
  set("discountType", filters.discountType);
  set("minPurchasePrice", filters.minPurchasePrice?.toString());
  set("maxPurchasePrice", filters.maxPurchasePrice?.toString());
  set("minSalePrice", filters.minSalePrice?.toString());
  set("maxSalePrice", filters.maxSalePrice?.toString());
  set("minFinalSalePrice", filters.minFinalSalePrice?.toString());
  set("maxFinalSalePrice", filters.maxFinalSalePrice?.toString());
  set("minProfit", filters.minProfit?.toString());
  set("maxProfit", filters.maxProfit?.toString());
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

  const applyConditions = [
    filters.creationDate,
    filters.showDraft,
    filters.categoryId,
    filters.discountType,
    filters.tagIds?.length,
    !isNil(filters.minPurchasePrice) || !isNil(filters.maxPurchasePrice),
    !isNil(filters.minSalePrice) || !isNil(filters.maxSalePrice),
    !isNil(filters.minFinalSalePrice) || !isNil(filters.maxFinalSalePrice),
    !isNil(filters.minProfit) || !isNil(filters.maxProfit),
    !isNil(filters.minQuantity) || !isNil(filters.maxQuantity),
    filters.stockStatus,
  ];

  applyConditions.forEach((cond) => {
    if (cond) {
      n++;
    }
  });

  return n;
};

//

export const calculateProductFinalSalePrice = (
  salePrice?: number | string,
  discount?: ProductDiscount,
) => {
  const discountValue = Number(discount?.value) || 0;

  const numericSalePrice = Number(salePrice || 0);

  if (discount?.type === ProductDiscountTypes.PERCENTAGE) {
    return numericSalePrice - (numericSalePrice * discountValue) / 100;
  }

  const result = numericSalePrice - discountValue;

  return !isNaN(result) ? result : 0;
};

export const calculateProductProfit = (
  salePrice?: number | string,
  purchasePrice?: number | string,
  discount?: ProductDiscount,
) => {
  const finalSalePrice = calculateProductFinalSalePrice(salePrice, discount);

  const result = finalSalePrice - Number(purchasePrice || 0);

  return !isNaN(result) ? result : 0;
};
