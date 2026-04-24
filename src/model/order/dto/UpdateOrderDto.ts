import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface UpdateOrderDto extends GenericWithUserId {
  orderId: string;
  note?: string;
}
