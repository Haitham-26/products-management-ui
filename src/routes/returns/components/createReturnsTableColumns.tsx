import type { ColumnsType } from "antd/es/table";

import { formatDate } from "../../../utils/Date";
import type { TFunction } from "i18next";
import type { Settings } from "../../../model/settings/types/Settings";
import type { Return } from "../../../model/return/types/Return";
import { ReturnActionsDropdown } from "./ReturnActionsDropdown";
import { stringWithCurrencyCode } from "../../../utils/String";

type FNType = VoidCallback<Return>;

type CreateReturnsTableColumnsArgs = {
  functions: {
    onEdit?: FNType;
    onVoid?: FNType;
    onUnvoid?: FNType;
    onRead?: FNType;
    t: TFunction;
  };
  settings: Settings;
};

export const createReturnsTableColumns = ({
  functions: { t, ...restActions },
  settings,
}: CreateReturnsTableColumnsArgs): ColumnsType<Return> => {
  return [
    {
      title: t("common.actions"),
      key: "actions",
      width: 80,
      align: "center",
      fixed: "left",
      render: (_, record) => (
        <ReturnActionsDropdown record={record} actions={restActions} />
      ),
    },
    {
      title: t("returns.fields.orderId"),
      dataIndex: "orderIdentifier",
      key: "orderIdentifier",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a.orderIdentifier.localeCompare(b.orderIdentifier),
    },
    {
      title: t("common.status"),
      dataIndex: "status",
      key: "status",
      render: (status: Return["status"]) =>
        t(`returns.fields.status.${status.toLowerCase()}`),
      width: 100,
      ellipsis: true,
      onCell: (record) => ({
        className: `${record.status.toLowerCase()}-return`,
      }),
    },
    {
      title: t("returns.fields.totalReturnRevenue"),
      dataIndex: "totalReturnRevenue",
      key: "totalReturnRevenue",
      render: (value: number) =>
        stringWithCurrencyCode(settings.currency, value),
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.totalReturnRevenue - b.totalReturnRevenue,
    },
    {
      title: t("returns.fields.totalReturnProfit"),
      dataIndex: "totalReturnProfit",
      key: "totalReturnProfit",
      render: (value: number) =>
        stringWithCurrencyCode(settings.currency, value),
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.totalReturnProfit - b.totalReturnProfit,
    },
    {
      title: t("common.products"),
      dataIndex: "items",
      key: "items",
      width: 220,
      render: (_, record) =>
        record.items
          .slice(0, 3)
          .filter(Boolean)
          .map((item) => `(${item.productName} x ${item.returnedQuantity})`)
          .join(", "),
      ellipsis: true,
    },
    {
      title: t("returns.fields.returnReason"),
      dataIndex: "returnReason",
      key: "returnReason",
      width: 300,
      ellipsis: true,
    },
    {
      title: t("returns.fields.returnedAt"),
      dataIndex: "returnedAt",
      key: "returnedAt",
      width: 180,
      render: (value: string) =>
        formatDate(new Date(value), true, settings.timeZone),
      sorter: (a, b) => {
        const timeA = a.returnedAt ? new Date(a.returnedAt).getTime() : 0;
        const timeB = b.returnedAt ? new Date(b.returnedAt).getTime() : 0;

        return timeA - timeB;
      },
    },
  ];
};
