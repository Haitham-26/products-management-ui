import type React from "react";
import { Dropdown } from "../../../components/Dropdown";
import { Icon } from "../../../components/Icon";
import isFunction from "lodash/isFunction";
import { useTranslation } from "react-i18next";
import type { Product } from "../../../model/product/types/Product";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faBoxesStacked } from "@fortawesome/free-solid-svg-icons/faBoxesStacked";
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons/faCloudArrowDown";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons/faCloudArrowUp";
import styled from "styled-components";
import { ProductStatus } from "../../../model/product/types/ProductStatus.enum";

const ActionsIcon = styled(Icon)`
  margin-inline: auto;
`;

type FNType = VoidCallback<Product> | undefined;

type ProductActionsDropdownProps = {
  product: Product;
  actions: {
    onEdit?: FNType;
    onRead?: FNType;
    onDelete?: FNType;
    onToggleStatus?: FNType;
    onManageStock?: FNType;
  };
};

export const ProductActionsDropdown: React.FC<ProductActionsDropdownProps> = ({
  product,
  actions: { onEdit, onRead, onDelete, onToggleStatus, onManageStock },
}) => {
  const { t } = useTranslation();

  return (
    <Dropdown
      trigger={["click"]}
      menu={{
        items: [
          {
            key: "view",
            icon: <Icon icon={faEye} />,
            label: t("common.view"),
            onClick: () => onRead?.(product),
            disabled: !isFunction(onRead),
          },
          {
            key: "edit",
            icon: <Icon icon={faPenToSquare} />,
            label: t("common.edit"),
            onClick: () => onEdit?.(product),
            disabled: !isFunction(onEdit),
          },
          {
            key: "manage-stock",
            icon: <Icon icon={faBoxesStacked} />,
            label: t("products.actions.manageStock"),
            onClick: () => onManageStock?.(product),
            disabled: !isFunction(onManageStock),
          },
          {
            key: "toggle-status",
            icon: (
              <Icon
                icon={
                  product.status === ProductStatus.DRAFT
                    ? faCloudArrowUp
                    : faCloudArrowDown
                }
              />
            ),
            label:
              product.status === ProductStatus.DRAFT
                ? t("products.actions.publish")
                : t("products.actions.moveToDraft"),
            onClick: () => onToggleStatus?.(product),
            disabled: !isFunction(onToggleStatus),
          },
          {
            key: "delete",
            icon: <Icon icon={faTrash} />,
            label: t("common.delete"),
            danger: true,
            onClick: () => onDelete?.(product),
            disabled: !isFunction(onDelete),
          },
        ].filter((item) => item.disabled !== true),
      }}
    >
      <ActionsIcon icon={faEllipsis} />
    </Dropdown>
  );
};
