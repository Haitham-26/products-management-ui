import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface CreateCategoryDto extends GenericWithUserId {
  name: string;
  description?: string;
}
