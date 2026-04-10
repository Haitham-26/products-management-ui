import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const productState = (state: RootState) => state.products;

const selectProducts = createSelector(
  productState,
  (state) => state.products || [],
);
const selectProductsLoading = createSelector(
  productState,
  (state) => state.productsLoading,
);
const selectProductsMeta = createSelector(productState, (state) => state.meta);

const productSliceSelectors = {
  selectProducts,
  selectProductsLoading,
  selectProductsMeta,
};

export default productSliceSelectors;
