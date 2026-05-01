import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface UpdateOrderDto extends GenericWithUserId {
  customerName?: string;
  customerPhone?: string;
  orderId: string;
  note?: string;
}
