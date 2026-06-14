import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { Product } from "../types/Product";
import type { ProductDiscount } from "../types/ProductDiscount";

type Tag = {
  tag: string;
};

export interface UpdateProductDto extends GenericWithUserId {
  productId: string;
  name?: Product["name"];
  description?: Product["description"];
  status?: Product["status"];
  price?: Product["price"];
  quantity?: Product["quantity"];
  discount?: ProductDiscount;
  categoryId?: string;
  tags?: Tag[];
  minStock?: Product["minStock"];
}
