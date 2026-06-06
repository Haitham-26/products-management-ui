import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface CreateCategoryDto extends GenericWithUserId {
  name: string;
  description?: string;
}
