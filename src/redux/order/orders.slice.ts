import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import type { GenericWithUserId } from "../../model/shared/dto/GenericWithUserId";
import { userActions } from "../user/user.slice";
import type { PaginationMeta } from "../../model/shared/meta/PaginationMeta";
import type { PaginatedResponse } from "../../model/shared/meta/PaginatedResponse";
import type { Order } from "../../model/order/types/Order";
import type { CreateOrderDto } from "../../model/order/dto/CreateOrderDto";
import { OrderAxios } from "../../axios/order/order.axios";
import type { UpdateOrderDto } from "../../model/order/dto/UpdateOrderDto";
import type { ManageOrderStatusDto } from "../../model/order/dto/ManageOrderStatusDto";

interface OrderState {
  orders?: Order[];
  ordersLoading?: boolean;
  meta?: PaginationMeta;
}

const initialState: OrderState = {
  orders: [],
  ordersLoading: false,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
  },
};

const createOrder = AppThunk<void, CreateOrderDto>(
  "/orders/create",
  OrderAxios.createOrder,
);

const getOrders = AppThunk<PaginatedResponse<Order>, GenericWithUserId>(
  "/orders",
  OrderAxios.getOrders,
);

const updateOrder = AppThunk<void, UpdateOrderDto>(
  "/orders/:id/update",
  OrderAxios.updateOrder,
);

const manageOrderStatus = AppThunk<void, ManageOrderStatusDto>(
  "/orders/:id/manage-status",
  OrderAxios.manageOrderStatus,
);

export const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getOrders.pending, (state) => {
      state.ordersLoading = true;
    });
    addCase(getOrders.fulfilled, (state, action) => {
      state.orders = action.payload.data;
      state.meta = action.payload.meta;
      state.ordersLoading = false;
    });
    addCase(getOrders.rejected, (state) => {
      state.ordersLoading = false;
    });

    addCase(userActions.logout.fulfilled, () => initialState);
  },
});

const orderActions = {
  createOrder,
  getOrders,
  updateOrder,
  manageOrderStatus,
};

export { orderActions };

export default orderSlice.reducer;
