import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "./store";
import { AxiosError } from "axios";
import { t } from "i18next";

export const AppThunk = <Returned, ThunkArg = void>(
  prefix: string,
  action: (arg: ThunkArg) => Promise<Returned>,
) => {
  return createAsyncThunk<
    Returned,
    ThunkArg,
    { state: RootState; dispatch: AppDispatch; rejectValue: unknown }
  >(prefix, async (arg, { rejectWithValue }) => {
    try {
      const data = await action(arg);

      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e);
      }

      return rejectWithValue(t("errors.general.unexpected"));
    }
  });
};
