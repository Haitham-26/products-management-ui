import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { SortKind } from "../../shared/types/SortKind.enum";

export interface GetTagsDto extends GenericWithUserId {
  meta?: PaginationMeta;
  keyword?: string;
  creationDate?: SortKind;
  minUsageCount?: number;
  maxUsageCount?: number;
}
