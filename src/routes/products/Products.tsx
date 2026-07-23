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
import settingsSliceSelectors from "../../redux/settings/settings.selector";
import { ProductStockManageModal } from "./components/ProductStockManageModal";
import { ProductStatus } from "../../model/product/types/ProductStatus.enum";
import { checkPermissions } from "../../utils/checkPermissions";
import { NoPermissions } from "../../components/NoPermissions";
import { Button } from "../../components/Button";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import type { Key } from "antd/es/table/interface";
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons/faCloudArrowDown";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons/faCloudArrowUp";
import { appRoutes } from "../../utils/appRoutes";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useAppToast } from "../../components/toast/useAppToast";
import { Grid } from "antd";
import { PaginatedDataCards } from "../../components/PaginatedDataCards";
import { ProductCard } from "./components/ProductCard";
import { Breakpoints } from "../../theme/Breakpoints";

const getToggleStatusModalTexts = (t: TFunction) => ({
  [ProductStatus.DRAFT]: {
    title: t("products.publish.title"),
    description: t("products.publish.description"),
  },
  [ProductStatus.PUBLISHED]: {
    title: t("products.moveToDraft.title"),
    description: t("products.moveToDraft.description"),
  },
});

const StyledContainer = styled(Container)`
  overflow: hidden;

  .published-product {
    background-color: ${({ theme }) => theme.colors.delivered} !important;
    color: ${({ theme }) => theme.colors.surface};
  }
  .draft-product {
    background-color: ${({ theme }) => theme.colors.pending} !important;
  }

  .negative-profit,
  .positive-profit {
    font-weight: 700;
    direction: ltr;
    text-align: -webkit-match-parent;
  }
  .negative-profit {
    color: ${({ theme }) => theme.colors.error};
  }
  .positive-profit {
    color: ${({ theme }) => theme.colors.success};
  }

  @media (max-width: ${Breakpoints.MD}) {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
`;

const BulkActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;

  button:first-child {
    color: ${({ theme }) => theme.colors.error};
  }

  @media (min-width: ${Breakpoints.MD}) {
    justify-content: flex-end;
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

  const [productsBulkMoveToDraftVisible, setProductsBulkMoveToDraftVisible] =
    useState(false);

  const [productsBulkPublishVisible, setProductsBulkPublishVisible] =
    useState(false);
  const [productsBulkManageStatusLoading, setProductsBulkManageStatusLoading] =
    useState(false);

  const Toast = useAppToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { md } = Grid.useBreakpoint();

  const user = useAppSelector(userSliceSelectors.selectUser)!;
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const products = useAppSelector(productSliceSelectors.selectProducts);
  const productsLoading = useAppSelector(
    productSliceSelectors.selectProductsLoading,
  );
  const productsMeta = useAppSelector(productSliceSelectors.selectProductsMeta);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const permissions = checkPermissions(user, "products");

  const filters = useMemo(
    () => parseProductsFiltersFromParams(searchParams, productsMeta),
    [searchParams, productsMeta],
  );

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

  const toggleStatusModalTexts = getToggleStatusModalTexts(t);

  const sharedPaginationOptions = {
    current: productsMeta?.page || 1,
    pageSize: productsMeta?.limit || 10,
    total: productsMeta?.total || 0,
    onChange: handlePageChange,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
  };

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

  const fetchProducts = async (removedItemsCount: number = 0) => {
    try {
      const meta = productsMeta;
      const currentPage = meta?.page || 1;
      const limit = meta?.limit || 10;
      const total = (meta?.total || 1) - removedItemsCount;

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

      await fetchProducts(1);

      setProductToggleStatusVisible(false);
      setCurrentProduct(null);

      Toast.success(t("products.statusUpdateSuccess"));
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

      await fetchProducts(1);

      setProductDeleteVisible(false);
      setCurrentProduct(null);

      Toast.success(t("products.delete.success"));
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

      Toast.success(t("products.bulkDelete.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setProductsBulkDeleteLoading(false);
    }
  };

  const manageBulkProductStatus = async (status: ProductStatus) => {
    if (!selectedRowIds.length) {
      return;
    }

    try {
      setProductsBulkManageStatusLoading(true);

      await dispatch(
        productActions.bulkManageProductStatus({
          status,
          productIds: selectedRowIds.map((id) => id.toString()),
          userId,
        }),
      ).unwrap();

      const nonDraftCount = selectedRowIds.filter((id) =>
        products.find((p) => p._id === id && p.status !== ProductStatus.DRAFT),
      ).length;

      await fetchProducts(
        status === ProductStatus.DRAFT && !filters.showDraft
          ? nonDraftCount
          : 0,
      );

      if (status === ProductStatus.DRAFT) {
        setProductsBulkMoveToDraftVisible(false);
      } else {
        setProductsBulkPublishVisible(false);
      }
      setSelectedRowIds([]);

      Toast.success(
        t(
          status === ProductStatus.DRAFT
            ? "products.bulkMoveToDraft.success"
            : "products.bulkPublish.success",
        ),
      );
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setProductsBulkManageStatusLoading(false);
    }
  };

  const tableActions = useMemo(
    () => ({
      onDelete: permissions.DELETE ? onDelete : undefined,
      onEdit: permissions.UPDATE ? onEdit : undefined,
      onRead: permissions.READ ? onRead : undefined,
      onManageStock: permissions.UPDATE ? onManageStock : undefined,
      onToggleStatus: permissions.UPDATE ? onToggleStatus : undefined,
    }),
    [permissions],
  );

  const tableColumns = useMemo(
    () =>
      createProductsTableColumns({
        functions: {
          ...tableActions,
          t,
        },
        currency: settings.currency,
        settings,
      }),
    [settings, tableActions, t],
  );

  useEffect(() => {
    dispatch(
      productActions.getProducts({
        ...filters,
        userId,
      } as GetProductsDto),
    );

    return () => debouncedSetSearchParams.cancel();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledContainer>
      <PageHeader
        icon={appRoutes.products.icon}
        title={t(appRoutes.products.titleKey)}
        {...(permissions.CREATE
          ? {
              action: {
                title: t("products.subheader.action"),
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
                placeholder: t("products.subheader.inputPlaceholder"),
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
                  {`${t("common.delete")}${!md ? ` (${selectedRowIds.length})` : ""}`}
                </Button>
              ) : null}

              {permissions.UPDATE ? (
                <Fragment>
                  <Button
                    onClick={() => setProductsBulkPublishVisible(true)}
                    icon={faCloudArrowUp}
                    variant="secondary"
                  >
                    {`${t("products.actions.publish")}${!md ? ` (${selectedRowIds.length})` : ""}`}
                  </Button>

                  <Button
                    onClick={() => setProductsBulkMoveToDraftVisible(true)}
                    icon={faCloudArrowDown}
                    variant="secondary"
                  >
                    {`${t("products.actions.moveToDraft")}${!md ? ` (${selectedRowIds.length})` : ""}`}
                  </Button>
                </Fragment>
              ) : null}
            </BulkActionsWrapper>
          ) : null
        }
        selectedTableItemsCount={selectedRowIds.length}
      />

      {permissions.READ ? (
        md ? (
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
              ...sharedPaginationOptions,
              showTotal: (total) => t("table.total", { total }),
              placement: ["bottomEnd"],
            }}
          />
        ) : (
          <PaginatedDataCards
            data={products}
            paginationOptions={sharedPaginationOptions}
            itemRender={(item) => (
              <ProductCard
                key={item._id}
                product={item as Product}
                functions={tableActions}
                selectedData={selectedRowIds}
                setSelectedData={setSelectedRowIds}
              />
            )}
            loading={productsLoading}
            selectedData={selectedRowIds}
            setSelectedData={setSelectedRowIds}
          />
        )
      ) : (
        <NoPermissions />
      )}

      {permissions.DELETE ? (
        <Fragment>
          <WarningModal
            title={t("products.delete.title", { name: currentProduct?.name })}
            open={productDeleteVisible}
            onClose={() => setProductDeleteVisible(false)}
            onConfirm={deleteProduct}
            confirmLoading={productDeleteLoading}
          />

          <WarningModal
            title={t("products.bulkDelete.title", {
              count: selectedRowIds.length,
            })}
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

          <WarningModal
            title={t("products.bulkMoveToDraft.title", {
              count: selectedRowIds.length,
            })}
            description={t("products.bulkMoveToDraft.description")}
            open={productsBulkMoveToDraftVisible}
            onClose={() => setProductsBulkMoveToDraftVisible(false)}
            onConfirm={() => manageBulkProductStatus(ProductStatus.DRAFT)}
            confirmLoading={productsBulkManageStatusLoading}
          />

          <WarningModal
            title={t("products.bulkPublish.title", {
              count: selectedRowIds.length,
            })}
            description={t("products.bulkPublish.description")}
            open={productsBulkPublishVisible}
            onClose={() => setProductsBulkPublishVisible(false)}
            onConfirm={() => manageBulkProductStatus(ProductStatus.PUBLISHED)}
            confirmLoading={productsBulkManageStatusLoading}
          />
        </Fragment>
      ) : null}
    </StyledContainer>
  );
};
