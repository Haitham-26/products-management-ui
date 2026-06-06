import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface UpdateCategoryDto extends GenericWithUserId {
  categoryId: string;
  name?: string;
  description?: string;
}
