import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { SortKind } from "../../shared/types/SortKind.enum";

export interface GetCategoriesDto extends GenericWithUserId {
  meta?: PaginationMeta;
  keyword?: string;
  creationDate?: SortKind;
  minUsageCount?: number;
  maxUsageCount?: number;
}
