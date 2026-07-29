import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { DatePeriodFilters } from "../../shared/types/DatePeriodFilters.enum";
import type { SortKind } from "../../shared/types/SortKind.enum";
import type { ReturnStatus } from "../types/ReturnStatus.enum";

export interface GetReturnsDto {
  meta?: PaginationMeta;
  keyword?: string;
  sortBy?: SortKind;
  datePeriod?: DatePeriodFilters;
  status?: ReturnStatus;
}
