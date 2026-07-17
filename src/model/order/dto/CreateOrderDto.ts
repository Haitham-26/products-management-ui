import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { CreateOrderItem } from "../types/CreateOrderItem";

export interface CreateOrderDto extends GenericWithUserId {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  items: CreateOrderItem[];
  note?: string;
}
