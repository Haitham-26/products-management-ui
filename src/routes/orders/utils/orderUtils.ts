import isNil from "lodash/isNil";
import type { GetOrdersDto } from "../../../model/order/dto/GetOrdersDto";

export const parseOrdersFiltersFromParams = (
  params: URLSearchParams,
  meta: GetOrdersDto["meta"],
): Partial<GetOrdersDto> => ({
  keyword: params.get("keyword") || "",
  meta:
    params.get("page") || params.get("limit")
      ? {
          page: params.get("page") ? Number(params.get("page")) : undefined,
          limit: params.get("limit") ? Number(params.get("limit")) : undefined,
        }
      : meta,
  creationDate: params.get("creationDate") as GetOrdersDto["creationDate"],
  minTotalAmount: params.get("minTotalAmount")
    ? Number(params.get("minTotalAmount"))
    : undefined,
  maxTotalAmount: params.get("maxTotalAmount")
    ? Number(params.get("maxTotalAmount"))
    : undefined,
  minTotalProfit: params.get("minTotalProfit")
    ? Number(params.get("minTotalProfit"))
    : undefined,
  maxTotalProfit: params.get("maxTotalProfit")
    ? Number(params.get("maxTotalProfit"))
    : undefined,
  status: params.get("status") as GetOrdersDto["status"],
  showArchived: params.get("showArchived") === "true",
});

export const buildOrdersParams = (
  filters: Partial<GetOrdersDto>,
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
  set("minTotalAmount", filters.minTotalAmount?.toString());
  set("maxTotalAmount", filters.maxTotalAmount?.toString());
  set("minTotalProfit", filters.minTotalProfit?.toString());
  set("maxTotalProfit", filters.maxTotalProfit?.toString());
  set("status", filters.status);
  set("showArchived", filters.showArchived?.toString());

  // to force reload
  next.set("u", new Date().getTime().toString());

  return next;
};

export const countOrdersActiveFilters = (filters: Partial<GetOrdersDto>) => {
  let n = 0;

  const applyConditions = [
    !isNil(filters.minTotalAmount) || !isNil(filters.maxTotalAmount),
    !isNil(filters.minTotalProfit) || !isNil(filters.maxTotalProfit),
    filters.status,
    !isNil(filters.creationDate),
    filters.showArchived,
  ];

  applyConditions.forEach((cond) => {
    if (cond) {
      n++;
    }
  });

  return n;
};
