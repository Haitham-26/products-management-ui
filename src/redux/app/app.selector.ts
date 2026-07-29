import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { PermissionEntities } from "../../model/user/types/PermissionEntities";

const appState = (state: RootState) => state.app;

const selectLastSeenInvitationId = createSelector(
  appState,
  (state) => state?.lastSeenInvitationId,
);

const selectEntityDisplayLayout = createSelector(
  [appState, (_, entity: PermissionEntities) => entity],
  (state, entity) => state?.dataDisplayLayout?.[entity],
);

const appSliceSelectors = {
  selectLastSeenInvitationId,
  selectEntityDisplayLayout,
};

export default appSliceSelectors;
