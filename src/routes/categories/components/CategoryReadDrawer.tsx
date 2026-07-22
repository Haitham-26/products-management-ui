import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Text } from "../../../components/Text";
import type { Category } from "../../../model/category/types/Category";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../utils/Date";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

type CategoryReadDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  category: Category | null;
};

export const CategoryReadDrawer: React.FC<CategoryReadDrawerProps> = ({
  open = false,
  onClose,
  category,
}) => {
  const { t } = useTranslation();

  if (!category) {
    return null;
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t("categories.read.title")}
      size="large"
    >
      <FormContainer>
        <Text fontWeight="bold" fontSize="subtitle">
          {category.name}
        </Text>

        <Section>
          <DataItem>
            <Text fontSize="small" color="textSecondary" fontWeight="bold">
              {t("common.description")}
            </Text>
            <Text
              fontStyle={!category.description?.length ? "italic" : undefined}
            >
              {category.description || t("categories.read.noDescription")}
            </Text>
          </DataItem>
        </Section>

        <Section>
          <DataItem>
            <Text fontSize="small" color="textSecondary" fontWeight="bold">
              {t("categories.read.usageCount.title")}
            </Text>
            <Text color="primary" fontWeight="600">
              {t("categories.read.usageCount.value", {
                count: category.usageCount ?? 0,
              })}
            </Text>
          </DataItem>
        </Section>

        <Section>
          <DataItem>
            <Text fontSize="small" color="textSecondary" fontWeight="bold">
              {t("common.filters.creationDate.title")}
            </Text>
            <Text>{formatDate(category.createdAt, true)}</Text>
          </DataItem>
        </Section>
      </FormContainer>
    </Drawer>
  );
};
