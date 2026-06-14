import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import debounce from "lodash/debounce";
import { useSearchParams } from "react-router-dom";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import productSliceSelectors from "../../redux/product/products.selector";
import userSliceSelectors from "../../redux/user/user.selector";
import { productActions } from "../../redux/product/products.slice";
import { categoryActions } from "../../redux/category/categories.slice";
import { tagActions } from "../../redux/tag/tags.slice";

import { Container } from "../../components/Container";
import { Table } from "../../components/Table";
import { WarningModal } from "../../components/WarningModal";
import { ProductCreateDrawer } from "./components/ProductCreateDrawer";
import { ProductUpdateDrawer } from "./components/ProductUpdateDrawer";
import { ProductReadDrawer } from "./components/ProductReadDrawer";
import { createProductsTableColumns } from "./components/createProductsTableColumns";
import type { Product } from "../../model/product/types/Product";
import type { GetProductsDto } from "../../model/product/dto/GetProductsDto";
import { ProductsFilters } from "./components/ProductsFilters";
import {
  buildProductsParams,
  countProductsActiveFilters,
  parseProductsFiltersFromParams,
} from "./utils/productUtils";
import { PageHeader } from "../../components/PageHeader";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";
import settingsSliceSelectors from "../../redux/settings/settings.selector";
import { settingsActions } from "../../redux/settings/settings.slice";
import { ProductStockManageModal } from "./components/ProductStockManageModal";
import { ProductStatus } from "../../model/product/types/ProductStatus.enum";
import { Toast } from "../../utils/Toast";

const toggleStatusModalTexts = {
  [ProductStatus.DRAFT]: {
    title: "Publish product",
    description: "This product will become available for creating new orders.",
  },
  [ProductStatus.PUBLISHED]: {
    title: "Move product to draft",
    description:
      "This product will be hidden from the product list by default unless draft filter is enabled, and it will no longer be available for creating new orders.",
  },
};

const StyledContainer = styled(Container)`
  overflow: hidden;

  .published-product {
    background-color: ${({ theme }) => theme.colors.confirmed} !important;
    color: ${({ theme }) => theme.colors.surface};
  }

  .draft-product {
    background-color: ${({ theme }) => theme.colors.pending} !important;
  }
`;

