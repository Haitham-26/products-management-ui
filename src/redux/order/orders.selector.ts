import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const orderState = (state: RootState) => state.orders;

const selectOrders = createSelector(orderState, (state) => state.orders || []);
const selectOrdersLoading = createSelector(
  orderState,
  (state) => state.ordersLoading,
);
const selectOrdersMeta = createSelector(orderState, (state) => state.meta);

const orderSliceSelectors = {
  selectOrders,
  selectOrdersLoading,
  selectOrdersMeta,
};

export default orderSliceSelectors;
