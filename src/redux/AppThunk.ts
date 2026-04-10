import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "./store";
import { AxiosError } from "axios";

export const AppThunk = <Returned, ThunkArg = void>(
  prefix: string,
  action: (arg: ThunkArg) => Promise<Returned>,
) => {
  return createAsyncThunk<
    Returned,
    ThunkArg,
    { state: RootState; dispatch: AppDispatch; rejectValue: string }
  >(prefix, async (arg, { rejectWithValue }) => {
    try {
      const data = await action(arg);

      return data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message || "Action failed");
      }

      return rejectWithValue("Action failed");
    }
  });
};
