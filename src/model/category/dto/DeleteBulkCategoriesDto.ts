import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface DeleteBulkCategoriesDto extends GenericWithUserId {
  categoryIds: string[];
}
