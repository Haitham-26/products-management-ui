import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface UpdateTagDto extends GenericWithUserId {
  tagId: string;
  name?: string;
  description?: string;
}
