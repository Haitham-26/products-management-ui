import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import { userActions } from "../user/user.slice";
import type { GetDashboardStatsResponseDto } from "../../model/dashboard/dto/GetDashboardStatsResponseDto";
import { DashboardAxios } from "../../axios/dashboard/dashboard.axios";
import type { GetDashboardStatsDto } from "../../model/dashboard/dto/GetDashboardStatsDto";

interface DashboardState {
  stats: GetDashboardStatsResponseDto;
  statsLoading: boolean;
}

const initialState: DashboardState = {
  stats: {
    totalProfit: 0,
    totalRevenue: 0,
    ordersCountByStatus: {
      pending: 0,
      delivered: 0,
      canceled: 0,
    },
    productsCountByStatus: {
      outOfStock: 0,
      lowStock: 0,
    },
    profitAndRevenue: [
      {
        profit: 0,
        revenue: 0,
        date: null,
      },
    ],
    mostSoldProducts: [],
  },
  statsLoading: false,
};

const getDashboardStats = AppThunk<
  GetDashboardStatsResponseDto,
  GetDashboardStatsDto
>("/dashboard", DashboardAxios.getDashboardStats);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getDashboardStats.pending, (state) => {
      state.statsLoading = true;
    });
    addCase(getDashboardStats.fulfilled, (state, action) => {
      state.stats = action.payload;
      state.statsLoading = false;
    });
    addCase(getDashboardStats.rejected, (state) => {
      state.statsLoading = false;
    });

    addCase(userActions.logout.fulfilled, () => initialState);
  },
});

const dashboardActions = {
  getDashboardStats,
};

export { dashboardActions };

export default dashboardSlice.reducer;
