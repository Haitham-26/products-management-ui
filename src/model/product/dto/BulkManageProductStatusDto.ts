import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { ProductStatus } from "../types/ProductStatus.enum";

export interface BulkManageProductStatusDto extends GenericWithUserId {
  productIds: string[];
  status: ProductStatus;
}
