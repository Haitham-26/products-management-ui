import type React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import type { UpdateCategoryDto } from "../../../model/category/dto/UpdateCategoryDto";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { categoryActions } from "../../../redux/category/categories.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import type { Category } from "../../../model/category/types/Category";
import { buildCategoriesParams } from "../utils/categoryUtils";
import { useSearchParams } from "react-router-dom";
import { Toast } from "../../../utils/Toast";
import type { GetCategoriesDto } from "../../../model/category/dto/GetCategoriesDto";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
`;

const GlassHeader = styled.header`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary}0D;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.typography.title};
  }

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.small};
  }
`;

const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.glassBackground};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary}20;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  h4 {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }
`;

type CategoryUpdateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  category: Category | null;
  filters: Partial<GetCategoriesDto>;
};

export const CategoryUpdateDrawer: React.FC<CategoryUpdateDrawerProps> = ({
  open = false,
  onClose,
  category,
  filters,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const { control, handleSubmit, reset, getValues } =
    useForm<UpdateCategoryDto>();

  const localOnClose = () => {
    reset();
    onClose();
  };

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

      setSearchParams(buildCategoriesParams(filters, searchParams), {
        replace: true,
      });

      localOnClose();
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category && open) {
      reset({
        name: category.name,
        description: category.description || "",
      });
    }
  }, [category, open, reset]);

  return (
    <Drawer
      open={open}
      onClose={localOnClose}
      title="Edit Category"
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onUpdate)}
          onCancel={localOnClose}
          editMode
        />
      }
    >
      <FormContainer>
        <GlassHeader>
          <IconWrapper>
            <Icon icon={faFolderOpen} />
          </IconWrapper>
          <TitleGroup>
            <h2>Edit Category</h2>
            <span>Update metadata and classification details</span>
          </TitleGroup>
        </GlassHeader>

        <FormSection>
          <SectionLabel>
            <Icon icon={faTag} />
            <h4>Classification Details</h4>
          </SectionLabel>

          <Controller
            control={control}
            name="name"
            rules={{ required: "Category name is required" }}
            render={({ field, fieldState }) => (
              <Input
                title="Category Name"
                placeholder="e.g. Smart Home, Wearables"
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
                rows={5}
                {...field}
              />
            )}
          />
        </FormSection>
      </FormContainer>
    </Drawer>
  );
};
