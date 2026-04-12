import React, { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import debounce from "lodash/debounce";
import { useSearchParams } from "react-router-dom";
import { Popover } from "antd";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import productSliceSelectors from "../../redux/product/products.selector";
import userSliceSelectors from "../../redux/user/user.selector";
import { productActions } from "../../redux/product/products.slice";
import { categoryActions } from "../../redux/category/categories.slice";
import { tagActions } from "../../redux/tag/tags.slice";

import { Container } from "../../components/Container";
import { Table } from "../../components/Table";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import { Input } from "../../components/Input";
import { Icon } from "../../components/Icon";
import { WarningModal } from "../../components/WarningModal";
import { ProductCreateDrawer } from "./components/ProductCreateDrawer";
import { ProductUpdateDrawer } from "./components/ProductUpdateDrawer";
import { ProductReadDrawer } from "./components/ProductReadDrawer";
import { createProductsTableColumns } from "./components/createProductsTableColumns";
import type { Product } from "../../model/product/types/Product";
import type { GetProductsDto } from "../../model/product/dto/GetProductsDto";
import { ProductsFilter } from "./components/ProductsFilter";
import {
  buildProductsParams,
  countProductsActiveFilters,
  parseProductsFiltersFromParams,
} from "./utils/productUtils";

const StyledContainer = styled(Container)`
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 10rem;

  input {
    padding-inline-end: ${({ theme }) => theme.spacing.md};
    min-width: 16rem;
  }

  svg {
    position: absolute;
    z-index: 2;
    inset-inline-end: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
    pointer-events: none;
    font-size: 13px;
  }
`;

const FilterButton = styled.button<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  height: 2rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, active }) =>
    active ? `${theme.colors.primary}12` : theme.colors.surface};
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.textSecondary};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  margin-inline-start: auto;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
`;

export const Products: React.FC = () => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productEditVisible, setProductEditVisible] = useState(false);
  const [productDeleteVisible, setProductDeleteVisible] = useState(false);
  const [productReadVisible, setProductReadVisible] = useState(false);
  const [productCreateVisible, setProductCreateVisible] = useState(false);
  const [productDeleteLoading, setProductDeleteLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const products = useAppSelector(productSliceSelectors.selectProducts);
  const productsLoading = useAppSelector(
    productSliceSelectors.selectProductsLoading,
  );
  const productsMeta = useAppSelector(productSliceSelectors.selectProductsMeta);

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
    (key: keyof GetProductsDto, value: unknown) => {
      const newFilters = {
        ...filters,
        meta: {
          ...(filters?.meta || {}),
          page: key === "keyword" ? 0 : filters?.meta?.page || 0,
        },
        [key]: value,
      };

      const nextParams = buildProductsParams(newFilters, searchParams);

      if (key === "keyword") {
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

  const deleteProduct = async () => {
    if (!currentProduct) {
      return;
    }

    try {
      setProductDeleteLoading(true);

      await dispatch(
        productActions.deleteProduct({ productId: currentProduct._id, userId }),
      ).unwrap();

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

      setProductDeleteVisible(false);
      setCurrentProduct(null);
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      setProductDeleteLoading(false);
    }
  };

  const tableColumns = useMemo(
    () => createProductsTableColumns({ onDelete, onEdit, onRead }),
    [],
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
    return () => debouncedSetSearchParams.cancel();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledContainer>
      <Header>
        <TopRow>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Icon icon={faFilter} color="primary" />
            <Text fontSize="title">Inventory Management</Text>
          </div>
          <Button icon={faPlus} onClick={() => setProductCreateVisible(true)}>
            New Product
          </Button>
        </TopRow>

        <FilterBar>
          <SearchWrapper>
            <Icon icon={faMagnifyingGlass} />
            <Input
              placeholder="Search by name or description…"
              value={searchKeyword}
              onChange={(e) => {
                const value = e.target.value;

                setSearchKeyword(value);
                applyFilter("keyword", value);
              }}
            />
          </SearchWrapper>

          <Popover
            content={<ProductsFilter />}
            trigger="click"
            placement="bottomLeft"
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
            arrow={false}
          >
            <FilterButton active={Boolean(activeFiltersCount)}>
              <Icon icon={faFilter} />
              Filters
              {activeFiltersCount ? (
                <FilterBadge>{activeFiltersCount}</FilterBadge>
              ) : (
                <Icon icon={faChevronDown} />
              )}
            </FilterButton>
          </Popover>
        </FilterBar>
      </Header>

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
        title={`Delete "${currentProduct?.name}"?`}
        description="This action will permanently remove the item from inventory."
        open={productDeleteVisible}
        onClose={() => setProductDeleteVisible(false)}
        onConfirm={deleteProduct}
        confirmLoading={productDeleteLoading}
      />

      <ProductCreateDrawer
        open={productCreateVisible}
        onClose={() => setProductCreateVisible(false)}
      />
      <ProductUpdateDrawer
        open={productEditVisible}
        onClose={() => setProductEditVisible(false)}
        product={currentProduct}
      />
      <ProductReadDrawer
        open={productReadVisible}
        onClose={() => setProductReadVisible(false)}
        product={currentProduct}
      />
    </StyledContainer>
  );
};
