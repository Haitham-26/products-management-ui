import isString from "lodash/isString";
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
import type { UploadFile } from "antd";

export class ProductAxios {
  static handleFormData(dto: CreateProductDto | UpdateProductDto) {
    const formData = new FormData();

    Object.entries(dto).forEach(([key, value]) => {
      if (key === "mainImage") {
        formData.append(key, value);
      } else if (key === "galleryImages") {
        if ((value as UploadFile[]).length) {
          value.forEach((img: File) => {
            formData.append(key, img);
          });
        } else {
          formData.append(key, JSON.stringify([]));
        }
      } else if (!isString(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    return formData;
  }

  static createProduct(dto: CreateProductDto) {
    const formData = ProductAxios.handleFormData(dto);

    return AppAxios.post("/products/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(({ data }) => data);
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
    const formData = ProductAxios.handleFormData(dto);

    return AppAxios.patch<void>(`/products/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(({ data }) => data);
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
