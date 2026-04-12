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
const selectCategoriesMeta = createSelector(
  categoryState,
  (state) => state.meta,
);

const categorySliceSelectors = {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesMeta,
};

export default categorySliceSelectors;
