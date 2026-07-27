import type { ReturnItem } from "./ReturnItem";
import type { ReturnStatus } from "./ReturnStatus.enum";

export interface Return {
  _id: string;
  orderId: string;
  orderIdentifier: string;
  returnReason: string;
  status: ReturnStatus;
  items: ReturnItem[];
  totalReturnRevenue: number;
  totalReturnProfit: number;
  returnedAt?: Date;
  canceledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
