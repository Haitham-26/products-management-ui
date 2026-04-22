import type { OrderItem } from "./OrderItem";
import type { OrderStatus } from "./OrderStatus.enum";

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  note?: string;
  status: OrderStatus;
  totalPriceAtPurchase: number;
  createdAt: string;
  updatedAt: string;
}
