import type { ColumnsType } from "antd/es/table";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";

import { Icon } from "../../../components/Icon";
import { Dropdown } from "../../../components/Dropdown";
import { formatDate } from "../../../utils/Date";
import type { Order } from "../../../model/order/types/Order";
import capitalize from "lodash/capitalize";
import type { OrderItem } from "../../../model/order/types/OrderItem";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { OrderStatus } from "../../../model/order/types/OrderStatus.enum";
import isFunction from "lodash/isFunction";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons/faBoxOpen";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons/faBoxArchive";
import { stringWithCurrencyCode } from "../../../utils/String";
import type { CurrencyCodeRecord } from "currency-codes";

type FNType = (category: Order) => void;

type CreateOrdersTableColumnsArgs = {
  functions: {
    onEdit?: FNType;
    onRead?: FNType;
    onManageStatus?: FNType;
    onToggleArchive?: FNType;
  };
  currency: CurrencyCodeRecord["code"];
};

export const createOrdersTableColumns = ({
  functions: { onEdit, onRead, onManageStatus, onToggleArchive },
  currency,
}: CreateOrdersTableColumnsArgs): ColumnsType<Order> => {
  return [
    {
      title: "ID",
      dataIndex: "identifier",
      key: "identifier",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: "Customer Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Customer Phone",
      dataIndex: "customerPhone",
      key: "customerPhone",
      width: 170,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 90,
      ellipsis: true,
      render: (value: string) => capitalize(value),
      onCell: (record) => ({
        className: `${record.status.toLowerCase()}-status`,
      }),
    },
    {
      title: "Visibility",
      dataIndex: "isArchived",
      key: "isArchived",
      width: 90,
      ellipsis: true,
      render: (isArchived: boolean) => (isArchived ? "Archived" : "Active"),
      onCell: (record) => ({
        className: record.isArchived ? "archived" : "visible",
      }),
    },
    {
      title: "Total Price",
      dataIndex: "totalPriceAtPurchase",
      key: "totalPriceAtPurchase",
      width: 120,
      ellipsis: true,
      render: (value: number) => stringWithCurrencyCode(currency, value),
      sorter: (a, b) =>
        (a?.totalPriceAtPurchase || 0) - (b?.totalPriceAtPurchase || 0),
    },
    {
      title: "Products",
      dataIndex: "items",
      key: "items",
      width: 220,
      ellipsis: true,
      render: (items: OrderItem[]) =>
        items.map((i) => i.productName).join(", "),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: 360,
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value: string) => formatDate(new Date(value), true),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "view",
                icon: <Icon icon={faEye} />,
                label: "View",
                onClick: () => onRead?.(record),
                disabled: !isFunction(onRead),
              },
              {
                key: "edit",
                icon: <Icon icon={faPenToSquare} />,
                label: "Edit",
                onClick: () => onEdit?.(record),
                disabled:
                  record.status !== OrderStatus.PENDING ||
                  !isFunction(onEdit) ||
                  record.isArchived,
              },
              {
                key: "manage-status",
                icon: <Icon icon={faGear} />,
                label: "Manage Status",
                onClick: () => onManageStatus?.(record),
                disabled:
                  record.status === OrderStatus.CONFIRMED ||
                  !isFunction(onManageStatus),
              },
              {
                key: "toggle-archive",
                icon: (
                  <Icon icon={record.isArchived ? faBoxOpen : faBoxArchive} />
                ),
                label: record.isArchived ? "Unarchive" : "Archive",
                onClick: () =>
                  onToggleArchive?.(record) || !isFunction(onToggleArchive),
              },
            ].filter((item) => item.disabled !== true),
          }}
        >
          <span style={{ cursor: "pointer" }}>
            <Icon icon={faEllipsis} />
          </span>
        </Dropdown>
      ),
    },
  ];
};
