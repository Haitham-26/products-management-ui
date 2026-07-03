import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { OrderStatus } from "../types/OrderStatus.enum";

export interface BulkManageOrderStatusDto extends GenericWithUserId {
  orderIds: string[];
  status: OrderStatus;
}
