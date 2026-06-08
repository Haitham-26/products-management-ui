import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { CreationDateFilters } from "../../shared/types/CreationDateFilters.enum";

export interface GetCategoriesDto extends GenericWithUserId {
  meta?: PaginationMeta;
  keyword?: string;
  creationDate?: CreationDateFilters;
  minChildrenCount?: number;
  maxChildrenCount?: number;
}
