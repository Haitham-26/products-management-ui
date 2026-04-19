import type { GenericWithUserId } from "../../shared/GenericWithUserId";
import type { CreateUpdateOrderItem } from "../types/CreateUpdateOrderItem";

export interface CreateOrderDto extends GenericWithUserId {
  items: CreateUpdateOrderItem[];
  note?: string;
}
