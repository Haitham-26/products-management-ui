import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";

export interface DeleteProductDto extends GenericWithUserId {
  productId: string;
}
