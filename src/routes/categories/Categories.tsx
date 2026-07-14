import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { CategoriesFilters } from "./components/CategoriesFilters";
import { PageHeader } from "../../components/PageHeader";
import { checkPermissions } from "../../utils/checkPermissions";
import { NoPermissions } from "../../components/NoPermissions";
import type { Key } from "antd/es/table/interface";
import { Button } from "../../components/Button";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { appRoutes } from "../../utils/appRoutes";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../components/toast/useAppToast";

const StyledContainer = styled(Container)`
  overflow: hidden;
`;

const BulkActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  button {
    height: auto;
  }
`;

export const Categories: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const [selectedRowIds, setSelectedRowIds] = useState<Key[]>([]);

  const [categoryEditVisible, setCategoryEditVisible] = useState(false);
  const [categoryDeleteVisible, setCategoryDeleteVisible] = useState(false);
  const [categoryReadVisible, setCategoryReadVisible] = useState(false);
  const [categoryCreateVisible, setCategoryCreateVisible] = useState(false);
  const [categoryDeleteLoading, setCategoryDeleteLoading] = useState(false);
  const [categoriesBulkDeleteLoading, setCategoriesBulkDeleteLoading] =
    useState(false);
  const [categoriesBulkDeleteVisible, setCategoriesBulkDeleteVisible] =
    useState(false);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const categories = useAppSelector(categorySliceSelectors.selectCategories);
  const categoriesLoading = useAppSelector(
    categorySliceSelectors.selectCategoriesLoading,
  );
  const user = useAppSelector(userSliceSelectors.selectUser)!;
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

  const permissions = checkPermissions(user, "categories");

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
    (
      key: keyof GetCategoriesDto,
      value: GetCategoriesDto[keyof GetCategoriesDto],
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

      const nextParams = buildCategoriesParams(newFilters, searchParams);

      if (debounce) {
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

      Toast.success(t("categories.delete.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setCategoryDeleteLoading(false);
    }
  };

  const deleteBulkCategories = async () => {
    if (!selectedRowIds.length) {
      return;
    }

    try {
      setCategoriesBulkDeleteLoading(true);

      const meta = categoriesMeta;
      const currentPage = meta?.page || 1;
      const limit = meta?.limit || 10;
      const total = (meta?.total || 1) - selectedRowIds.length;

      await dispatch(
        categoryActions.deleteBulkCategories({
          categoryIds: selectedRowIds.map((id) => id.toString()),
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

      setCategoriesBulkDeleteVisible(false);
      setSelectedRowIds([]);

      Toast.success(t("categories.bulkDelete.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setCategoriesBulkDeleteLoading(false);
    }
  };

  const tableColumns = useMemo(
    () =>
      createCategoriesTableColumns({
        onDelete: permissions.DELETE ? onDelete : undefined,
        onEdit: permissions.UPDATE ? onEdit : undefined,
        onRead: permissions.READ ? onRead : undefined,
        t,
      }),
    [permissions, t],
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
        icon={appRoutes.categories.icon}
        title={t(appRoutes.categories.titleKey)}
        {...(permissions.CREATE
          ? {
              action: {
                title: t("categories.subheader.action"),
                icon: faPlus,
                onClick: () => setCategoryCreateVisible(true),
              },
            }
          : {})}
        {...(permissions.READ
          ? {
              filters: {
                activeCount: activeFiltersCount,
                content: (
                  <CategoriesFilters
                    activeFiltersCount={activeFiltersCount}
                    filters={filters}
                    applyFilter={applyFilter}
                  />
                ),
              },
              search: {
                placeholder: t("categories.subheader.inputPlaceholder"),
                onChange: (searchKeyword) =>
                  applyFilter("keyword", searchKeyword, true),
              },
            }
          : {})}
        bulkActionsContent={
          selectedRowIds.length ? (
            <BulkActionsWrapper>
              {permissions.DELETE ? (
                <Button
                  onClick={() => setCategoriesBulkDeleteVisible(true)}
                  icon={faTrash}
                  variant="secondary"
                >
                  {t("common.delete")}
                </Button>
              ) : null}
            </BulkActionsWrapper>
          ) : null
        }
        selectedTableItemsCount={selectedRowIds.length}
      />

      {permissions.READ ? (
        <Table
          loading={categoriesLoading}
          columns={tableColumns}
          dataSource={categories}
          rowSelection={{
            selectedRowKeys: selectedRowIds,
            onChange(newSelectedRowKeys) {
              setSelectedRowIds(newSelectedRowKeys);
            },
          }}
          pagination={{
            current: categoriesMeta?.page || 1,
            pageSize: categoriesMeta?.limit || 10,
            total: categoriesMeta?.total || 0,
            onChange: handlePageChange,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
          }}
        />
      ) : (
        <NoPermissions />
      )}

      {permissions.DELETE ? (
        <Fragment>
          <WarningModal
            title={t("categories.delete.title", {
              name: currentCategory?.name,
            })}
            description={t("categories.delete.description")}
            open={categoryDeleteVisible}
            onClose={() => setCategoryDeleteVisible(false)}
            onConfirm={deleteCategory}
            confirmText={t("common.delete")}
            confirmLoading={categoryDeleteLoading}
          />

          <WarningModal
            title={t("categories.bulkDelete.title", {
              count: selectedRowIds.length,
            })}
            description={t("categories.bulkDelete.description")}
            open={categoriesBulkDeleteVisible}
            onClose={() => setCategoriesBulkDeleteVisible(false)}
            onConfirm={deleteBulkCategories}
            confirmText={t("common.delete")}
            confirmLoading={categoriesBulkDeleteLoading}
          />
        </Fragment>
      ) : null}

      {permissions.READ ? (
        <CategoryReadDrawer
          open={categoryReadVisible}
          onClose={() => setCategoryReadVisible(false)}
          category={currentCategory}
        />
      ) : null}

      {permissions.CREATE ? (
        <CategoryCreateDrawer
          open={categoryCreateVisible}
          onClose={() => setCategoryCreateVisible(false)}
          filters={filters}
        />
      ) : null}

      {permissions.UPDATE ? (
        <CategoryUpdateDrawer
          open={categoryEditVisible}
          onClose={() => setCategoryEditVisible(false)}
          category={currentCategory}
          filters={filters}
        />
      ) : null}
    </StyledContainer>
  );
};