export const Products: React.FC = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productEditVisible, setProductEditVisible] = useState(false);
  const [productDeleteVisible, setProductDeleteVisible] = useState(false);
  const [productReadVisible, setProductReadVisible] = useState(false);
  const [productCreateVisible, setProductCreateVisible] = useState(false);
  const [productDeleteLoading, setProductDeleteLoading] = useState(false);
  const [productStockManageVisible, setProductStockManageVisible] =
    useState(false);
  const [productToggleStatusVisible, setProductToggleStatusVisible] =
    useState(false);
  const [productToggleStatusLoading, setProductToggleStatusLoading] =
    useState(false);

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const products = useAppSelector(productSliceSelectors.selectProducts);
  const productsLoading = useAppSelector(
    productSliceSelectors.selectProductsLoading,
  );
  const productsMeta = useAppSelector(productSliceSelectors.selectProductsMeta);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(
    () => parseProductsFiltersFromParams(searchParams, productsMeta),
    [searchParams, productsMeta],
  );

  const dispatch = useAppDispatch();

  const debouncedSetSearchParams = useMemo(
    () =>
      debounce((nextParams) => {
        setSearchParams(nextParams, { replace: true });
      }, 800),
    [setSearchParams],
  );

  const handlePageChange = (page: number, pageSize: number) => {
    const newFilters = {
      ...filters,
      meta: {
        ...filters.meta,
        page,
        limit: pageSize,
      },
    };

    setSearchParams(buildProductsParams(newFilters, searchParams), {
      replace: true,
    });
    debouncedSetSearchParams(newFilters);
  };

  const applyFilter = useCallback(
    (
      key: keyof GetProductsDto,
      value: GetProductsDto[keyof GetProductsDto],
      debounce?: boolean,
    ) => {
      const newFilters = {
        ...filters,
        meta: {
          ...(filters?.meta || {}),
          page: key === "keyword" ? 0 : filters?.meta?.page || 0,
        },
        [key]: value,
      };

      const nextParams = buildProductsParams(newFilters, searchParams);

      if (debounce) {
        // Debounce the URL update for typing
        debouncedSetSearchParams(nextParams);
      } else {
        // Apply immediately for dropdowns/filters
        setSearchParams(nextParams, { replace: true });
      }
    },
    [filters, searchParams, setSearchParams, debouncedSetSearchParams],
  );

  const activeFiltersCount = countProductsActiveFilters(filters);

  const onDelete = (product: Product) => {
    setCurrentProduct(product);
    setProductDeleteVisible(true);
  };
  const onEdit = (product: Product) => {
    setCurrentProduct(product);
    setProductEditVisible(true);
  };
  const onRead = (product: Product) => {
    setCurrentProduct(product);
    setProductReadVisible(true);
  };

  const onManageStock = (product: Product) => {
    setCurrentProduct(product);
    setProductStockManageVisible(true);
  };

  const onToggleStatus = (product: Product) => {
    setCurrentProduct(product);
    setProductToggleStatusVisible(true);
  };

  const fetchProducts = async () => {
    try {
      const meta = productsMeta;
      const currentPage = meta?.page || 1;
      const limit = meta?.limit || 10;
      const total = (meta?.total || 1) - 1;

      const totalPages = Math.ceil(total / limit);

      const newPage = currentPage > totalPages ? totalPages : currentPage;

      setSearchParams(
        buildProductsParams(
          {
            ...filters,
            meta: {
              ...(filters?.meta || {}),
              page: newPage,
            },
          },
          searchParams,
        ),
        {
          replace: true,
        },
      );
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    }
  };

  const toggleProductStatus = async () => {
    if (!currentProduct) {
      return;
    }

    try {
      setProductToggleStatusLoading(true);

      await dispatch(
        productActions.updateProduct({
          productId: currentProduct._id,
          status:
            ProductStatus[
              currentProduct.status === ProductStatus.DRAFT
                ? ProductStatus.PUBLISHED
                : ProductStatus.DRAFT
            ],

          userId,
        }),
      ).unwrap();

      await fetchProducts();

      setProductToggleStatusVisible(false);
      setCurrentProduct(null);

      Toast.success("Product status updated successfully");
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setProductToggleStatusLoading(false);
    }
  };

  const deleteProduct = async () => {
    if (!currentProduct) {
      return;
    }

    try {
      setProductDeleteLoading(true);

      await dispatch(
        productActions.deleteProduct({ productId: currentProduct._id, userId }),
      ).unwrap();

      await fetchProducts();

      setProductDeleteVisible(false);
      setCurrentProduct(null);

      Toast.success("Product deleted successfully");
    } catch (e) {
      console.error("Delete failed:", e);
      Toast.apiError(e);
    } finally {
      setProductDeleteLoading(false);
    }
  };

  const tableColumns = useMemo(
    () =>
      createProductsTableColumns({
        functions: { onDelete, onEdit, onRead, onManageStock, onToggleStatus },
        currency: settings.currency,
        settings,
      }),
    [settings],
  );

  useEffect(() => {
    dispatch(
      productActions.getProducts({
        ...filters,
        userId,
      } as GetProductsDto),
    );
    dispatch(categoryActions.getCategories({ userId }));
    dispatch(tagActions.getTags({ userId }));
    dispatch(settingsActions.getSettings({ userId }));
    return () => debouncedSetSearchParams.cancel();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledContainer>
      <PageHeader
        icon={faBox}
        title="Products"
        action={{
          title: "New Product",
          icon: faPlus,
          onClick: () => setProductCreateVisible(true),
        }}
        filters={{
          activeCount: activeFiltersCount,
          content: (
            <ProductsFilters
              activeFiltersCount={activeFiltersCount}
              filters={filters}
              applyFilter={applyFilter}
            />
          ),
        }}
        search={{
          placeholder: "Search by name, description or id...",
          onChange: (searchKeyword) =>
            applyFilter("keyword", searchKeyword, true),
        }}
      />

      <Table
        loading={productsLoading}
        columns={tableColumns}
        dataSource={products}
        pagination={{
          current: productsMeta?.page || 1,
          pageSize: productsMeta?.limit || 10,
          total: productsMeta?.total || 0,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          position: ["bottomRight"],
          showTotal: (total) => `Total ${total} products`,
        }}
      />

      <WarningModal
        title={`Are you sure you want to delete this product "${currentProduct?.name}"?`}
        description={`You are about to remove "${currentProduct?.name}" from your inventory. You will lose all pricing, stock, and history for this item.`}
        open={productDeleteVisible}
        onClose={() => setProductDeleteVisible(false)}
        onConfirm={deleteProduct}
        confirmLoading={productDeleteLoading}
      />

      <WarningModal
        title={
          toggleStatusModalTexts[
            currentProduct?.status || ProductStatus.PUBLISHED
          ].title
        }
        description={
          toggleStatusModalTexts[
            currentProduct?.status || ProductStatus.PUBLISHED
          ].description
        }
        open={productToggleStatusVisible}
        onClose={() => setProductToggleStatusVisible(false)}
        loading={productToggleStatusLoading}
        onConfirm={toggleProductStatus}
      />

      <ProductCreateDrawer
        open={productCreateVisible}
        onClose={() => setProductCreateVisible(false)}
        filters={filters}
      />
      <ProductUpdateDrawer
        open={productEditVisible}
        onClose={() => setProductEditVisible(false)}
        product={currentProduct}
        filters={filters}
      />
      <ProductReadDrawer
        open={productReadVisible}
        onClose={() => setProductReadVisible(false)}
        product={currentProduct}
      />
      <ProductStockManageModal
        open={productStockManageVisible}
        onClose={() => setProductStockManageVisible(false)}
        product={currentProduct}
        filters={filters}
      />
    </StyledContainer>
  );
};
