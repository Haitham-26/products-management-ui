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

type FNType = (category: Order) => void;

type CreateOrdersTableColumnsArgs = {
  onEdit?: FNType;
  onRead: FNType;
  onManageStatus: FNType;
  onToggleArchive: FNType;
};

export const createOrdersTableColumns = ({
  onEdit,
  onRead,
  onManageStatus,
  onToggleArchive,
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
      title: "Total Price",
      dataIndex: "totalPriceAtPurchase",
      key: "totalPriceAtPurchase",
      width: 120,
      ellipsis: true,
      render: (value: number) => (value ? `$${value.toFixed(2)}` : "$0"),
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
                onClick: () => onRead(record),
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
                onClick: () => onManageStatus(record),
                disabled: record.status === OrderStatus.CONFIRMED,
              },
              {
                key: "toggle-archive",
                icon: (
                  <Icon icon={record.isArchived ? faBoxOpen : faBoxArchive} />
                ),
                label: record.isArchived ? "Unarchive" : "Archive",
                onClick: () => onToggleArchive(record),
              },
            ].filter((o) => o.disabled !== true),
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
