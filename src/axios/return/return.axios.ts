import type { CreateReturnDto } from "../../model/return/dto/CreateReturnDto";
import type { GetReturnsDto } from "../../model/return/dto/GetReturnsDto";
import type { UnvoidReturnDto } from "../../model/return/dto/UnvoidReturnDto";
import type { UpdateReturnDto } from "../../model/return/dto/UpdateReturnDto";
import type { VoidReturnDto } from "../../model/return/dto/VoidReturnDto";
import type { Return } from "../../model/return/types/Return";
import type { PaginatedResponse } from "../../model/shared/meta/PaginatedResponse";
import AppAxios from "../AppAxios";

export class ReturnAxios {
  static createReturn(dto: CreateReturnDto) {
    return AppAxios.post("/returns/create", dto).then(({ data }) => data);
  }

  static getReturns(dto: GetReturnsDto) {
    return AppAxios.get<PaginatedResponse<Return>>("/returns", {
      params: dto,
    }).then(({ data }) => data);
  }

  static voidReturn(dto: VoidReturnDto) {
    return AppAxios.post(`/returns/void`, dto).then(({ data }) => data);
  }

  static unvoidReturn(dto: UnvoidReturnDto) {
    return AppAxios.post(`/returns/unvoid`, dto).then(({ data }) => data);
  }

  static updateReturn(dto: UpdateReturnDto) {
    return AppAxios.patch<void>(`/returns/update`, dto).then(
      ({ data }) => data,
    );
  }
}
