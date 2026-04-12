import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Container } from "../../components/Container";
import { Table } from "../../components/Table";
import { WarningModal } from "../../components/WarningModal";
import userSliceSelectors from "../../redux/user/user.selector";
import styled from "styled-components";
import { Button } from "../../components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { CategoryCreateDrawer } from "./components/CategoryCreateDrawer";
import { Text } from "../../components/Text";
import { CategoryUpdateDrawer } from "./components/CategoryUpdateDrawer";
import { CategoryReadDrawer } from "./components/CategoryReadDrawer";
import type { Category } from "../../model/category/types/Category";
import categorySliceSelectors from "../../redux/category/categories.selector";
import { createCategoriesTableColumns } from "./components/createCategoriesTableColumns";
import { categoryActions } from "../../redux/category/categories.slice";
import {
  buildCategoriesParams,
  countCategoriesActiveFilters,
  parseCategoriesFiltersFromParams,
} from "./utils/categoryUtils";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash/debounce";
import type { GetCategoriesDto } from "../../model/category/dto/GetCategoriesDto";
import { Icon } from "../../components/Icon";
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { Popover } from "antd";
import { faFolder } from "@fortawesome/free-solid-svg-icons/faFolder";
import { Input } from "../../components/Input";
import { CategoriesFilter } from "./components/CategoriesFilter";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";

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

export const Categories: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const [categoryEditVisible, setCategoryEditVisible] = useState(false);
  const [categoryDeleteVisible, setCategoryDeleteVisible] = useState(false);
  const [categoryReadVisible, setCategoryReadVisible] = useState(false);
  const [categoryCreateVisible, setCategoryCreateVisible] = useState(false);
  const [categoryDeleteLoading, setCategoryDeleteLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const dispatch = useAppDispatch();

  const categories = useAppSelector(categorySliceSelectors.selectCategories);
  const categoriesLoading = useAppSelector(
    categorySliceSelectors.selectCategoriesLoading,
  );
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const categoriesMeta = useAppSelector(
    categorySliceSelectors.selectCategoriesMeta,
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => parseCategoriesFiltersFromParams(searchParams, categoriesMeta),
    [searchParams, categoriesMeta],
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

    setSearchParams(buildCategoriesParams(newFilters, searchParams), {
      replace: true,
    });
    debouncedSetSearchParams(newFilters);
  };

  const applyFilter = useCallback(
    (key: keyof GetCategoriesDto, value: unknown) => {
      const newFilters = {
        ...filters,
        meta: {
          ...(filters?.meta || {}),
          page: key === "keyword" ? 0 : filters?.meta?.page || 0,
        },
        [key]: value,
      };

      const nextParams = buildCategoriesParams(newFilters, searchParams);

      if (key === "keyword") {
        debouncedSetSearchParams(nextParams);
      } else {
        setSearchParams(nextParams, { replace: true });
      }
    },
    [filters, searchParams, setSearchParams, debouncedSetSearchParams],
  );

  const activeFiltersCount = countCategoriesActiveFilters(filters);

  const onDelete = (category: Category) => {
    setCurrentCategory(category);
    setCategoryDeleteVisible(true);
  };

  const onEdit = (category: Category) => {
    setCurrentCategory(category);
    setCategoryEditVisible(true);
  };

  const onRead = (category: Category) => {
    setCurrentCategory(category);
    setCategoryReadVisible(true);
  };

  const deleteCategory = async () => {
    if (!currentCategory) {
      return;
    }

    try {
      setCategoryDeleteLoading(true);

      const meta = categoriesMeta;
      const currentPage = meta?.page || 1;
      const limit = meta?.limit || 10;
      const total = (meta?.total || 1) - 1;

      await dispatch(
        categoryActions.deleteCategory({
          categoryId: currentCategory?._id,
          userId,
        }),
      ).unwrap();

      const totalPages = Math.ceil(total / limit);

      const newPage = currentPage > totalPages ? totalPages : currentPage;

      setSearchParams(
        buildCategoriesParams(
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

      setCategoryDeleteVisible(false);
      setCurrentCategory(null);
    } catch (e) {
      console.log(e);
    } finally {
      setCategoryDeleteLoading(false);
    }
  };

  const tableColumns = useMemo(
    () =>
      createCategoriesTableColumns({
        onDelete,
        onEdit,
        onRead,
      }),
    [],
  );

  useEffect(() => {
    dispatch(
      categoryActions.getCategories({
        ...filters,
        userId,
      } as GetCategoriesDto),
    );

    return () => debouncedSetSearchParams.cancel();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledContainer>
      <Header>
        <TopRow>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Icon icon={faFolder} color="primary" />
            <Text fontSize="title">Categories</Text>
          </div>
          <Button icon={faPlus} onClick={() => setCategoryCreateVisible(true)}>
            New Category
          </Button>
        </TopRow>

        <FilterBar>
          <SearchWrapper>
            <Icon icon={faMagnifyingGlass} />
            <Input
              placeholder="Search by name"
              value={searchKeyword}
              onChange={(e) => {
                const value = e.target.value;

                setSearchKeyword(value);
                applyFilter("keyword", value);
              }}
            />
          </SearchWrapper>

          <Popover
            content={<CategoriesFilter />}
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
        loading={categoriesLoading}
        columns={tableColumns}
        dataSource={categories}
        pagination={{
          current: categoriesMeta?.page || 1,
          pageSize: categoriesMeta?.limit || 10,
          total: categoriesMeta?.total || 0,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: ["2", "10", "20", "50", "100"],
          position: ["bottomRight"],
          showTotal: (total) => `Total ${total} categories`,
        }}
      />

      <WarningModal
        title={`Delete "${currentCategory?.name}" category?`}
        description={`Are you sure you want to delete "${currentCategory?.name}" category? Once you confirm, you cannot undo it later.`}
        open={categoryDeleteVisible}
        onClose={() => setCategoryDeleteVisible(false)}
        onConfirm={deleteCategory}
        confirmText="Delete"
        cancelText="Cancel"
        confirmLoading={categoryDeleteLoading}
      />

      <CategoryCreateDrawer
        open={categoryCreateVisible}
        onClose={() => setCategoryCreateVisible(false)}
      />

      <CategoryUpdateDrawer
        open={categoryEditVisible}
        onClose={() => setCategoryEditVisible(false)}
        category={currentCategory}
      />

      <CategoryReadDrawer
        open={categoryReadVisible}
        onClose={() => setCategoryReadVisible(false)}
        category={currentCategory}
      />
    </StyledContainer>
  );
};
