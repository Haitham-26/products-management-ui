import type { ProductDiscount } from "../../product/types/ProductDiscount";

export interface OrderItem {
  productId: string;
  productName: string;
  productMainImage?: string;
  productGalleryImages?: string[];
  quantity: number;
  priceAtPurchase: number;
  discountAtPurchase?: ProductDiscount;
  finalPrice: number;
}
