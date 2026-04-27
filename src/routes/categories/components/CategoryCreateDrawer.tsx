import type React from "react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import type { CreateCategoryDto } from "../../../model/category/dto/CreateCategoryDto";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { categoryActions } from "../../../redux/category/categories.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import {
  buildCategoriesParams,
  parseCategoriesFiltersFromParams,
} from "../utils/categoryUtils";
import { useSearchParams } from "react-router-dom";
import categorySliceSelectors from "../../../redux/category/categories.selector";
import { Toast } from "../../../utils/Toast";

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

type CategoryCreateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
};

export const CategoryCreateDrawer: React.FC<CategoryCreateDrawerProps> = ({
  open = false,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const categoriesMeta = useAppSelector(
    categorySliceSelectors.selectCategoriesMeta,
  );

  const { control, handleSubmit, reset, getValues } =
    useForm<CreateCategoryDto>({
      defaultValues: {
        name: "",
        description: "",
      },
    });

  const filters = useMemo(
    () => parseCategoriesFiltersFromParams(searchParams, categoriesMeta),
    [searchParams, categoriesMeta],
  );

  const localOnClose = () => {
    reset();
    onClose();
  };

  const onCreate = async () => {
    try {
      setLoading(true);

      await dispatch(
        categoryActions.createCategory({
          ...getValues(),
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

  return (
    <Drawer
      open={open}
      onClose={localOnClose}
      title="Create Category"
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onCreate)}
          onCancel={localOnClose}
        />
      }
    >
      <FormContainer>
        <GlassHeader>
          <IconWrapper>
            <Icon icon={faFolderOpen} />
          </IconWrapper>
          <TitleGroup>
            <h2>New Category</h2>
            <span>Group your inventory for better organization</span>
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
            render={({ field, fieldState: { error } }) => (
              <Input
                title="Category Name"
                placeholder="e.g. Smart Home, Wearables"
                errorMessage={error?.message}
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
                placeholder="What kinds of products belong here?"
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
