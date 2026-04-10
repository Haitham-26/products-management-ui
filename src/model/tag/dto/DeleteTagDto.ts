import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface DeleteTagDto extends GenericWithUserId {
  tagId: string;
}
