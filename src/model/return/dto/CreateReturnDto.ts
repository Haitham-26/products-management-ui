export interface CreateReturnDto {
  orderId: string;
  returnReason: string;
  items: {
    productId: string;
    totalReturnedCount: number;
    restockedCount: number;
  }[];
}
