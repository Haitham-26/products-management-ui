import type { CreateOrderDto } from "../../model/order/dto/CreateOrderDto";
import type { DeleteOrderDto } from "../../model/order/dto/DeleteOrderDto";
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

  static deleteOrder(dto: DeleteOrderDto) {
    return AppAxios.delete(`/orders/${dto.orderId}/delete`).then(
      ({ data }) => data,
    );
  }

  static updateOrder(dto: UpdateOrderDto) {
    return AppAxios.patch<void>(`/orders/${dto.orderId}/update`, dto).then(
      ({ data }) => data,
    );
  }
}
