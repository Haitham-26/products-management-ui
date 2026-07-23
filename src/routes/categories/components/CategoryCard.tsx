import React, { useMemo, type Key } from "react";
import styled from "styled-components";
import { Checkbox } from "antd";
import { useTranslation } from "react-i18next";

import { Text } from "../../../components/Text";
import { formatDate } from "../../../utils/Date";
import type { Category } from "../../../model/category/types/Category";
import { CategoryActionsDropdown } from "./CategoryActionsDropdown";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";

const Card = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
  border-inline-end: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.sm}`};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Details = styled.div`
  flex: 1;
  min-width: 0;
`;

const Description = styled(Text)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

type FNType = VoidCallback<Category> | undefined;

type CategoryCardProps = {
  category: Category;
  actions: {
    onEdit: FNType;
    onRead: FNType;
    onDelete: FNType;
  };
  selectedData: Key[];
  setSelectedData: React.Dispatch<React.SetStateAction<Key[]>>;
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  actions,
  selectedData,
  setSelectedData,
}) => {
  const { t } = useTranslation();

  const { timeZone } = useAppSelector(settingsSliceSelectors.selectSettings);

  const isSelected = useMemo(
    () => selectedData.includes(category._id),
    [selectedData, category._id],
  );

  return (
    <Card>
      <CheckboxWrapper>
        <Checkbox
          checked={isSelected}
          onChange={() =>
            setSelectedData((prev) =>
              prev.includes(category._id)
                ? prev.filter((id) => id !== category._id)
                : [...prev, category._id],
            )
          }
        />
      </CheckboxWrapper>

      <Content>
        <Header>
          <Details>
            <Text fontWeight="700">{category.name}</Text>

            {category.description ? (
              <Description color="textSecondary" fontSize="small">
                {category.description}
              </Description>
            ) : null}
          </Details>

          <CategoryActionsDropdown category={category} actions={actions} />
        </Header>

        <Stats>
          <Stat>
            <Text color="textSecondary" fontSize="small">
              {t("categories.fields.usageCount")}
            </Text>

            <Text fontWeight="600">{category.usageCount}</Text>
          </Stat>

          <Stat>
            <Text color="textSecondary" fontSize="small">
              {t("common.filters.creationDate.title")}
            </Text>

            <Text>{formatDate(category.createdAt, false, timeZone)}</Text>
          </Stat>
        </Stats>
      </Content>
    </Card>
  );
};
