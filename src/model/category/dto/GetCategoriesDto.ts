import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { DatePeriodFilters } from "../../shared/types/DatePeriodFilters.enum";
import type { SortKind } from "../../shared/types/SortKind.enum";

export interface GetCategoriesDto extends GenericWithUserId {
  meta?: PaginationMeta;
  keyword?: string;
  sortBy?: SortKind;
  datePeriod?: DatePeriodFilters;
  minUsageCount?: number;
  maxUsageCount?: number;
}
