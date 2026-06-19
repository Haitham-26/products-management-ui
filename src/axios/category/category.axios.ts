import type { CreateCategoryDto } from "../../model/category/dto/CreateCategoryDto";
import type { DeleteCategoryDto } from "../../model/category/dto/DeleteCategoryDto";
import type { GetCategoriesDto } from "../../model/category/dto/GetCategoriesDto";
import type { UpdateCategoryDto } from "../../model/category/dto/UpdateCategoryDto";
import type { Category } from "../../model/category/types/Category";
import type { PaginatedResponse } from "../../model/shared/meta/PaginatedResponse";
import AppAxios from "../AppAxios";

export class CategoryAxios {
  static createCategory(dto: CreateCategoryDto) {
    return AppAxios.post("/categories/create", dto).then(({ data }) => data);
  }

  static getCategories(dto: GetCategoriesDto) {
    return AppAxios.get<PaginatedResponse<Category>>("/categories", {
      params: dto,
    }).then(({ data }) => data);
  }
  static updateCategory(dto: UpdateCategoryDto) {
    return AppAxios.patch<void>(`/categories/update`, dto).then(
      ({ data }) => data,
    );
  }
  static deleteCategory(dto: DeleteCategoryDto) {
    return AppAxios.delete(`/categories/delete`, { data: dto }).then(
      ({ data }) => data,
    );
  }
}
