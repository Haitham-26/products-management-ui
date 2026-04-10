import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface UpdateCategoryDto extends GenericWithUserId {
  categoryId: string;
  name?: string;
  description?: string;
}
