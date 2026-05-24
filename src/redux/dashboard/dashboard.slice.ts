import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import { userActions } from "../user/user.slice";
import type { GenericWithUserId } from "../../model/shared/GenericWithUserId";
import type { GetDashboardStatsResponseDto } from "../../model/dashboard/dto/GetDashboardStatsResponseDto";
import { DashboardAxios } from "../../axios/dashboard/dashboard.axios";

interface DashboardState {
  stats: GetDashboardStatsResponseDto;
  statsLoading: boolean;
}

const initialState: DashboardState = {
  stats: {
    products: {
      totalCount: 0,
      todayCount: 0,
      lastWeekCount: 0,
      lastMonthCount: 0,
    },
    orders: {
      totalCount: 0,
      todayCount: 0,
      lastWeekCount: 0,
      lastMonthCount: 0,
    },
    lowStockProducts: {
      totalCount: 0,
    },
    outOfStockProducts: {
      totalCount: 0,
    },
    mostSoldProducts: [],
  },
  statsLoading: false,
};

const getDashboardStats = AppThunk<
  GetDashboardStatsResponseDto,
  GenericWithUserId
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
