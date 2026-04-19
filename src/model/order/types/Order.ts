import type { CreateUpdateOrderItem } from "./CreateUpdateOrderItem";
import type { OrderStatus } from "./OrderStatus.enum";

export interface Order {
  _id: string;
  userId: string;
  items: CreateUpdateOrderItem[];
  note?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
