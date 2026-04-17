import type { GenericWithUserId } from "../../shared/GenericWithUserId";
import type { PaginationMeta } from "../../shared/meta/PaginationMeta";

export interface GetTagsDto extends GenericWithUserId {
  meta?: PaginationMeta;
  keyword?: string;
  minUsageCount?: number;
  maxUsageCount?: number;
}
