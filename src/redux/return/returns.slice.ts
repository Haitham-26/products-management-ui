import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import { userActions } from "../user/user.slice";
import type { PaginationMeta } from "../../model/shared/meta/PaginationMeta";
import type { PaginatedResponse } from "../../model/shared/meta/PaginatedResponse";
import type { Return } from "../../model/return/types/Return";
import type { CreateReturnDto } from "../../model/return/dto/CreateReturnDto";
import { ReturnAxios } from "../../axios/return/return.axios";
import type { GetReturnsDto } from "../../model/return/dto/GetReturnsDto";
import type { CancelReturnDto } from "../../model/return/dto/CancelReturnDto";
import type { ActivateReturnDto } from "../../model/return/dto/ActivateReturnDto";
import type { UpdateReturnDto } from "../../model/return/dto/UpdateReturnDto";

interface ReturnState {
  returns?: Return[];
  returnsLoading?: boolean;
  meta?: PaginationMeta;
}

const initialState: ReturnState = {
  returns: [],
  returnsLoading: false,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
  },
};

const createReturn = AppThunk<void, CreateReturnDto>(
  "/returns/create",
  ReturnAxios.createReturn,
);

const getReturns = AppThunk<PaginatedResponse<Return>, GetReturnsDto>(
  "/returns",
  ReturnAxios.getReturns,
);

const cancelReturn = AppThunk<void, CancelReturnDto>(
  "/returns/cancel",
  ReturnAxios.cancelReturn,
);

const activateReturn = AppThunk<void, ActivateReturnDto>(
  "/returns/activate",
  ReturnAxios.activateReturn,
);

const updateReturn = AppThunk<void, UpdateReturnDto>(
  "/returns/update",
  ReturnAxios.updateReturn,
);

export const returnSlice = createSlice({
  name: "returns",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getReturns.pending, (state) => {
      state.returnsLoading = true;
    });
    addCase(getReturns.fulfilled, (state, action) => {
      state.returns = action.payload.data;
      state.meta = action.payload.meta;
      state.returnsLoading = false;
    });
    addCase(getReturns.rejected, (state) => {
      state.returnsLoading = false;
    });

    addCase(userActions.logout.fulfilled, () => initialState);
  },
});

const returnActions = {
  createReturn,
  getReturns,
  cancelReturn,
  activateReturn,
  updateReturn,
};

export { returnActions };

export default returnSlice.reducer;
