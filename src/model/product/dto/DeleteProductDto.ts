import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface DeleteProductDto extends GenericWithUserId {
  productId: string;
}
