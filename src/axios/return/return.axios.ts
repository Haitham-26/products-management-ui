import type { CreateReturnDto } from "../../model/return/dto/CreateReturnDto";
import type { GetReturnsDto } from "../../model/return/dto/GetReturnsDto";
import type { ActivateReturnDto } from "../../model/return/dto/ActivateReturnDto";
import type { UpdateReturnDto } from "../../model/return/dto/UpdateReturnDto";
import type { CancelReturnDto } from "../../model/return/dto/CancelReturnDto";
import type { Return } from "../../model/return/types/Return";
import type { PaginatedResponse } from "../../model/shared/meta/PaginatedResponse";
import AppAxios from "../AppAxios";

export class ReturnAxios {
  static getReturns(dto: GetReturnsDto) {
    return AppAxios.get<PaginatedResponse<Return>>("/returns", {
      params: dto,
    }).then(({ data }) => data);
  }

  static createReturn(dto: CreateReturnDto) {
    return AppAxios.post("/returns/create", dto).then(({ data }) => data);
  }

  static cancelReturn(dto: CancelReturnDto) {
    return AppAxios.post(`/returns/cancel`, dto).then(({ data }) => data);
  }

  static activateReturn(dto: ActivateReturnDto) {
    return AppAxios.post(`/returns/activate`, dto).then(({ data }) => data);
  }

  static updateReturn(dto: UpdateReturnDto) {
    return AppAxios.patch<void>(`/returns/update`, dto).then(
      ({ data }) => data,
    );
  }
}
