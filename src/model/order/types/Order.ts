import type { OrderItem } from "./OrderItem";
import type { OrderStatus } from "./OrderStatus.enum";

export interface Order {
  _id: string;
  identifier: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  userId: string;
  items: OrderItem[];
  note?: string;
  status: OrderStatus;
  /**
   * @description Total amount paid by the customer (final sale price).
   */
  totalAmount: number;
  /**
   * @description Total profit generated from the sold items.
   */
  totalProfit: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
