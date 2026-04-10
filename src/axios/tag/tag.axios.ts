import type { GenericWithUserId } from "../../model/shared/GenericWithUserId";
import type { CreateTagDto } from "../../model/tag/dto/CreateTagDto";
import type { DeleteTagDto } from "../../model/tag/dto/DeleteTagDto";
import type { UpdateTagDto } from "../../model/tag/dto/UpdateTagDto";
import type { Tag } from "../../model/tag/types/Tag";
import AppAxios from "../AppAxios";

export class TagAxios {
  static createTag(dto: CreateTagDto) {
    return AppAxios.post("/tags/create", dto).then(({ data }) => data);
  }

  static getTags(dto: GenericWithUserId) {
    return AppAxios.post<Tag[]>("/tags", dto).then(({ data }) => data);
  }

  static deleteTag(dto: DeleteTagDto) {
    return AppAxios.delete(`/tags/${dto.tagId}/delete`).then(
      ({ data }) => data,
    );
  }

  static updateTag(dto: UpdateTagDto) {
    return AppAxios.patch<void>(`/tags/${dto.tagId}/update`, dto).then(
      ({ data }) => data,
    );
  }
}
