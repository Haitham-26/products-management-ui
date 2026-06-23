import { createSlice } from "@reduxjs/toolkit";
import { userActions } from "../user/user.slice";

interface AppState {
  lastSeenInvitationId?: string;
}

const initialState: AppState = {
  lastSeenInvitationId: undefined,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLastSeenInvitationId: (state, action) => {
      state.lastSeenInvitationId = action.payload;
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
