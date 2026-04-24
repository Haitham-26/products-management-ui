import type { GenericWithUserId } from "../../shared/GenericWithUserId";
import type { CreateOrderItem } from "../types/CreateOrderItem";

export interface CreateOrderDto extends GenericWithUserId {
  items: CreateOrderItem[];
  note?: string;
}
