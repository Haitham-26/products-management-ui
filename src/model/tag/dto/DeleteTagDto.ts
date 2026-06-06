import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface DeleteTagDto extends GenericWithUserId {
  tagId: string;
}
