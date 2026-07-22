import type React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import type { CreateCategoryDto } from "../../../model/category/dto/CreateCategoryDto";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { categoryActions } from "../../../redux/category/categories.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { buildCategoriesParams } from "../utils/categoryUtils";
import { useSearchParams } from "react-router-dom";
import type { GetCategoriesDto } from "../../../model/category/dto/GetCategoriesDto";
import { useTranslation } from "react-i18next";
import { Text } from "../../../components/Text";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { useAppToast } from "../../../components/toast/useAppToast";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
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

  p {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: bold;
  }
`;

type CategoryCreateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  filters: Partial<GetCategoriesDto>;
};

export const CategoryCreateDrawer: React.FC<CategoryCreateDrawerProps> = ({
  open = false,
  onClose,
  filters,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const Toast = useAppToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const { t } = useTranslation();
  const { control, handleSubmit, reset, getValues } =
    useForm<CreateCategoryDto>({
      defaultValues: {
        name: "",
        description: "",
      },
    });

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

      Toast.success(t("categories.create.success"));
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
      title={t("categories.create.title")}
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
        <FormSection>
          <SectionLabel>
            <Icon icon={faTag} />
            <Text>{t("categories.create-edit.identification.title")}</Text>
          </SectionLabel>

          <Controller
            control={control}
            name="name"
            rules={{ required: t("errors.general.required") }}
            render={({ field, fieldState: { error } }) => (
              <Input
                title={t("common.name")}
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
              <Textarea title={t("common.description")} rows={5} {...field} />
            )}
          />
        </FormSection>
      </FormContainer>
    </Drawer>
  );
};
