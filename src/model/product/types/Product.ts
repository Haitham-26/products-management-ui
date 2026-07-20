import type { Category } from "../../category/types/Category";
import type { CloudinaryImage } from "../../shared/types/CloudinaryImage";
import type { Tag } from "../../tag/types/Tag";
import type { ProductDiscount } from "./ProductDiscount";
import type { ProductStatus } from "./ProductStatus.enum";

export interface Product {
  _id: string;
  identifier: string;
  name: string;
  description?: string;
  status: ProductStatus;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  discount?: ProductDiscount;
  finalSalePrice: number;
  profit: number;
  category?: Partial<Category>;
  tags?: Partial<Tag>[];
  minStock?: number;
  mainImage?: CloudinaryImage;
  galleryImages?: CloudinaryImage[];
  createdAt: string;
  updatedAt: string;
}
