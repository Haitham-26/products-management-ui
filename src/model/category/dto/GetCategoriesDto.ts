import type { GenericWithUserId } from "../../shared/GenericWithUserId";
import type { PaginationMeta } from "../../shared/meta/PaginationMeta";

export interface GetCategoriesDto extends GenericWithUserId {
  meta?: PaginationMeta;
  keyword?: string;
  minChildrenCount?: number;
  maxChildrenCount?: number;
}
