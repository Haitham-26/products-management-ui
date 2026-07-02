import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface DeleteBulkTagsDto extends GenericWithUserId {
  tagIds: string[];
}
