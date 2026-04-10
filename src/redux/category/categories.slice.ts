import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../model/product/types/Product";
import { AppThunk } from "../AppThunk";
import type { GenericWithUserId } from "../../model/shared/GenericWithUserId";
import { userActions } from "../user/user.slice";
import type { CreateCategoryDto } from "../../model/category/dto/CreateCategoryDto";
import type { UpdateCategoryDto } from "../../model/category/dto/UpdateCategoryDto";
import type { DeleteCategoryDto } from "../../model/category/dto/DeleteCategoryDto";
import { CategoryAxios } from "../../axios/category/category.axios";

interface CategoryState {
  categories?: Product[];
  categoriesLoading?: boolean;
}

const initialState: CategoryState = {
  categories: [],
  categoriesLoading: false,
};

const createCategory = AppThunk<void, CreateCategoryDto>(
  "/categories/create",
  CategoryAxios.createCategory,
);

const getCategories = AppThunk<Product[], GenericWithUserId>(
  "/categories",
  CategoryAxios.getCategories,
);

const deleteCategory = AppThunk<void, DeleteCategoryDto>(
  "/categories/:id/delete",
  CategoryAxios.deleteCategory,
);

const updateCategory = AppThunk<void, UpdateCategoryDto>(
  "/categories/:id/update",
  CategoryAxios.updateCategory,
);

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getCategories.pending, (state) => {
      state.categoriesLoading = true;
    });
    addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
      state.categoriesLoading = false;
    });
    addCase(getCategories.rejected, (state) => {
      state.categoriesLoading = false;
    });

    addCase(userActions.logout.fulfilled, () => initialState);
  },
});

const categoryActions = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};

export { categoryActions };

export default categorySlice.reducer;
