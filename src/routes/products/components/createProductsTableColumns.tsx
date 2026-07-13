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
import capitalize from "lodash/capitalize";
import isNaN from "lodash/isNaN";
import isFunction from "lodash/isFunction";
import { ProductDiscountTypes } from "../../../model/product/types/ProductDiscountTypes.enum";
import styled from "styled-components";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";
import { ProductStockStatus } from "../../../model/product/types/ProductStockStatus.enum";
import type { CurrencyCodeRecord } from "currency-codes";
import { stringWithCurrencyCode } from "../../../utils/String";
import { faBoxesStacked } from "@fortawesome/free-solid-svg-icons/faBoxesStacked";
import type { Settings } from "../../../model/settings/types/Settings";
import { ProductStatus } from "../../../model/product/types/ProductStatus.enum";
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons/faCloudArrowDown";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons/faCloudArrowUp";
import { ProductMainImage } from "./ProductMainImage";
import type { TFunction } from "i18next";

const QuantityContainer = styled.div<{ stockStatus: ProductStockStatus }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  span {
    color: ${({ theme, stockStatus }) => {
      if (stockStatus === ProductStockStatus.OUT_OF_STOCK) {
        return theme.colors.error;
      }

      if (stockStatus === ProductStockStatus.LOW_STOCK) {
        return theme.colors.warning;
      }

      return theme.colors.textPrimary;
    }};
    font-weight: ${({ stockStatus }) =>
      [ProductStockStatus.OUT_OF_STOCK, ProductStockStatus.LOW_STOCK].includes(
        stockStatus,
      )
        ? 700
        : 400};
  }
`;

const ActionsIcon = styled(Icon)`
  margin-inline: auto;
`;

const StockAlert = styled.div<{ danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  width: fit-content;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, danger }) =>
    danger ? `${theme.colors.error}15` : `${theme.colors.warning}15`};
  color: ${({ theme, danger }) =>
    danger ? theme.colors.error : theme.colors.warning};
  border: 1px solid
    ${({ theme, danger }) =>
      danger ? `${theme.colors.error}35` : `${theme.colors.warning}35`};
  font-size: 0.72rem;
  font-weight: 700;
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

type FNType = VoidCallback<Product>;

type CreateProductsTableColumnsArgs = {
  functions: {
    onEdit?: FNType;
    onDelete?: FNType;
    onRead?: FNType;
    onManageStock?: FNType;
    onToggleStatus?: FNType;
    t: TFunction;
  };
  currency: CurrencyCodeRecord["code"];
  settings: Settings;
};

export const createProductsTableColumns = ({
  functions: { onEdit, onDelete, onRead, onManageStock, onToggleStatus, t },
  currency,
  settings,
}: CreateProductsTableColumnsArgs): ColumnsType<Product> => {
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
                disabled: !isFunction(onEdit),
              },
              {
                key: "manage-stock",
                icon: <Icon icon={faBoxesStacked} />,
                label: t("products.actions.manageStock"),
                onClick: () => onManageStock?.(record),
                disabled: !isFunction(onManageStock),
              },
              {
                key: "toggle-status",
                icon: (
                  <Icon
                    icon={
                      record.status === ProductStatus.DRAFT
                        ? faCloudArrowUp
                        : faCloudArrowDown
                    }
                  />
                ),
                label:
                  record.status === ProductStatus.DRAFT
                    ? t("products.actions.publish")
                    : t("products.actions.moveToDraft"),
                onClick: () => onToggleStatus?.(record),
                disabled: !isFunction(onToggleStatus),
              },
              {
                key: "delete",
                icon: <Icon icon={faTrash} />,
                label: t("common.delete"),
                danger: true,
                onClick: () => onDelete?.(record),
                disabled: !isFunction(onDelete),
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
      width: 220,
    },
    {
      title: t("common.name"),
      dataIndex: "name",
      key: "name",
      width: 220,
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record) => (
        <NameContainer>
          <ProductMainImage url={record.mainImage?.secureUrl} />

          <span>{name}</span>
        </NameContainer>
      ),
    },
    {
      title: t("common.status"),
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (value: ProductStatus) =>
        capitalize(value || ProductStatus.PUBLISHED),
      onCell: (record) => ({
        className: `${(record.status || ProductStatus.PUBLISHED).toLowerCase()}-product`,
      }),
    },
    {
      title: t("products.fields.basePrice"),
      dataIndex: "price",
      key: "base-price",
      width: 140,
      render: (value: number) => stringWithCurrencyCode(currency, value),
      sorter: (a, b) => (b?.price || 0) - (a?.price || 0),
    },
    {
      title: t("common.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 180,
      render: (value: number, record) => {
        const threshold = record.minStock || settings.inventory.defaultMinStock;

        const isOutOfStock = value <= 0;
        const isLowStock = !isOutOfStock && value <= threshold;

        const stockStatus = isOutOfStock
          ? ProductStockStatus.OUT_OF_STOCK
          : isLowStock
            ? ProductStockStatus.LOW_STOCK
            : ProductStockStatus.IN_STOCK;

        return (
          <QuantityContainer stockStatus={stockStatus}>
            <span>{value}</span>

            {isOutOfStock ? (
              <StockAlert danger>
                <Icon icon={faTriangleExclamation} />
                <span>{t("products.stockStatus.outOfStock")}</span>
              </StockAlert>
            ) : isLowStock ? (
              <StockAlert>
                <Icon icon={faTriangleExclamation} />
                <span>{t("products.stockStatus.lowStock")}</span>
              </StockAlert>
            ) : null}
          </QuantityContainer>
        );
      },
      sorter: (a, b) => b.quantity - a.quantity,
    },
    {
      title: t("products.fields.discount"),
      dataIndex: "discount",
      key: "discount",
      width: 140,
      render: (value: ProductDiscount) => {
        if (!value) {
          return "";
        }

        if (value.type === ProductDiscountTypes.PERCENTAGE) {
          return `${value.value}%`;
        }

        return stringWithCurrencyCode(currency, value.value);
      },
    },
    {
      title: t("products.fields.finalPrice"),
      key: "priceAfterDiscount",
      width: 180,
      render: (_: unknown, record: Product) => {
        return record.priceAfterDiscount && !isNaN(record.priceAfterDiscount)
          ? stringWithCurrencyCode(currency, record.priceAfterDiscount)
          : stringWithCurrencyCode(currency, 0);
      },
      sorter: (a: Product, b: Product) => {
        return (b?.priceAfterDiscount || 0) - (a?.priceAfterDiscount || 0);
      },
    },
    {
      title: t("common.category"),
      dataIndex: "category",
      key: "category",
      width: 200,
      render: (value: Category) => value?.name,
      ellipsis: true,
    },
    {
      title: t("common.tags"),
      dataIndex: "tags",
      key: "tags",
      width: 200,
      render: (tags: Tag[]) => tags?.map((tag) => tag.name).join(", "),
      ellipsis: true,
    },
    {
      title: t("common.description"),
      dataIndex: "description",
      key: "description",
      width: 360,
      ellipsis: true,
    },
    {
      title: t("common.creationDate"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value: string) => formatDate(new Date(value), true),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];
};
