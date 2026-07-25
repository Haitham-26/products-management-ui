import type { ColumnsType } from "antd/es/table";

import { formatDate } from "../../../utils/Date";
import type { TFunction } from "i18next";
import type { Settings } from "../../../model/settings/types/Settings";
import type { Return } from "../../../model/return/types/Return";
import { ReturnActionsDropdown } from "./ReturnActionsDropdown";

type FNType = VoidCallback<Return>;

type CreateReturnsTableColumnsArgs = {
  functions: {
    onEdit?: FNType;
    onVoid?: FNType;
    onUnvoid?: FNType;
    onRead?: FNType;
    t: TFunction;
  };
  timeZone: Settings["timeZone"];
};

export const createReturnsTableColumns = ({
  functions: { t, ...restActions },
  timeZone,
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
      width: 220,
      ellipsis: true,
      sorter: (a, b) => a.orderIdentifier.localeCompare(b.orderIdentifier),
    },
    {
      title: t("common.status"),
      dataIndex: "status",
      key: "status",
      render: (status: Return["status"]) =>
        t(`returns.fields.status.${status.toLowerCase()}`),
      width: 220,
      ellipsis: true,
    },
    {
      title: t("returns.fields.totalReturnAmount"),
      dataIndex: "totalReturnAmount",
      key: "totalReturnAmount",
      width: 220,
      ellipsis: true,
      sorter: (a, b) => a.totalReturnAmount - b.totalReturnAmount,
    },
    {
      title: t("returns.fields.totalReturnProfit"),
      dataIndex: "totalReturnProfit",
      key: "totalReturnProfit",
      width: 220,
      ellipsis: true,
      sorter: (a, b) => a.totalReturnProfit - b.totalReturnProfit,
      onCell: (record) => ({
        className:
          record.totalReturnProfit > 0 ? "positive-profit" : "negative-profit",
      }),
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
          .map((item) => `${item.productName} x ${item.totalReturnedCount}`)
          .join(", "),
      ellipsis: true,
    },
    {
      title: t("returns.fields.returnReason"),
      dataIndex: "returnReason",
      key: "returnReason",
      width: 360,
      ellipsis: true,
    },
    {
      title: t("returns.fields.returnedAt"),
      dataIndex: "returnedAt",
      key: "returnedAt",
      width: 180,
      render: (value: string) => formatDate(new Date(value), true, timeZone),
      sorter: (a, b) => {
        const timeA = a.returnedAt ? new Date(a.returnedAt).getTime() : 0;
        const timeB = b.returnedAt ? new Date(b.returnedAt).getTime() : 0;

        return timeA - timeB;
      },
    },
  ];
};
