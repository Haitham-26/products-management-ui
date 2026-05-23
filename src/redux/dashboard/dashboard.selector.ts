import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { GetDashboardStatsResponseDto } from "../../model/dashboard/dto/GetDashboardStatsResponseDto";

const dashboardState = (state: RootState) => state.dashboard;

const selectDashboardStats = createSelector(
  dashboardState,
  (state) => (state.stats || {}) as GetDashboardStatsResponseDto,
);

const selectDashboardStatsLoading = createSelector(
  dashboardState,
  (state) => state.statsLoading,
);

const dashboardSliceSelectors = {
  selectDashboardStats,
  selectDashboardStatsLoading,
};

export default dashboardSliceSelectors;
