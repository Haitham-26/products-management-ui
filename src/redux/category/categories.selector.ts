import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const categoryState = (state: RootState) => state.categories;

const selectCategories = createSelector(
  categoryState,
  (state) => state.categories || [],
);
const selectCategoriesLoading = createSelector(
  categoryState,
  (state) => state.categoriesLoading,
);

const categorySliceSelectors = {
  selectCategories,
  selectCategoriesLoading,
};

export default categorySliceSelectors;
