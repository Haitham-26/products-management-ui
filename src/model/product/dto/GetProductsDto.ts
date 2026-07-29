import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { PaginationMeta } from "../../shared/meta/PaginationMeta";
import type { DatePeriodFilters } from "../../shared/types/DatePeriodFilters.enum";
import type { SortKind } from "../../shared/types/SortKind.enum";
import type { ProductDiscount } from "../types/ProductDiscount";
import type { ProductStockStatus } from "../types/ProductStockStatus.enum";

export interface GetProductsDto extends GenericWithUserId {
  meta?: PaginationMeta;
  categoryId?: string;
  tagIds?: string[];
  keyword?: string;
  datePeriod?: DatePeriodFilters;
  showDraft?: boolean;
  sortBy?: SortKind;
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
