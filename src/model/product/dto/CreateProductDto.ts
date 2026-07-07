import type { UploadFile } from "antd";
import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { ProductDiscount } from "../types/ProductDiscount";

export interface CreateProductDto extends GenericWithUserId {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  discount?: ProductDiscount;
  categoryId?: string;
  tags?: string[];
  minStock?: number;
  mainImage?: UploadFile;
  galleryImages?: UploadFile[];
}
