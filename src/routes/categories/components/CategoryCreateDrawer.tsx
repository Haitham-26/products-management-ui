import type React from "react";
import { useMemo, useState } from "react";
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

type CategoryCreateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
};

export const CategoryCreateDrawer: React.FC<CategoryCreateDrawerProps> = ({
  open = false,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const categoriesMeta = useAppSelector(
    categorySliceSelectors.selectCategoriesMeta,
  );

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
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

      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Create category"
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onCreate)}
          onCancel={onClose}
        />
      }
    >
      <Content>
        <Hero>
          <HeroIcon>
            <Icon icon={faFolderOpen} />
          </HeroIcon>

          <HeroText>
            <Text fontSize="title">Create category</Text>
            <Text fontSize="small" color="textSecondary">
              Organize your products with categories
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
