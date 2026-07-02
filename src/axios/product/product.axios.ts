import type { BulkManageProductStatusDto } from "../../model/product/dto/BulkManageProductStatusDto";
import type { CreateProductDto } from "../../model/product/dto/CreateProductDto";
import type { DeleteBulkProductsDto } from "../../model/product/dto/DeleteBulkProductsDto";
import type { DeleteProductDto } from "../../model/product/dto/DeleteProductDto";
import type { GetProductsDto } from "../../model/product/dto/GetProductsDto";
import type { ManageProductStockDto } from "../../model/product/dto/ManageProductStockDto";
import type { UpdateProductDto } from "../../model/product/dto/UpdateProductDto";
import type { Product } from "../../model/product/types/Product";
import type { PaginatedResponse } from "../../model/shared/meta/PaginatedResponse";
import AppAxios from "../AppAxios";

export class ProductAxios {
  static createProduct(dto: CreateProductDto) {
    return AppAxios.post("/products/create", dto).then(({ data }) => data);
  }

  static getProducts(dto: GetProductsDto) {
    return AppAxios.get<PaginatedResponse<Product>>("/products", {
      params: dto,
    }).then(({ data }) => data);
  }

  static deleteProduct(dto: DeleteProductDto) {
    return AppAxios.delete(`/products/delete`, { data: dto }).then(
      ({ data }) => data,
    );
  }

  static deleteBulkProducts(dto: DeleteBulkProductsDto) {
    return AppAxios.delete(`/products/delete/bulk`, { data: dto }).then(
      ({ data }) => data,
    );
  }

  static updateProduct(dto: UpdateProductDto) {
    return AppAxios.patch<void>(`/products/update`, dto).then(
      ({ data }) => data,
    );
  }

  static bulkManageProductStatus(dto: BulkManageProductStatusDto) {
    return AppAxios.patch<void>(`/products/manage-status/bulk`, dto).then(
      ({ data }) => data,
    );
  }

  static manageProductStock(dto: ManageProductStockDto) {
    return AppAxios.patch<void>(`/products/manage-stock`, dto).then(
      ({ data }) => data,
    );
  }
}
