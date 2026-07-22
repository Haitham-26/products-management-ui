import type { ColumnsType } from "antd/es/table";

import { formatDate } from "../../../utils/Date";
import type { Order } from "../../../model/order/types/Order";
import type { OrderItem } from "../../../model/order/types/OrderItem";
import { stringWithCurrencyCode } from "../../../utils/String";
import type { CurrencyCodeRecord } from "currency-codes";
import type { TFunction } from "i18next";
import { OrderActionsDropdown } from "../../products/components/OrderActionsDropdown";

type FNType = VoidCallback<Order>;

type CreateOrdersTableColumnsArgs = {
  functions: {
    onEdit?: FNType;
    onRead?: FNType;
    onManageStatus?: FNType;
    onToggleArchive?: FNType;
    t: TFunction;
  };
  currency: CurrencyCodeRecord["code"];
};

export const createOrdersTableColumns = ({
  functions: { t, ...restActions },
  currency,
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
      title: t("orders.fields.totalAmount"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      ellipsis: true,
      render: (value: number) => stringWithCurrencyCode(currency, value),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: t("orders.fields.totalProfit"),
      dataIndex: "totalProfit",
      key: "totalProfit",
      width: 120,
      ellipsis: true,
      render: (value: number) => stringWithCurrencyCode(currency, value),
      sorter: (a, b) => a.totalProfit - b.totalProfit,
      onCell: (record) => ({
        className:
          record.totalProfit > 0 ? "positive-profit" : "negative-profit",
      }),
    },
    {
      title: t("common.products"),
      dataIndex: "items",
      key: "items",
      width: 220,
      ellipsis: true,
      render: (items: OrderItem[]) =>
        items.map((i) => i.productName).join(", "),
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
      title: t("common.status"),
      dataIndex: "status",
      key: "status",
      width: 90,
      ellipsis: true,
      render: (value: string) => t(`orders.status.${value.toLowerCase()}`),
      onCell: (record) => ({
        className: `${record.status.toLowerCase()}-status`,
      }),
    },
    {
      title: t("orders.fields.isArchived.title"),
      dataIndex: "isArchived",
      key: "isArchived",
      width: 90,
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
      title: t("common.filters.creationDate.title"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value: string) => formatDate(new Date(value), true),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];
};
