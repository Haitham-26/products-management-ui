import type React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../../../components/Dropdown";
import { Icon } from "../../../components/Icon";
import isFunction from "lodash/isFunction";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import styled from "styled-components";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import type { Order } from "../../../model/order/types/Order";
import { OrderStatus } from "../../../model/order/types/OrderStatus.enum";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons/faBoxOpen";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons/faBoxArchive";

const ActionsIcon = styled(Icon)`
  margin-inline: auto;
`;

type FNType = VoidCallback<Order>;

type OrderActionsDropdownProps = {
  order: Order;
  actions: {
    onEdit?: FNType;
    onRead?: FNType;
    onManageStatus?: FNType;
    onToggleArchive?: FNType;
  };
};

export const OrderActionsDropdown: React.FC<OrderActionsDropdownProps> = ({
  order,
  actions: { onEdit, onRead, onManageStatus, onToggleArchive },
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
            onClick: () => onRead?.(order),
            disabled: !isFunction(onRead),
          },
          {
            key: "edit",
            icon: <Icon icon={faPenToSquare} />,
            label: t("common.edit"),
            onClick: () => onEdit?.(order),
            disabled:
              order.status !== OrderStatus.PENDING ||
              !isFunction(onEdit) ||
              order.isArchived,
          },
          {
            key: "manage-status",
            icon: <Icon icon={faGear} />,
            label: t("orders.actions.manageStatus"),
            onClick: () => onManageStatus?.(order),
            disabled:
              order.status === OrderStatus.DELIVERED ||
              !isFunction(onManageStatus),
          },
          {
            key: "toggle-archive",
            icon: <Icon icon={order.isArchived ? faBoxOpen : faBoxArchive} />,
            label: t(
              `orders.actions.${order.isArchived ? "unarchive" : "archive"}`,
            ),
            onClick: () =>
              onToggleArchive?.(order) || !isFunction(onToggleArchive),
          },
        ].filter((item) => item.disabled !== true),
      }}
    >
      <ActionsIcon icon={faEllipsis} />
    </Dropdown>
  );
};
