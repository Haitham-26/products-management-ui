import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { DatePeriodFilters } from "../../shared/types/DatePeriodFilters.enum";
import type { SortKind } from "../../shared/types/SortKind.enum";
import type { OrderStatus } from "../types/OrderStatus.enum";

export interface GetOrdersDto {
  meta?: PaginationMeta;
  keyword?: string;
  sortBy?: SortKind;
  datePeriod?: DatePeriodFilters;
  minTotalRevenue?: number;
  maxTotalRevenue?: number;
  minTotalProfit?: number;
  maxTotalProfit?: number;
  minNetRevenue?: number;
  maxNetRevenue?: number;
  minNetProfit?: number;
  maxNetProfit?: number;
  status?: OrderStatus;
  showArchived?: boolean;
}
