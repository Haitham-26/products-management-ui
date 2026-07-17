import type { ColumnsType } from "antd/es/table";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";

import { Icon } from "../../../components/Icon";
import { Dropdown } from "../../../components/Dropdown";
import { formatDate } from "../../../utils/Date";
import type { Order } from "../../../model/order/types/Order";
import type { OrderItem } from "../../../model/order/types/OrderItem";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { OrderStatus } from "../../../model/order/types/OrderStatus.enum";
import isFunction from "lodash/isFunction";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons/faBoxOpen";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons/faBoxArchive";
import { stringWithCurrencyCode } from "../../../utils/String";
import type { CurrencyCodeRecord } from "currency-codes";
import styled from "styled-components";
import type { TFunction } from "i18next";

const ActionsIcon = styled(Icon)`
  margin-inline: auto;
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
  currency: CurrencyCodeRecord["code"];
};

export const createOrdersTableColumns = ({
  functions: { onEdit, onRead, onManageStatus, onToggleArchive, t },
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
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "view",
                icon: <Icon icon={faEye} />,
                label: t("common.view"),
                onClick: () => onRead?.(record),
                disabled: !isFunction(onRead),
              },
              {
                key: "edit",
                icon: <Icon icon={faPenToSquare} />,
                label: t("common.edit"),
                onClick: () => onEdit?.(record),
                disabled:
                  record.status !== OrderStatus.PENDING ||
                  !isFunction(onEdit) ||
                  record.isArchived,
              },
              {
                key: "manage-status",
                icon: <Icon icon={faGear} />,
                label: t("orders.actions.manageStatus"),
                onClick: () => onManageStatus?.(record),
                disabled:
                  record.status === OrderStatus.DELIVERED ||
                  !isFunction(onManageStatus),
              },
              {
                key: "toggle-archive",
                icon: (
                  <Icon icon={record.isArchived ? faBoxOpen : faBoxArchive} />
                ),
                label: t(
                  `orders.actions.${record.isArchived ? "unarchive" : "archive"}`,
                ),
                onClick: () =>
                  onToggleArchive?.(record) || !isFunction(onToggleArchive),
              },
            ].filter((item) => item.disabled !== true),
          }}
        >
          <ActionsIcon icon={faEllipsis} />
        </Dropdown>
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
      title: t("orders.fields.totalAmount"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      ellipsis: true,
      render: (value: number) => stringWithCurrencyCode(currency, value),
      sorter: (a, b) => (a?.totalAmount || 0) - (b?.totalAmount || 0),
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
