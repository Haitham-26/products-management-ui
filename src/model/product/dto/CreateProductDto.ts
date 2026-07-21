import type { UploadFile } from "antd";
import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { ProductDiscount } from "../types/ProductDiscount";
import type { Product } from "../types/Product";

export interface CreateProductDto extends GenericWithUserId {
  name: Product["name"];
  description?: Product["description"];
  purchasePrice: Product["purchasePrice"];
  salePrice: Product["salePrice"];
  quantity: Product["quantity"];
  discount?: ProductDiscount;
  categoryId?: string;
  tags?: string[];
  minStock?: Product["minStock"];
  mainImage?: UploadFile;
  galleryImages?: UploadFile[];
}
