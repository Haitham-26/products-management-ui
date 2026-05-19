import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface ManageProductStockDto extends GenericWithUserId {
  productId: string;
  stockChange: number;
}
