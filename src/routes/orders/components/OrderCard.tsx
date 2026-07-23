import React, { useMemo, type Key } from "react";
import styled from "styled-components";
import { Checkbox, Tag, type TagProps } from "antd";
import { useTranslation } from "react-i18next";

import { Text } from "../../../components/Text";
import { stringWithCurrencyCode } from "../../../utils/String";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import type { Order } from "../../../model/order/types/Order";
import { OrderActionsDropdown } from "../../products/components/OrderActionsDropdown";
import { formatDate } from "../../../utils/Date";
import { OrderStatus } from "../../../model/order/types/OrderStatus.enum";

const getStatusColor = (status: Order["status"]): TagProps["color"] => {
  switch (status) {
    case OrderStatus.CANCELED:
      return "error";
    case OrderStatus.DELIVERED:
      return "success";
    default:
      return "warning";
  }
};

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

type FNType = VoidCallback<Order> | undefined;

type OrderCardProps = {
  order: Order;
  actions: {
    onEdit?: FNType;
    onRead?: FNType;
    onManageStatus?: FNType;
    onToggleArchive?: FNType;
  };
  selectedData: Key[];
  setSelectedData: React.Dispatch<React.SetStateAction<Key[]>>;
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  actions,
  selectedData,
  setSelectedData,
}) => {
  const { t } = useTranslation();

  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const isSelected = useMemo(
    () => selectedData.includes(order._id),
    [selectedData, order._id],
  );

  const orderItemsCount = useMemo(
    () => order.items.reduce((acc, item) => acc + item.quantity, 0),
    [order.items],
  );

  return (
    <Card>
      <CheckboxWrapper>
        <Checkbox
          checked={isSelected}
          onChange={() =>
            setSelectedData((prev) =>
              prev.includes(order._id)
                ? prev.filter((id) => id !== order._id)
                : [...prev, order._id],
            )
          }
        />
      </CheckboxWrapper>

      <Content>
        <Header>
          <Details>
            <Text fontWeight="700">
              {order.customerName || t("orders.guest")}
            </Text>

            <Identifier>#{order.identifier}</Identifier>

            <Tag color={getStatusColor(order.status)}>
              {t(`orders.status.${order.status.toLowerCase()}`)}
            </Tag>
          </Details>

          <OrderActionsDropdown order={order} actions={actions} />
        </Header>

        <Stats>
          <Stat>
            <Text color="textSecondary" fontSize="small">
              {t("orders.fields.totalAmount")}
            </Text>

            <Text fontWeight="600">
              {stringWithCurrencyCode(settings.currency, order.totalAmount)}
            </Text>
          </Stat>

          <Stat>
            <Text color="textSecondary" fontSize="small">
              {t("orders.fields.totalProfit")}
            </Text>

            <Text
              color={order.totalProfit > 0 ? "success" : "error"}
              fontWeight="600"
            >
              {stringWithCurrencyCode(settings.currency, order.totalProfit)}
            </Text>
          </Stat>

          <Stat>
            <Text color="textSecondary" fontSize="small">
              {t("common.filters.creationDate.title")}
            </Text>

            <Text>{formatDate(order.createdAt, false, settings.timeZone)}</Text>
          </Stat>

          <Stat>
            <Text color="textSecondary" fontSize="small">
              {t("orders.fields.itemsCount")}
            </Text>

            <Text>{orderItemsCount}</Text>
          </Stat>
        </Stats>
      </Content>
    </Card>
  );
};
