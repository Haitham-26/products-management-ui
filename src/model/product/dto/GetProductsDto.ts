import type { GenericWithUserId } from "../../shared/GenericWithUserId";
import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { ProductDiscount } from "../types/ProductDiscount";
import type { ProductStockStatus } from "../types/ProductStockStatus.enum";

export interface GetProductsDto extends GenericWithUserId {
  meta?: PaginationMeta;
  categoryId?: string;
  tagIds?: string[];
  keyword?: string;
  minBasePrice?: number;
  maxBasePrice?: number;
  minFinalPrice?: number;
  maxFinalPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  discountType?: ProductDiscount["type"];
  stockStatus?: ProductStockStatus;
}
