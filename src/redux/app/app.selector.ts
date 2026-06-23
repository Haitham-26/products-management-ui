import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const appState = (state: RootState) => state.app;

const selectLastSeenInvitationId = createSelector(
  appState,
  (state) => state?.lastSeenInvitationId || [],
);

const appSliceSelectors = {
  selectLastSeenInvitationId,
};

export default appSliceSelectors;
