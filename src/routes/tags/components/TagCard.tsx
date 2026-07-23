import React, { useMemo, type Key } from "react";
import styled from "styled-components";
import { Checkbox } from "antd";
import { useTranslation } from "react-i18next";

import { Text } from "../../../components/Text";
import type { Tag } from "../../../model/tag/types/Tag";
import { TagActionsDropdown } from "./TagActionsDropdown";
import { formatDate } from "../../../utils/Date";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { useAppSelector } from "../../../redux/store";

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

type FNType = VoidCallback<Tag> | undefined;

type TagCardProps = {
  tag: Tag;
  actions: {
    onEdit: FNType;
    onRead: FNType;
    onDelete: FNType;
  };
  selectedData: Key[];
  setSelectedData: React.Dispatch<React.SetStateAction<Key[]>>;
};

export const TagCard: React.FC<TagCardProps> = ({
  tag,
  actions,
  selectedData,
  setSelectedData,
}) => {
  const { t } = useTranslation();

  const { timeZone } = useAppSelector(settingsSliceSelectors.selectSettings);

  const isSelected = useMemo(
    () => selectedData.includes(tag._id),
    [selectedData, tag._id],
  );

  return (
    <Card>
      <CheckboxWrapper>
        <Checkbox
          checked={isSelected}
          onChange={() =>
            setSelectedData((prev) =>
              prev.includes(tag._id)
                ? prev.filter((id) => id !== tag._id)
                : [...prev, tag._id],
            )
          }
        />
      </CheckboxWrapper>

      <Content>
        <Header>
          <Details>
            <Text fontWeight="700">{tag.name}</Text>

            {tag.description ? (
              <Description color="textSecondary" fontSize="small">
                {tag.description}
              </Description>
            ) : null}
          </Details>

          <TagActionsDropdown tag={tag} actions={actions} />
        </Header>

        <Stats>
          <Stat>
            <Text color="textSecondary" fontSize="small">
              {t("tags.fields.usageCount")}
            </Text>

            <Text fontWeight="600">{tag.usageCount}</Text>
          </Stat>

          <Stat>
            <Text color="textSecondary" fontSize="small">
              {t("common.filters.creationDate.title")}
            </Text>

            <Text>{formatDate(tag.createdAt, false, timeZone)}</Text>
          </Stat>
        </Stats>
      </Content>
    </Card>
  );
};
