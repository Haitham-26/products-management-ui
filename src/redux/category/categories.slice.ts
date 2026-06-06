import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import type { GenericWithUserId } from "../../model/shared/dto/GenericWithUserId";
import { userActions } from "../user/user.slice";
import type { CreateCategoryDto } from "../../model/category/dto/CreateCategoryDto";
import type { UpdateCategoryDto } from "../../model/category/dto/UpdateCategoryDto";
import type { DeleteCategoryDto } from "../../model/category/dto/DeleteCategoryDto";
import { CategoryAxios } from "../../axios/category/category.axios";
import type { PaginationMeta } from "../../model/shared/meta/PaginationMeta";
import type { Category } from "../../model/category/types/Category";
import type { PaginatedResponse } from "../../model/shared/meta/PaginatedResponse";

interface CategoryState {
  categories?: Category[];
  categoriesLoading?: boolean;
  meta?: PaginationMeta;
}

const initialState: CategoryState = {
  categories: [],
  categoriesLoading: false,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

const createCategory = AppThunk<void, CreateCategoryDto>(
  "/categories/create",
  CategoryAxios.createCategory,
);

const getCategories = AppThunk<PaginatedResponse<Category>, GenericWithUserId>(
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
      state.categories = action.payload.data;
      state.meta = action.payload.meta;
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
