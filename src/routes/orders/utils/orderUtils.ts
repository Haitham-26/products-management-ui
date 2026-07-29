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
  sortBy: params.get("sortBy") as GetOrdersDto["sortBy"],
  createdDatePeriod: params.get(
    "createdDatePeriod",
  ) as GetOrdersDto["createdDatePeriod"],
  deliveredDatePeriod: params.get(
    "deliveredDatePeriod",
  ) as GetOrdersDto["deliveredDatePeriod"],
  minTotalRevenue: params.get("minTotalRevenue")
    ? Number(params.get("minTotalRevenue"))
    : undefined,
  maxTotalRevenue: params.get("maxTotalRevenue")
    ? Number(params.get("maxTotalRevenue"))
    : undefined,
  minTotalProfit: params.get("minTotalProfit")
    ? Number(params.get("minTotalProfit"))
    : undefined,
  maxTotalProfit: params.get("maxTotalProfit")
    ? Number(params.get("maxTotalProfit"))
    : undefined,
  minNetRevenue: params.get("minNetRevenue")
    ? Number(params.get("minNetRevenue"))
    : undefined,
  maxNetRevenue: params.get("maxNetRevenue")
    ? Number(params.get("maxNetRevenue"))
    : undefined,
  minNetProfit: params.get("minNetProfit")
    ? Number(params.get("minNetProfit"))
    : undefined,
  maxNetProfit: params.get("maxNetProfit")
    ? Number(params.get("maxNetProfit"))
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
  set("sortBy", filters.sortBy);
  set("createdDatePeriod", filters.createdDatePeriod);
  set("deliveredDatePeriod", filters.deliveredDatePeriod);
  set("page", filters.meta?.page?.toString() || "0");
  set("limit", filters.meta?.limit?.toString() || "10");
  set("minTotalRevenue", filters.minTotalRevenue?.toString());
  set("maxTotalRevenue", filters.maxTotalRevenue?.toString());
  set("minTotalProfit", filters.minTotalProfit?.toString());
  set("maxTotalProfit", filters.maxTotalProfit?.toString());
  set("minNetRevenue", filters.minNetRevenue?.toString());
  set("maxNetRevenue", filters.maxNetRevenue?.toString());
  set("minNetProfit", filters.minNetProfit?.toString());
  set("maxNetProfit", filters.maxNetProfit?.toString());
  set("status", filters.status);
  set("showArchived", filters.showArchived?.toString());

  // to force reload
  next.set("u", new Date().getTime().toString());

  return next;
};

export const countOrdersActiveFilters = (filters: Partial<GetOrdersDto>) => {
  let n = 0;

  const applyConditions = [
    !isNil(filters.minTotalRevenue) || !isNil(filters.maxTotalRevenue),
    !isNil(filters.minTotalProfit) || !isNil(filters.maxTotalProfit),
    !isNil(filters.minNetRevenue) || !isNil(filters.maxNetRevenue),
    !isNil(filters.minNetProfit) || !isNil(filters.maxNetProfit),
    filters.status,
    !isNil(filters.sortBy),
    !isNil(filters.createdDatePeriod),
    !isNil(filters.deliveredDatePeriod),
    filters.showArchived,
  ];

  applyConditions.forEach((cond) => {
    if (cond) {
      n++;
    }
  });

  return n;
};
