import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface CreateTagDto extends GenericWithUserId {
  name: string;
  description?: string;
  tagIds?: string[];
}
