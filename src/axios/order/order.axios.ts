import type { CreateOrderDto } from "../../model/order/dto/CreateOrderDto";
import type { ManageOrderStatusDto } from "../../model/order/dto/ManageOrderStatusDto";
import type { UpdateOrderDto } from "../../model/order/dto/UpdateOrderDto";
import type { Order } from "../../model/order/types/Order";
import type { GenericWithUserId } from "../../model/shared/GenericWithUserId";
import type { PaginatedResponse } from "../../model/shared/meta/PaginatedResponse";
import AppAxios from "../AppAxios";

export class OrderAxios {
  static createOrder(dto: CreateOrderDto) {
    return AppAxios.post("/orders/create", dto).then(({ data }) => data);
  }

  static getOrders(dto: GenericWithUserId) {
    return AppAxios.get<PaginatedResponse<Order>>("/orders", {
      params: dto,
    }).then(({ data }) => data);
  }

  static updateOrder(dto: UpdateOrderDto) {
    return AppAxios.patch<void>(`/orders/${dto.orderId}/update`, dto).then(
      ({ data }) => data,
    );
  }

  static manageOrderStatus(dto: ManageOrderStatusDto) {
    return AppAxios.patch<void>(
      `/orders/${dto.orderId}/manage-status`,
      dto,
    ).then(({ data }) => data);
  }
}
