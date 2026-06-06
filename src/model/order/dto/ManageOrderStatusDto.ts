import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { OrderStatus } from "../types/OrderStatus.enum";

export interface ManageOrderStatusDto extends GenericWithUserId {
  orderId: string;
  status: OrderStatus;
}
