import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { CreationDateFilters } from "../../shared/types/CreationDateFilters.enum";
import type { OrderStatus } from "../types/OrderStatus.enum";

export interface GetOrdersDto extends GenericWithUserId {
  meta?: PaginationMeta;
  keyword?: string;
  creationDate?: CreationDateFilters;
  minTotalPrice?: number;
  maxTotalPrice?: number;
  status?: OrderStatus;
  showArchived?: boolean;
}
