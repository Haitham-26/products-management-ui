import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { CreationDateFilters } from "../../shared/types/CreationDateFilters.enum";
import type { ProductDiscount } from "../types/ProductDiscount";
import type { ProductStockStatus } from "../types/ProductStockStatus.enum";

export interface GetProductsDto extends GenericWithUserId {
  meta?: PaginationMeta;
  categoryId?: string;
  tagIds?: string[];
  keyword?: string;
  showDraft?: boolean;
  creationDate?: CreationDateFilters;
  minPurchasePrice?: number;
  maxPurchasePrice?: number;
  minSalePrice?: number;
  maxSalePrice?: number;
  minFinalSalePrice?: number;
  maxFinalSalePrice?: number;
  minProfit?: number;
  maxProfit?: number;
  minQuantity?: number;
  maxQuantity?: number;
  discountType?: ProductDiscount["type"];
  stockStatus?: ProductStockStatus;
}
