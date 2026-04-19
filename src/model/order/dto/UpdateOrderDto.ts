import type { GenericWithUserId } from "../../shared/GenericWithUserId";
import type { CreateUpdateOrderItem } from "../types/CreateUpdateOrderItem";

export interface UpdateOrderDto extends GenericWithUserId {
  orderId: string;
  items?: CreateUpdateOrderItem[];
  note?: string;
}
