import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../model/product/types/Product";
import type { CreateProductDto } from "../../model/product/dto/CreateProductDto";
import { ProductAxios } from "../../axios/product/product.axios";
import { AppThunk } from "../AppThunk";
import type { DeleteProductDto } from "../../model/product/dto/DeleteProductDto";
import { userActions } from "../user/user.slice";
import type { UpdateProductDto } from "../../model/product/dto/UpdateProductDto";
import type { GetProductsDto } from "../../model/product/dto/GetProductsDto";
import type { PaginationMeta } from "../../model/shared/meta/PaginationMeta";
import type { PaginatedResponse } from "../../model/shared/meta/PaginatedResponse";
import type { ManageProductStockDto } from "../../model/product/dto/ManageProductStockDto";
import type { DeleteBulkProductsDto } from "../../model/product/dto/DeleteBulkProductsDto";
import type { BulkManageProductStatusDto } from "../../model/product/dto/BulkManageProductStatusDto";

interface ProductState {
  products?: Product[];
  productsLoading?: boolean;
  meta?: PaginationMeta;
}

const initialState: ProductState = {
  products: [],
  productsLoading: false,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
  },
};

const createProduct = AppThunk<void, CreateProductDto>(
  "/products/create",
  ProductAxios.createProduct,
);

const getProducts = AppThunk<PaginatedResponse<Product>, GetProductsDto>(
  "/products",
  ProductAxios.getProducts,
);

const deleteProduct = AppThunk<void, DeleteProductDto>(
  "/products/delete",
  ProductAxios.deleteProduct,
);

const deleteBulkProducts = AppThunk<void, DeleteBulkProductsDto>(
  "/products/delete/bulk",
  ProductAxios.deleteBulkProducts,
);

const updateProduct = AppThunk<void, UpdateProductDto>(
  "/products/update",
  ProductAxios.updateProduct,
);

const bulkManageProductStatus = AppThunk<void, BulkManageProductStatusDto>(
  "/products/manage-status/bulk",
  ProductAxios.bulkManageProductStatus,
);

const manageProductStock = AppThunk<void, ManageProductStockDto>(
  "/products/manage-stock",
  ProductAxios.manageProductStock,
);

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getProducts.pending, (state) => {
      state.productsLoading = true;
    });
    addCase(getProducts.fulfilled, (state, action) => {
      state.products = action.payload.data;
      state.meta = action.payload.meta;
      state.productsLoading = false;
    });
    addCase(getProducts.rejected, (state) => {
      state.productsLoading = false;
    });

    addCase(userActions.logout.fulfilled, () => initialState);
  },
});

const productActions = {
  createProduct,
  getProducts,
  deleteProduct,
  deleteBulkProducts,
  updateProduct,
  bulkManageProductStatus,
  manageProductStock,
};

export { productActions };

export default productSlice.reducer;
