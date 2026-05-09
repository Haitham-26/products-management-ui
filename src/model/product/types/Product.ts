import type { Category } from "../../category/types/Category";
import type { Tag } from "../../tag/types/Tag";
import type { ProductDiscount } from "./ProductDiscount";

export interface Product {
  _id: string;
  identifier: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  discount?: ProductDiscount;
  priceAfterDiscount?: number;
  category?: Partial<Category>;
  tags?: Partial<Tag>[];
  minStock?: number;
  createdAt: string;
  updatedAt: string;
}
