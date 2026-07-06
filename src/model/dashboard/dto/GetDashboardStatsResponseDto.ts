export interface GetDashboardStatsResponseDto {
  products: {
    totalCount: number;
    todayCount: number;
    lastWeekCount: number;
    lastMonthCount: number;
  };
  orders: {
    totalCount: number;
    todayCount: number;
    lastWeekCount: number;
    lastMonthCount: number;
  };
  lowStockProducts: {
    totalCount: number;
  };
  outOfStockProducts: {
    totalCount: number;
  };
  mostSoldProducts: Array<{
    _id: string;
    name: string;
    totalSold: number;
    image?: string;
  }>;
}
