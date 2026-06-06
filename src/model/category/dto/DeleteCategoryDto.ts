import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface DeleteCategoryDto extends GenericWithUserId {
  categoryId: string;
}
