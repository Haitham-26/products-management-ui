import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { DatePeriodFilters } from "../../shared/types/DatePeriodFilters.enum";
import type { SortKind } from "../../shared/types/SortKind.enum";

export interface GetTagsDto {
  meta?: PaginationMeta;
  keyword?: string;
  sortBy?: SortKind;
  datePeriod?: DatePeriodFilters;
  minUsageCount?: number;
  maxUsageCount?: number;
}
