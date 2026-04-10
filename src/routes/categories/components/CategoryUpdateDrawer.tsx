import type React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import type { UpdateCategoryDto } from "../../../model/category/dto/UpdateCategoryDto";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { categoryActions } from "../../../redux/category/categories.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import type { Category } from "../../../model/category/types/Category";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Hero = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeroIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primary}1a;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.5rem;
  }
`;

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

type CategoryUpdateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  category: Category | null;
};

export const CategoryUpdateDrawer: React.FC<CategoryUpdateDrawerProps> = ({
  open = false,
  onClose,
  category,
}) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const { control, handleSubmit, reset, getValues } =
    useForm<UpdateCategoryDto>({
      defaultValues: {
        name: "",
        description: "",
      },
    });

  useEffect(() => {
    if (category && open) {
      reset({
        name: category.name,
        description: category.description ?? "",
      });
    }
  }, [category, open, reset]);

  const onUpdate = async () => {
    if (!category) {
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        categoryActions.updateCategory({
          ...getValues(),
          categoryId: category._id,
          userId,
        }),
      ).unwrap();

      await dispatch(categoryActions.getCategories({ userId })).unwrap();

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Edit category"
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onUpdate)}
          onCancel={onClose}
          editMode
        />
      }
    >
      <Content>
        <Hero>
          <HeroIcon>
            <Icon icon={faFolderOpen} />
          </HeroIcon>

          <HeroText>
            <Text fontSize="title">Edit category</Text>
            <Text fontSize="small" color="textSecondary">
              Update category information
            </Text>
          </HeroText>
        </Hero>

        <Card>
          <SectionHeader>
            <Icon icon={faTag} />
            <Text fontSize="subtitle">Category details</Text>
          </SectionHeader>

          <Controller
            control={control}
            name="name"
            rules={{ required: "Category name is required" }}
            render={({ field, fieldState }) => (
              <Input
                title="Name"
                placeholder="Electronics"
                errorMessage={fieldState.error?.message}
                required
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                title="Description"
                placeholder="Optional description for this category"
                rows={4}
                {...field}
              />
            )}
          />
        </Card>
      </Content>
    </Drawer>
  );
};
