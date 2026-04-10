import type { CreateCategoryDto } from "../../model/category/dto/CreateCategoryDto";
import type { DeleteCategoryDto } from "../../model/category/dto/DeleteCategoryDto";
import type { UpdateCategoryDto } from "../../model/category/dto/UpdateCategoryDto";
import type { Product } from "../../model/product/types/Product";
import type { GenericWithUserId } from "../../model/shared/GenericWithUserId";
import AppAxios from "../AppAxios";

export class CategoryAxios {
  static createCategory(dto: CreateCategoryDto) {
    return AppAxios.post("/categories/create", dto).then(({ data }) => data);
  }

  static getCategories(dto: GenericWithUserId) {
    return AppAxios.post<Product[]>("/categories", dto).then(
      ({ data }) => data,
    );
  }

  static deleteCategory(dto: DeleteCategoryDto) {
    return AppAxios.delete(`/categories/${dto.categoryId}/delete`).then(
      ({ data }) => data,
    );
  }

  static updateCategory(dto: UpdateCategoryDto) {
    return AppAxios.patch<void>(
      `/categories/${dto.categoryId}/update`,
      dto,
    ).then(({ data }) => data);
  }
}
