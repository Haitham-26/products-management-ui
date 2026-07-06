import type { UploadFile } from "antd";
import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { Product } from "../types/Product";
import type { ProductDiscount } from "../types/ProductDiscount";

export interface UpdateProductDto extends GenericWithUserId {
  productId: string;
  name?: Product["name"];
  description?: Product["description"];
  status?: Product["status"];
  price?: Product["price"];
  quantity?: Product["quantity"];
  discount?: ProductDiscount;
  categoryId?: string;
  tags?: string[];
  minStock?: Product["minStock"];
  mainImage?: string | UploadFile;
  galleryImages?: (string | UploadFile)[];
}
