import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface DeleteBulkProductsDto extends GenericWithUserId {
  productIds: string[];
}
