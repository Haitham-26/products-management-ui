import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface UpdateOrderDto extends GenericWithUserId {
  customerName?: string;
  customerPhone?: string;
  isArchived?: boolean;
  orderId: string;
  note?: string;
}
