import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface UpdateTagDto extends GenericWithUserId {
  tagId: string;
  name?: string;
  description?: string;
}
