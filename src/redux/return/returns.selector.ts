import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const returnState = (state: RootState) => state.returns;

const selectReturns = createSelector(
  returnState,
  (state) => state.returns || [],
);
const selectReturnsLoading = createSelector(
  returnState,
  (state) => state.returnsLoading,
);
const selectReturnsMeta = createSelector(returnState, (state) => state.meta);

const returnSliceSelectors = {
  selectReturns,
  selectReturnsLoading,
  selectReturnsMeta,
};

export default returnSliceSelectors;
