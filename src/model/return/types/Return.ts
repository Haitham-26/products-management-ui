import type { ReturnItem } from "./ReturnItem";
import type { ReturnStatus } from "./ReturnStatus.enum";

export interface Return {
  _id: string;
  orderId: string;
  orderIdentifier: string;
  returnReason: string;
  status: ReturnStatus;
  items: ReturnItem[];
  totalReturnAmount: number;
  totalReturnProfit: number;
  returnedAt?: Date;
  voidedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
