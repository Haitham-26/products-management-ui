import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface UpdateOrderDto extends GenericWithUserId {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  isArchived?: boolean;
  orderId: string;
  note?: string;
}
