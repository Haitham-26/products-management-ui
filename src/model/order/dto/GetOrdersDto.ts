import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { SortKind } from "../../shared/types/SortKind.enum";
import type { OrderStatus } from "../types/OrderStatus.enum";

export interface GetOrdersDto {
  meta?: PaginationMeta;
  keyword?: string;
  creationDate?: SortKind;
  minTotalRevenue?: number;
  maxTotalRevenue?: number;
  minTotalProfit?: number;
  maxTotalProfit?: number;
  status?: OrderStatus;
  showArchived?: boolean;
}
