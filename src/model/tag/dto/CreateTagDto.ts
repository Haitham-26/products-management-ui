import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface CreateTagDto extends GenericWithUserId {
  name: string;
  description?: string;
  tagIds?: string[];
}
