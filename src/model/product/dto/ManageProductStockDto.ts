import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface ManageProductStockDto extends GenericWithUserId {
  productId: string;
  stockChange: number;
}
