import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Container } from "../../components/Container";
import { Table } from "../../components/Table";
import { WarningModal } from "../../components/WarningModal";
import userSliceSelectors from "../../redux/user/user.selector";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { CategoryCreateDrawer } from "./components/CategoryCreateDrawer";
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
import { faFolder } from "@fortawesome/free-solid-svg-icons/faFolder";
import { CategoriesFilter } from "./components/CategoriesFilter";
import { PageHeader } from "../../components/PageHeader";

const StyledContainer = styled(Container)`
  overflow: hidden;
`;

export const Categories: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const [categoryEditVisible, setCategoryEditVisible] = useState(false);
  const [categoryDeleteVisible, setCategoryDeleteVisible] = useState(false);
  const [categoryReadVisible, setCategoryReadVisible] = useState(false);
  const [categoryCreateVisible, setCategoryCreateVisible] = useState(false);
  const [categoryDeleteLoading, setCategoryDeleteLoading] = useState(false);

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
      <PageHeader
        icon={faFolder}
        title="Categories"
        action={{
          title: "New Category",
          icon: faPlus,
          onClick: () => setCategoryCreateVisible(true),
        }}
        filters={{
          activeCount: activeFiltersCount,
          content: <CategoriesFilter />,
        }}
        search={{
          placeholder: "Search by name or description...",
          onChange: (searchKeyword) => applyFilter("keyword", searchKeyword),
        }}
      />

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
        title={`Delete "${currentCategory?.name}" Category?`}
        description={`This will remove the category and unlink all associated products. Products will not be deleted, but they will no longer be assigned to this category.`}
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
