import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const tagState = (state: RootState) => state.tags;

const selectTags = createSelector(tagState, (state) => state.tags || []);
const selectTagsLoading = createSelector(
  tagState,
  (state) => state.tagsLoading,
);

const tagSliceSelectors = {
  selectTags,
  selectTagsLoading,
};

export default tagSliceSelectors;
