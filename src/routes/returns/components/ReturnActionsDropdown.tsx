import type React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../../../components/Dropdown";
import { Icon } from "../../../components/Icon";
import isFunction from "lodash/isFunction";
import styled from "styled-components";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";
import type { Return } from "../../../model/return/types/Return";
import { ReturnStatus } from "../../../model/return/types/ReturnStatus.enum";

const ActionsIcon = styled(Icon)`
  margin-inline: auto;
`;

type FNType = VoidCallback<Return>;

type ReturnActionsDropdownProps = {
  record: Return;
  actions: {
    onEdit?: FNType;
    onRead?: FNType;
    onCancel?: FNType;
    onActivate?: FNType;
  };
};

export const ReturnActionsDropdown: React.FC<ReturnActionsDropdownProps> = ({
  record,
  actions: { onEdit, onRead, onCancel, onActivate },
}) => {
  const { t } = useTranslation();

  const isActive = record.status === ReturnStatus.ACTIVE;

  return (
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
          isActive
            ? {
                key: "cancel",
                icon: <Icon icon={faBan} />,
                label: t("common.cancel"),
                onClick: () => onCancel?.(record),
                disabled: !isFunction(onCancel),
                danger: true,
              }
            : {
                key: "reactivate",
                icon: <Icon icon={faRotateLeft} />,
                label: t("common.reactivate"),
                onClick: () => onActivate?.(record),
                disabled: !isFunction(onActivate),
              },
        ].filter((item) => !item.disabled),
      }}
    >
      <ActionsIcon icon={faEllipsis} />
    </Dropdown>
  );
};
