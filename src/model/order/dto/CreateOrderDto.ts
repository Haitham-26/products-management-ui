import type { GenericWithUserId } from "../../shared/GenericWithUserId";
import type { CreateOrderItem } from "../types/CreateOrderItem";

export interface CreateOrderDto extends GenericWithUserId {
  customerName: string;
  customerPhone?: string;
  items: CreateOrderItem[];
  note?: string;
}
