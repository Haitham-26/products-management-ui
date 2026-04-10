import React, { useEffect, useMemo, useState } from "react";
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

const StyledContainer = styled(Container)`
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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

      await dispatch(
        categoryActions.deleteCategory({
          categoryId: currentCategory?._id,
          userId,
        }),
      ).unwrap();
      await dispatch(categoryActions.getCategories({ userId })).unwrap();

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
    dispatch(categoryActions.getCategories({ userId }));
  }, [dispatch, userId]);

  return (
    <StyledContainer>
      <Header>
        <Text fontSize="title">Categories</Text>

        <Button icon={faPlus} onClick={() => setCategoryCreateVisible(true)}>
          Add category
        </Button>
      </Header>

      <Table
        loading={categoriesLoading}
        columns={tableColumns}
        dataSource={categories}
        pagination={false}
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
