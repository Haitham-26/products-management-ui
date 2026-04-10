import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface DeleteCategoryDto extends GenericWithUserId {
  categoryId: string;
}
