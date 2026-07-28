import type { ColumnsType } from "antd/es/table";

import { formatDate } from "../../../utils/Date";
import type { Order } from "../../../model/order/types/Order";
import type { OrderItem } from "../../../model/order/types/OrderItem";
import { stringWithCurrencyCode } from "../../../utils/String";
import type { TFunction } from "i18next";
import { OrderActionsDropdown } from "../../products/components/OrderActionsDropdown";
import type { Settings } from "../../../model/settings/types/Settings";
import camelCase from "lodash/camelCase";
import styled from "styled-components";
import type { ThemeType } from "../../../theme/theme";

const RevenueWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ReturnSpan = styled.span`
  font-size: calc(${({ theme }) => theme.typography.small} * 0.8);
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
`;

const NetProfit = styled.span<{ color: keyof ThemeType["colors"] }>`
  color: ${({ theme, color }) => theme.colors[color]};
  font-weight: bold;
`;

type FNType = VoidCallback<Order>;

type CreateOrdersTableColumnsArgs = {
  functions: {
    onEdit?: FNType;
    onRead?: FNType;
    onManageStatus?: FNType;
    onToggleArchive?: FNType;
    t: TFunction;
  };
  settings: Settings;
};

export const createOrdersTableColumns = ({
  functions: { t, ...restActions },
  settings,
}: CreateOrdersTableColumnsArgs): ColumnsType<Order> => {
  return [
    {
      title: t("common.actions"),
      key: "actions",
      width: 80,
      align: "center",
      fixed: "left",
      render: (_, record) => (
        <OrderActionsDropdown order={record} actions={restActions} />
      ),
    },
    {
      title: t("common.id"),
      dataIndex: "identifier",
      key: "identifier",
      width: 150,
      ellipsis: true,
    },
    {
      title: t("orders.fields.netRevenue"),
      dataIndex: "netRevenue",
      key: "netRevenue",
      width: 200,
      ellipsis: true,
      render: (_, record) => {
        const hasReturns = (record.returnedItems?.length ?? 0) > 0;
        return (
          <RevenueWrapper>
            <span>
              {stringWithCurrencyCode(settings.currency, record.netRevenue)}
            </span>
            {hasReturns ? (
              <ReturnSpan>
                {stringWithCurrencyCode(settings.currency, record.totalRevenue)}
              </ReturnSpan>
            ) : null}
          </RevenueWrapper>
        );
      },
      sorter: (a, b) => a.netRevenue - b.netRevenue,
    },
    {
      title: t("orders.fields.netProfit"),
      dataIndex: "netProfit",
      key: "netProfit",
      width: 180,
      render: (_, record) => {
        const hasReturns = (record.returnedItems?.length ?? 0) > 0;
        return (
          <RevenueWrapper>
            <NetProfit color={record.netProfit > 0 ? "success" : "error"}>
              {stringWithCurrencyCode(settings.currency, record.netProfit)}
            </NetProfit>
            {hasReturns ? (
              <ReturnSpan>
                {stringWithCurrencyCode(settings.currency, record.totalProfit)}
              </ReturnSpan>
            ) : null}
          </RevenueWrapper>
        );
      },
    },
    {
      title: t("common.status"),
      dataIndex: "status",
      key: "status",
      width: 140,
      ellipsis: true,
      render: (value: string) => t(`orders.status.${camelCase(value)}`),
      onCell: (record) => ({
        className: `${record.status.toLowerCase().replace("_", "-")}-status`,
      }),
    },
    {
      title: t("common.products"),
      dataIndex: "items",
      key: "items",
      width: 240,
      ellipsis: true,
      render: (items: OrderItem[]) => {
        return items
          .map((item) => {
            return `(${item.productName} × ${item.quantity})`;
          })
          .join(", ");
      },
    },
    {
      title: t("orders.fields.customerName"),
      dataIndex: "customerName",
      key: "customerName",
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: t("orders.fields.customerEmail"),
      dataIndex: "customerEmail",
      key: "customerEmail",
      width: 220,
      ellipsis: true,
    },
    {
      title: t("orders.fields.customerPhone"),
      dataIndex: "customerPhone",
      key: "customerPhone",
      width: 170,
      ellipsis: true,
    },
    {
      title: t("orders.fields.customerAddress"),
      dataIndex: "customerAddress",
      key: "customerAddress",
      width: 360,
      ellipsis: true,
    },
    {
      title: t("orders.fields.isArchived.title"),
      dataIndex: "isArchived",
      key: "isArchived",
      width: 130,
      ellipsis: true,
      render: (isArchived: boolean) =>
        t(`orders.fields.isArchived.${isArchived ? "archived" : "unarchived"}`),
      onCell: (record) => ({
        className: record.isArchived ? "archived" : "visible",
      }),
    },
    {
      title: t("common.note"),
      dataIndex: "note",
      key: "note",
      width: 360,
      ellipsis: true,
    },
    {
      title: t("common.creationDate"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value: string) =>
        formatDate(new Date(value), true, settings.timeZone),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: t("orders.fields.deliveredAt"),
      dataIndex: "lastDeliveredAt",
      key: "lastDeliveredAt",
      width: 180,
      render: (value?: string | null) =>
        value ? formatDate(new Date(value), true, settings.timeZone) : "_",
      sorter: (a, b) => {
        const timeA = a.lastDeliveredAt
          ? new Date(a.lastDeliveredAt).getTime()
          : 0;
        const timeB = b.lastDeliveredAt
          ? new Date(b.lastDeliveredAt).getTime()
          : 0;

        return timeA - timeB;
      },
    },
  ];
};
