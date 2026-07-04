import type { BulkManageOrderStatusDto } from "../../model/order/dto/BulkManageOrderStatusDto";
import type { BulkManageOrderVisibilityDto } from "../../model/order/dto/BulkManageOrderVisibilityDto";
import type { CreateOrderDto } from "../../model/order/dto/CreateOrderDto";
import type { ManageOrderStatusDto } from "../../model/order/dto/ManageOrderStatusDto";
import type { UpdateOrderDto } from "../../model/order/dto/UpdateOrderDto";
import type { Order } from "../../model/order/types/Order";
import type { GenericWithUserId } from "../../model/shared/dto/GenericWithUserId";
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
    return AppAxios.patch<void>(`/orders/update`, dto).then(({ data }) => data);
  }

  static bulkManageOrderVisibility(dto: BulkManageOrderVisibilityDto) {
    return AppAxios.patch<void>(`/orders/manage-visibility/bulk`, dto).then(
      ({ data }) => data,
    );
  }

  static manageOrderStatus(dto: ManageOrderStatusDto) {
    return AppAxios.patch<void>(`/orders/manage-status`, dto).then(
      ({ data }) => data,
    );
  }

  static bulkManageOrderStatus(dto: BulkManageOrderStatusDto) {
    return AppAxios.patch<void>(`/orders/manage-status/bulk`, dto).then(
      ({ data }) => data,
    );
  }
}
