import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  Fragment,
} from "react";
import styled from "styled-components";
import debounce from "lodash/debounce";
import { useSearchParams } from "react-router-dom";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import productSliceSelectors from "../../redux/product/products.selector";
import userSliceSelectors from "../../redux/user/user.selector";
import { productActions } from "../../redux/product/products.slice";
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
import { checkPermissions } from "../../utils/checkPermissions";
import { NoPermissions } from "../../components/NoPermissions";
import { Button } from "../../components/Button";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import type { Key } from "antd/es/table/interface";

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

const BulkActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  button {
    height: auto;
  }
`;

export const Products: React.FC = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const [selectedRowIds, setSelectedRowIds] = useState<Key[]>([]);

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
  const [productsBulkDeleteLoading, setProductsBulkDeleteLoading] =
    useState(false);
  const [productsBulkDeleteVisible, setProductsBulkDeleteVisible] =
    useState(false);

  const user = useAppSelector(userSliceSelectors.selectUser)!;
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

  const permissions = checkPermissions(user, "products");

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

  const deleteBulkProducts = async () => {
    if (!selectedRowIds.length) {
      return;
    }

    try {
      setProductsBulkDeleteLoading(true);

      const meta = productsMeta;
      const currentPage = meta?.page || 1;
      const limit = meta?.limit || 10;
      const total = (meta?.total || 1) - selectedRowIds.length;

      await dispatch(
        productActions.deleteBulkProducts({
          productIds: selectedRowIds.map((id) => id.toString()),
          userId,
        }),
      ).unwrap();

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

      setProductsBulkDeleteVisible(false);
      setSelectedRowIds([]);
    } catch (e) {
      console.log(e);
    } finally {
      setProductsBulkDeleteLoading(false);
    }
  };

  const tableColumns = useMemo(
    () =>
      createProductsTableColumns({
        functions: {
          onDelete: permissions.DELETE ? onDelete : undefined,
          onEdit: permissions.UPDATE ? onEdit : undefined,
          onRead: permissions.READ ? onRead : undefined,
          onManageStock: permissions.UPDATE ? onManageStock : undefined,
          onToggleStatus: permissions.UPDATE ? onToggleStatus : undefined,
        },
        currency: settings.currency,
        settings,
      }),
    [settings, permissions],
  );

  useEffect(() => {
    dispatch(
      productActions.getProducts({
        ...filters,
        userId,
      } as GetProductsDto),
    );
    dispatch(settingsActions.getSettings({ userId }));
    return () => debouncedSetSearchParams.cancel();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledContainer>
      <PageHeader
        icon={faBox}
        title="Products"
        {...(permissions.CREATE
          ? {
              action: {
                title: "New Product",
                icon: faPlus,
                onClick: () => setProductCreateVisible(true),
              },
            }
          : {})}
        {...(permissions.READ
          ? {
              filters: {
                activeCount: activeFiltersCount,
                content: (
                  <ProductsFilters
                    activeFiltersCount={activeFiltersCount}
                    filters={filters}
                    applyFilter={applyFilter}
                  />
                ),
              },
              search: {
                placeholder: "Search by name, description or id...",
                onChange: (searchKeyword: string) =>
                  applyFilter("keyword", searchKeyword, true),
              },
            }
          : {})}
        bulkActionsContent={
          selectedRowIds.length ? (
            <BulkActionsWrapper>
              {permissions.DELETE ? (
                <Button
                  onClick={() => setProductsBulkDeleteVisible(true)}
                  icon={faTrash}
                  variant="secondary"
                >
                  Delete
                </Button>
              ) : null}
            </BulkActionsWrapper>
          ) : null
        }
        selectedTableItemsCount={selectedRowIds.length}
      />

      {permissions.READ ? (
        <Table
          loading={productsLoading}
          columns={tableColumns}
          dataSource={products}
          rowSelection={{
            selectedRowKeys: selectedRowIds,
            onChange(newSelectedRowKeys) {
              setSelectedRowIds(newSelectedRowKeys);
            },
          }}
          pagination={{
            current: productsMeta?.page || 1,
            pageSize: productsMeta?.limit || 10,
            total: productsMeta?.total || 0,
            onChange: handlePageChange,
            showSizeChanger: true,
            pageSizeOptions: ["2", "10", "20", "50", "100"],
            position: ["bottomRight"],
            showTotal: (total) => `Total ${total} products`,
          }}
        />
      ) : (
        <NoPermissions />
      )}

      {permissions.DELETE ? (
        <Fragment>
          <WarningModal
            title={`Delete "${currentProduct?.name}" product?`}
            description={`You are about to delete "${currentProduct?.name}" from your inventory. You will lose all pricing, stock, and history for this product.`}
            open={productDeleteVisible}
            onClose={() => setProductDeleteVisible(false)}
            onConfirm={deleteProduct}
            confirmLoading={productDeleteLoading}
          />

          <WarningModal
            title={`Delete ${selectedRowIds.length} product(s)?`}
            description={`You are about to delete ${selectedRowIds.length} product(s) from your inventory. You will lose all pricing, stock, and history for these products.`}
            open={productsBulkDeleteVisible}
            onClose={() => setProductsBulkDeleteVisible(false)}
            onConfirm={deleteBulkProducts}
            confirmLoading={productsBulkDeleteLoading}
          />
        </Fragment>
      ) : null}

      {permissions.CREATE ? (
        <ProductCreateDrawer
          open={productCreateVisible}
          onClose={() => setProductCreateVisible(false)}
          filters={filters}
        />
      ) : null}

      {permissions.READ ? (
        <ProductReadDrawer
          open={productReadVisible}
          onClose={() => setProductReadVisible(false)}
          product={currentProduct}
        />
      ) : null}

      {permissions.UPDATE ? (
        <Fragment>
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
            confirmLoading={productToggleStatusLoading}
            onConfirm={toggleProductStatus}
          />

          <ProductUpdateDrawer
            open={productEditVisible}
            onClose={() => setProductEditVisible(false)}
            product={currentProduct}
            filters={filters}
          />

          <ProductStockManageModal
            open={productStockManageVisible}
            onClose={() => setProductStockManageVisible(false)}
            product={currentProduct}
            filters={filters}
          />
        </Fragment>
      ) : null}
    </StyledContainer>
  );
};
