import React, { useMemo } from "react";
import styled from "styled-components";
import { Tag, type TagProps } from "antd";
import { useTranslation } from "react-i18next";

import { Text } from "../../../components/Text";
import { stringWithCurrencyCode } from "../../../utils/String";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { formatDate } from "../../../utils/Date";
import type { Return } from "../../../model/return/types/Return";
import { ReturnStatus } from "../../../model/return/types/ReturnStatus.enum";
import { ReturnActionsDropdown } from "./ReturnActionsDropdown";
import truncate from "lodash/truncate";

const getStatusColor = (status: Return["status"]): TagProps["color"] => {
  switch (status) {
    case ReturnStatus.CANCELED:
      return "error";
    case ReturnStatus.ACTIVE:
    default:
      return "success";
  }
};

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const Header = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Details = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;

  .ant-tag {
    width: fit-content;
  }
`;

const ReasonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Identifier = styled(Text)`
  direction: ltr;
  font-size: ${({ theme }) => theme.typography.small};
  text-align: start;
  font-weight: 600;

  html[dir="rtl"] & {
    text-align: end;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  p:nth-child(2) {
    margin-top: auto;
  }
`;

type FNType = VoidCallback<Return> | undefined;

type ReturnCardProps = {
  record: Return;
  actions: {
    onEdit?: FNType;
    onRead?: FNType;
    onCancel?: FNType;
    onActivate?: FNType;
  };
};

export const ReturnCard: React.FC<ReturnCardProps> = ({ record, actions }) => {
  const { t } = useTranslation();

  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const returnedItemsQuantity = useMemo(
    () =>
      record.items?.reduce((acc, item) => acc + item.returnedQuantity, 0) || 0,
    [record.items],
  );

  return (
    <Content>
      <Header>
        <Details>
          <ReasonContainer>
            <Identifier>#{record.orderIdentifier}</Identifier>

            <Tag color={getStatusColor(record.status)}>
              {t(`returns.fields.status.${record.status.toLowerCase()}`)}
            </Tag>
          </ReasonContainer>

          <Text fontSize="small" color="textSecondary">
            {truncate(record.returnReason, { length: 50 })}
          </Text>
        </Details>

        <ReturnActionsDropdown record={record} actions={actions} />
      </Header>

      <Stats>
        <Stat>
          <Text color="textSecondary" fontSize="small">
            {t("returns.fields.totalReturnRevenue")}
          </Text>

          <Text fontWeight="600">
            {stringWithCurrencyCode(
              settings.currency,
              record.totalReturnRevenue,
            )}
          </Text>
        </Stat>
        <Stat>
          <Text color="textSecondary" fontSize="small">
            {t("returns.fields.totalReturnProfit")}
          </Text>

          <Text color="error" fontWeight="600">
            {stringWithCurrencyCode(
              settings.currency,
              record.totalReturnProfit,
            )}
          </Text>
        </Stat>
        <Stat>
          <Text color="textSecondary" fontSize="small">
            {t("returns.fields.itemsCount")}
          </Text>

          <Text>{returnedItemsQuantity}</Text>
        </Stat>

        <Stat>
          <Text color="textSecondary" fontSize="small">
            {t("common.creationDate")}
          </Text>

          <Text>
            {formatDate(
              record.returnedAt || record.createdAt,
              false,
              settings.timeZone,
            )}
          </Text>
        </Stat>
      </Stats>
    </Content>
  );
};
