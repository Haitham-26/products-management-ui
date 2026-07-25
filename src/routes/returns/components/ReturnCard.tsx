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
    case ReturnStatus.VOIDED:
      return "error";
    case ReturnStatus.COMPLETED:
      return "success";
    default:
      return "warning";
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
  flex: 1;
  min-width: 0;
`;

const Identifier = styled(Text)`
  direction: ltr;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.small};
  text-align: start;

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
`;

type FNType = VoidCallback<Return> | undefined;

type ReturnCardProps = {
  record: Return;
  actions: {
    onEdit?: FNType;
    onRead?: FNType;
    onVoid?: FNType;
    onUnvoid?: FNType;
  };
};

export const ReturnCard: React.FC<ReturnCardProps> = ({ record, actions }) => {
  const { t } = useTranslation();

  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const totalRefundedItemsCount = useMemo(
    () =>
      record.items?.reduce((acc, item) => acc + item.totalReturnedCount, 0) ||
      0,
    [record.items],
  );

  return (
    <Content>
      <Header>
        <Details>
          <Text fontSize="small" color="textSecondary">
            {truncate(record.returnReason, { length: 50 })}
          </Text>

          <Identifier>#{record.orderIdentifier}</Identifier>

          <Tag color={getStatusColor(record.status)}>
            {t(`returns.status.${record.status.toLowerCase()}`)}
          </Tag>
        </Details>

        <ReturnActionsDropdown record={record} actions={actions} />
      </Header>

      <Stats>
        <Stat>
          <Text color="textSecondary" fontSize="small">
            {t("returns.fields.totalReturnAmount")}
          </Text>

          <Text fontWeight="600">
            {stringWithCurrencyCode(
              settings.currency,
              record.totalReturnAmount,
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
            {t("common.filters.creationDate.title")}
          </Text>

          <Text>
            {formatDate(
              record.returnedAt || record.createdAt,
              false,
              settings.timeZone,
            )}
          </Text>
        </Stat>

        <Stat>
          <Text color="textSecondary" fontSize="small">
            {t("returns.fields.itemsCount")}
          </Text>

          <Text>{totalRefundedItemsCount}</Text>
        </Stat>
      </Stats>
    </Content>
  );
};
