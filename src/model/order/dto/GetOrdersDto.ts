import type { GenericWithUserId } from "../../shared/GenericWithUserId";
import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { OrderStatus } from "../types/OrderStatus.enum";

export interface GetOrdersDto extends GenericWithUserId {
  meta?: PaginationMeta;
  keyword?: string;
  minTotalPrice?: number;
  maxTotalPrice?: number;
  status?: OrderStatus;
}
