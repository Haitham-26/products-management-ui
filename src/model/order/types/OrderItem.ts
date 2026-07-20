import type { ProductDiscount } from "../../product/types/ProductDiscount";

export interface OrderItem {
  productId: string;
  productName: string;
  productMainImage?: string;
  productGalleryImages?: string[];
  quantity: number;
  purchasePriceAtPurchase: number;
  salePriceAtPurchase: number;
  discountAtPurchase?: ProductDiscount;
  finalSalePriceAtPurchase: number;
  totalProfit: number;
}
