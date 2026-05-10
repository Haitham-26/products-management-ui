import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Settings } from "../../model/settings/types/Settings";

const settingsState = (state: RootState) => state.settings;

const selectSettings = createSelector(
  settingsState,
  (state) => (state.settings || {}) as Settings,
);

const settingsSliceSelectors = {
  selectSettings,
};

export default settingsSliceSelectors;
