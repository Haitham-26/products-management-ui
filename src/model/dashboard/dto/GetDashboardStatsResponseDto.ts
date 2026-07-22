export interface GetDashboardStatsResponseDto {
  totalRevenue: number;
  totalProfit: number;
  ordersCountByStatus: {
    pending: number;
    delivered: number;
    canceled: number;
  };
  productsCountByStatus: {
    outOfStock: number;
    lowStock: number;
  };
  profitAndRevenue: {
    date?: string | null;
    profit: number;
    revenue: number;
  }[];
  mostSoldProducts: {
    _id: string;
    name: string;
    totalSold: number;
    image?: string;
  }[];
}
