import type { OrderItem } from "./OrderItem";
import type { OrderStatus } from "./OrderStatus.enum";

export interface Order {
  _id: string;
  identifier: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  userId: string;
  items: OrderItem[];
  note?: string;
  status: OrderStatus;
  totalAmount: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
