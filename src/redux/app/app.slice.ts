import { createSlice } from "@reduxjs/toolkit";
import { userActions } from "../user/user.slice";
import type { PermissionEntities } from "../../model/user/types/PermissionEntities";
import { DataDisplayLayout } from "../../model/app/types/DataDisplayLayout.enum";

interface AppState {
  lastSeenInvitationId?: string;
  dataDisplayLayout: Record<PermissionEntities, DataDisplayLayout>;
}

const initialState: AppState = {
  lastSeenInvitationId: undefined,
  dataDisplayLayout: {
    categories: DataDisplayLayout.TABLE,
    orders: DataDisplayLayout.TABLE,
    products: DataDisplayLayout.TABLE,
    returns: DataDisplayLayout.TABLE,
    tags: DataDisplayLayout.TABLE,
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLastSeenInvitationId: (state, action) => {
      state.lastSeenInvitationId = action.payload;
    },
    setDataEntityDisplayLayout: (
      state,
      action: {
        payload: { entity: PermissionEntities; layout: DataDisplayLayout };
      },
    ) => {
      state.dataDisplayLayout = {
        ...state.dataDisplayLayout,
        [action.payload.entity]: action.payload.layout,
      };
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(userActions.logout.fulfilled, () => initialState);
  },
});

const appActions = {
  ...appSlice.actions,
};

export { appActions };

export default appSlice.reducer;
