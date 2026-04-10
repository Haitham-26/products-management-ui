import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const userState = (state: RootState) => state.user;

const selectUser = createSelector(userState, (state) => state?.user || {});
const selectUserId = createSelector(userState, (state) => state?.user?._id);

const userSliceSelectors = {
  selectUser,
  selectUserId,
};

export default userSliceSelectors;
