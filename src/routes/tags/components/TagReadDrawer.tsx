import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Text } from "../../../components/Text";
import type { Tag } from "../../../model/tag/types/Tag";
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

type TagReadDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  tag: Tag | null;
};

export const TagReadDrawer: React.FC<TagReadDrawerProps> = ({
  open = false,
  onClose,
  tag,
}) => {
  const { t } = useTranslation();

  if (!tag) {
    return null;
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t("tags.read.title")}
      size="large"
    >
      <FormContainer>
        <Text fontWeight="bold" fontSize="subtitle">
          {tag.name}
        </Text>

        <Section>
          <DataItem>
            <Text fontSize="small" color="textSecondary" fontWeight="bold">
              {t("common.description")}
            </Text>
            <Text fontStyle={!tag.description?.length ? "italic" : undefined}>
              {tag.description || t("tags.read.noDescription")}
            </Text>
          </DataItem>
        </Section>

        <Section>
          <DataItem>
            <Text fontSize="small" color="textSecondary" fontWeight="bold">
              {t("tags.read.usageCount.title")}
            </Text>
            <Text color="primary" fontWeight="600">
              {t("tags.read.usageCount.value", {
                count: tag.usageCount,
              })}
            </Text>
          </DataItem>
        </Section>

        <Section>
          <DataItem>
            <Text fontSize="small" color="textSecondary" fontWeight="bold">
              {t("common.filters.creationDate.title")}
            </Text>
            <Text>{formatDate(tag.createdAt, true)}</Text>
          </DataItem>
        </Section>
      </FormContainer>
    </Drawer>
  );
};
