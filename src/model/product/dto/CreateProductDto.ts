import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { ProductDiscount } from "../types/ProductDiscount";

type Tag = {
  tag: string;
};

export interface CreateProductDto extends GenericWithUserId {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  discount?: ProductDiscount;
  categoryId?: string;
  tags?: Tag[];
  minStock?: number;
}
