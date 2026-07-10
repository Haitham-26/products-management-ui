import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import { userActions } from "../user/user.slice";
import type { Settings } from "../../model/settings/types/Settings";
import type { UpdateSettingsDto } from "../../model/settings/dto/UpdateSettingsDto";
import { SettingsAxios } from "../../axios/settings/settings.axios";

interface SettingsState {
  settings?: Settings;
}

const initialState: SettingsState = {
  settings: undefined,
};

const updateSettings = AppThunk<void, UpdateSettingsDto>(
  "/settings/update",
  SettingsAxios.updateSettings,
);

const getSettings = AppThunk<Settings, void>(
  "/settings",
  SettingsAxios.getSettings,
);

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getSettings.fulfilled, (state, action) => {
      state.settings = action.payload;
    });

    addCase(userActions.logout.fulfilled, () => initialState);
  },
});

const settingsActions = {
  updateSettings,
  getSettings,
};

export { settingsActions };

export default settingsSlice.reducer;
