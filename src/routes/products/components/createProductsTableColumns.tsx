import type { ColumnsType } from "antd/es/table";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";

import type { Product } from "../../../model/product/types/Product";
import { Icon } from "../../../components/Icon";
import { Dropdown } from "../../../components/Dropdown";
import { formatDate } from "../../../utils/Date";
import type { ProductDiscount } from "../../../model/product/types/ProductDiscount";
import type { Category } from "../../../model/category/types/Category";
import type { Tag } from "../../../model/tag/types/Tag";

type FNType = (product: Product) => void;

type CreateProductsTableColumnsArgs = {
  onEdit: FNType;
  onDelete: FNType;
  onRead: FNType;
};

export const createProductsTableColumns = ({
  onEdit,
  onDelete,
  onRead,
}: CreateProductsTableColumnsArgs): ColumnsType<Product> => {
  return [
    {
      title: "ID",
      dataIndex: "_id",
      key: "id",
      width: 220,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 220,
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 360,
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 200,
      render: (value: Category) => value?.name,
      ellipsis: true,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      width: 200,
      render: (tags: Tag[]) => tags?.map((tag) => tag.name).join(", "),
      ellipsis: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 140,
      render: (value: number) => `${value.toFixed(2)}$`,
      sorter: (a, b) => (b?.price || 0) - (a?.price || 0),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 140,
      render: (value: number) => value || 0,
      sorter: (a, b) => b.quantity - a.quantity,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      width: 140,
      render: (value: ProductDiscount) =>
        value ? `${value.value}${value.type === "percentage" ? "%" : "$"}` : "",
    },
    {
      title: "Price After Discount",
      key: "priceAfterDiscount",
      width: 180,
      render: (_: unknown, record: Product) => {
        const { price, discount } = record;

        if (!discount) {
          return `$${price.toFixed(2)}`;
        }

        const finalPrice =
          discount.type === "percentage"
            ? price - price * (discount.value / 100)
            : price - discount.value;

        return finalPrice > 0 ? `$${finalPrice.toFixed(2)}` : "$0.00";
      },
      sorter: (a: Product, b: Product) => {
        const getFinalPrice = (product: Product) => {
          const { price, discount } = product;

          if (!discount) {
            return price;
          }

          return discount.type === "percentage"
            ? price - price * (discount.value / 100)
            : price - discount.value;
        };

        return getFinalPrice(b) - getFinalPrice(a);
      },
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
                onClick: () => onEdit(record),
              },
              {
                key: "delete",
                icon: <Icon icon={faTrash} />,
                label: "Delete",
                danger: true,
                onClick: () => onDelete(record),
              },
            ],
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
